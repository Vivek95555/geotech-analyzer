"""
Geotechnical risk scoring engine.
Calculates site risk level and flags from extracted data.
"""

import re
from geotech_schema import SPT_INTERPRETATION, RISK_THRESHOLDS


def to_float(val):
    """Convert a value to float, handling strings like '10.0m'."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        match = re.search(r"[\d.]+", val)
        return float(match.group()) if match else None
    return None


def clean_extracted_data(data: dict) -> dict:
    """
    Post-process extracted data:
    - Remove bore holes with all null values
    - Convert string numbers to floats
    - Deduplicate bore holes
    """
    bore_holes = data.get("bore_holes", [])
    clean_bhs = []
    seen_ids = set()

    for bh in bore_holes:
        bh["depth_m"] = to_float(bh.get("depth_m"))
        bh["water_table_m"] = to_float(bh.get("water_table_m"))

        has_data = (
            bh.get("depth_m") is not None or
            bh.get("id") is not None or
            any(
                s.get("description") or s.get("spt_n_values")
                for s in bh.get("strata", [])
            )
        )
        if not has_data:
            continue

        bh_id = bh.get("id") or str(bh.get("depth_m"))
        if bh_id in seen_ids:
            continue
        seen_ids.add(bh_id)

        clean_strata = []
        for s in bh.get("strata", []):
            s["depth_from_m"] = to_float(s.get("depth_from_m"))
            s["depth_to_m"] = to_float(s.get("depth_to_m"))
            # Clean SPT values — keep only actual numbers
            raw_spt = s.get("spt_n_values", [])
            s["spt_n_values"] = [
                v for v in raw_spt
                if isinstance(v, (int, float)) and not isinstance(v, bool)
            ]
            if s.get("description") or s.get("depth_from_m") is not None:
                clean_strata.append(s)
        bh["strata"] = clean_strata
        clean_bhs.append(bh)

    data["bore_holes"] = clean_bhs

    sc = data.get("site_conditions", {})
    if sc:
        sc["groundwater_table_m"] = to_float(sc.get("groundwater_table_m"))

    return data


def get_spt_label(n_value: float) -> dict:
    """Return consistency label and risk level for an SPT N-value."""
    for key, info in SPT_INTERPRETATION.items():
        low, high = info["range"]
        if low <= n_value < high:
            return {"label": info["label"], "risk": info["risk"]}
    return {"label": "Unknown", "risk": "unknown"}


def calculate_average_spt(bore_holes: list) -> float | None:
    """Calculate average SPT N-value across all bore holes and strata."""
    all_values = []
    for bh in bore_holes:
        for stratum in bh.get("strata", []):
            values = stratum.get("spt_n_values", [])
            if values:
                for v in values:
                    # Only include actual numbers, skip dicts/strings/None
                    if isinstance(v, (int, float)) and not isinstance(v, bool):
                        all_values.append(v)
    return round(sum(all_values) / len(all_values), 1) if all_values else None


def assess_risk(extracted_data: dict) -> dict:
    """
    Assess overall site risk based on extracted geotechnical data.

    Returns:
    {
        "risk_level": "Low" | "Medium" | "High",
        "risk_score": int (0-100),
        "risk_flags": [list of warning strings],
        "spt_summary": { average_n, label, risk },
        "water_table_risk": "Low" | "Medium" | "High"
    }
    """
    risk_flags = []
    risk_points = 0

    bore_holes = extracted_data.get("bore_holes", [])
    lab = extracted_data.get("lab_results", {})
    foundation = extracted_data.get("foundation", {})
    site = extracted_data.get("site_conditions", {})

    # --- Water table risk ---
    water_table = (
        site.get("groundwater_table_m")
        or (bore_holes[0].get("water_table_m") if bore_holes else None)
    )
    water_table_risk = "Low"
    if water_table is not None:
        if water_table <= RISK_THRESHOLDS["water_table_shallow_m"]:
            risk_flags.append(
                f"Shallow water table at {water_table}m — dewatering required during excavation"
            )
            risk_points += 25
            water_table_risk = "High"
        elif water_table <= 3.0:
            risk_flags.append(
                f"Water table at {water_table}m — monitor during construction"
            )
            risk_points += 10
            water_table_risk = "Medium"

    # --- SPT N-value risk ---
    avg_spt = calculate_average_spt(bore_holes)
    spt_info = get_spt_label(avg_spt) if avg_spt is not None else {"label": "Unknown", "risk": "unknown"}

    if avg_spt is not None:
        if avg_spt < RISK_THRESHOLDS["spt_weak_threshold"]:
            risk_flags.append(
                f"Very low average SPT N-value ({avg_spt}) — weak/soft soil, high settlement risk"
            )
            risk_points += 35
        elif avg_spt < RISK_THRESHOLDS["spt_medium_threshold"]:
            risk_flags.append(
                f"Low average SPT N-value ({avg_spt}) — moderate strength, monitor settlement"
            )
            risk_points += 15

    # --- Strata specific risks ---
    for bh in bore_holes:
        for stratum in bh.get("strata", []):
            desc = (stratum.get("description") or "").lower()
            if any(word in desc for word in ["decomposed wood", "organic", "peat", "fill", "debris"]):
                risk_flags.append(
                    f"Organic/fill layer detected in {bh.get('id', 'BH')} "
                    f"({stratum.get('depth_from_m')}–{stratum.get('depth_to_m')}m) — "
                    f"avoid founding in this layer"
                )
                risk_points += 20

    # --- Settlement risk from lab results ---
    void_ratio = lab.get("void_ratio")
    if void_ratio is not None and void_ratio > 0.8:
        risk_flags.append(
            f"High void ratio ({void_ratio}) — significant consolidation settlement expected"
        )
        risk_points += 15

    moisture = lab.get("moisture_content_percent")
    if moisture is not None and moisture > 40:
        risk_flags.append(
            f"High natural moisture content ({moisture}%) — soft compressible soil"
        )
        risk_points += 10

    # --- Foundation type risk ---
    foundation_type = foundation.get("recommended_type", "")
    if foundation_type and "pile" in foundation_type.lower():
        risk_flags.append(
            "Pile foundation required — shallow foundation not adequate for this site"
        )

    # --- Existing risk flags from extraction ---
    for flag in foundation.get("risk_flags", []):
        if flag and flag not in risk_flags:
            risk_flags.append(flag)

    # --- Overall risk level ---
    risk_score = min(risk_points, 100)
    if risk_score >= 50:
        risk_level = "High"
    elif risk_score >= 25:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "risk_flags": risk_flags,
        "spt_summary": {
            "average_n": avg_spt,
            "label": spt_info["label"],
            "risk": spt_info["risk"]
        },
        "water_table_risk": water_table_risk
    }
