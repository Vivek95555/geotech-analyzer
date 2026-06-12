"""
Geotechnical soil report JSON schema and reference values.
Used by prompts and scoring engine.
"""

# Generic geotechnical JSON template
# All fields default to None — missing data stays null
GEOTECH_JSON_TEMPLATE = {
    "project": {
        "name": None,
        "client": None,
        "location": None,
        "date": None,
        "report_number": None,
        "executed_by": None
    },
    "site_conditions": {
        "groundwater_table_m": None,
        "topography": None,
        "soil_type_general": None
    },
    "bore_holes": [
        {
            "id": None,
            "depth_m": None,
            "water_table_m": None,
            "date_commenced": None,
            "date_completed": None,
            "strata": [
                {
                    "depth_from_m": None,
                    "depth_to_m": None,
                    "description": None,
                    "soil_classification": None,
                    "spt_n_values": [],
                    "consistency": None
                }
            ]
        }
    ],
    "lab_results": {
        "bulk_density_gm_cc": None,
        "dry_density_gm_cc": None,
        "specific_gravity": None,
        "moisture_content_percent": None,
        "liquid_limit_percent": None,
        "plastic_limit_percent": None,
        "plasticity_index": None,
        "cohesion_kg_cm2": None,
        "friction_angle_deg": None,
        "compression_index": None,
        "void_ratio": None,
        "grain_size": {
            "gravel_percent": None,
            "sand_percent": None,
            "silt_percent": None,
            "clay_percent": None
        }
    },
    "foundation": {
        "recommended_type": None,
        "shallow_footing_depth_m": None,
        "pile_depth_m": None,
        "pile_diameter_mm": None,
        "safe_bearing_capacity_t_m2": None,
        "allowable_settlement_mm": None,
        "risk_flags": []
    }
}


# SPT N-value interpretation for risk assessment
SPT_INTERPRETATION = {
    "very_loose":  {"range": (0, 4),   "label": "Very Loose / Very Soft", "risk": "high"},
    "loose":       {"range": (4, 10),  "label": "Loose / Soft",           "risk": "medium"},
    "medium":      {"range": (10, 30), "label": "Medium Dense / Stiff",   "risk": "low"},
    "dense":       {"range": (30, 50), "label": "Dense / Very Stiff",     "risk": "low"},
    "very_dense":  {"range": (50, 999),"label": "Very Dense / Hard",      "risk": "low"},
}


# Risk thresholds
RISK_THRESHOLDS = {
    "water_table_shallow_m": 2.0,    # Water table above this = high risk
    "spt_weak_threshold": 5,         # Average SPT below this = high risk
    "spt_medium_threshold": 10,      # Average SPT below this = medium risk
    "settlement_high_mm": 100,       # Estimated settlement above this = high risk
    "settlement_medium_mm": 50,      # Estimated settlement above this = medium risk
}
