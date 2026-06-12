"""
PDF Report Generator using ReportLab.
Generates a professional geotechnical report PDF.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
from datetime import datetime


# Color scheme
BLUE      = colors.HexColor("#1e40af")
LIGHT_BLUE= colors.HexColor("#dbeafe")
DARK      = colors.HexColor("#1e293b")
GRAY      = colors.HexColor("#64748b")
LIGHT_GRAY= colors.HexColor("#f1f5f9")
RED       = colors.HexColor("#dc2626")
YELLOW    = colors.HexColor("#d97706")
GREEN     = colors.HexColor("#16a34a")


def get_risk_color(risk_level: str):
    return {"High": RED, "Medium": YELLOW, "Low": GREEN}.get(risk_level, GRAY)


def generate_report_pdf(extracted_data: dict, risk_assessment: dict, recommendations: str) -> bytes:
    """Generate a professional PDF report. Returns bytes."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )

    styles = getSampleStyleSheet()
    story = []

    # Custom styles
    title_style = ParagraphStyle("Title", parent=styles["Normal"],
        fontSize=18, fontName="Helvetica-Bold", textColor=BLUE,
        alignment=TA_CENTER, spaceAfter=6)

    subtitle_style = ParagraphStyle("Subtitle", parent=styles["Normal"],
        fontSize=10, fontName="Helvetica", textColor=GRAY,
        alignment=TA_CENTER, spaceAfter=20)

    section_style = ParagraphStyle("Section", parent=styles["Normal"],
        fontSize=12, fontName="Helvetica-Bold", textColor=BLUE,
        spaceBefore=16, spaceAfter=8)

    body_style = ParagraphStyle("Body", parent=styles["Normal"],
        fontSize=9, fontName="Helvetica", textColor=DARK,
        leading=14, spaceAfter=6)

    small_style = ParagraphStyle("Small", parent=styles["Normal"],
        fontSize=8, fontName="Helvetica", textColor=GRAY)

    # ─── HEADER ───────────────────────────────────────────
    project = extracted_data.get("project", {})
    risk_level = risk_assessment.get("risk_level", "Unknown")
    risk_score = risk_assessment.get("risk_score", 0)
    risk_color = get_risk_color(risk_level)

    story.append(Paragraph("GEOTECHNICAL SOIL INVESTIGATION REPORT", title_style))
    story.append(Paragraph("AI-Powered Analysis", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=BLUE))
    story.append(Spacer(1, 12))

    # ─── PROJECT INFO TABLE ───────────────────────────────
    story.append(Paragraph("1. PROJECT INFORMATION", section_style))

    proj_data = [
        ["Project Name", project.get("name") or "—"],
        ["Client", project.get("client") or "—"],
        ["Location", project.get("location") or "—"],
        ["Date", project.get("date") or "—"],
        ["Executed By", project.get("executed_by") or "—"],
        ["Report Generated", datetime.now().strftime("%d %B %Y")],
    ]

    proj_table = Table(proj_data, colWidths=[4*cm, 13*cm])
    proj_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), LIGHT_BLUE),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (0, 0), (0, -1), BLUE),
        ("TEXTCOLOR", (1, 0), (1, -1), DARK),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, LIGHT_GRAY]),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(proj_table)
    story.append(Spacer(1, 12))

    # ─── RISK ASSESSMENT ─────────────────────────────────
    story.append(Paragraph("2. RISK ASSESSMENT", section_style))

    risk_data = [
        ["Overall Risk Level", risk_level, "Risk Score", f"{risk_score}/100"],
        ["Water Table Risk", risk_assessment.get("water_table_risk", "—"),
         "Avg. SPT N-Value", str(risk_assessment.get("spt_summary", {}).get("average_n") or "—")],
        ["SPT Classification", risk_assessment.get("spt_summary", {}).get("label", "—"), "", ""],
    ]

    risk_table = Table(risk_data, colWidths=[4*cm, 5*cm, 4*cm, 4*cm])
    risk_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), LIGHT_BLUE),
        ("BACKGROUND", (2, 0), (2, -1), LIGHT_BLUE),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (1, 0), (1, 0), risk_color),
        ("FONTNAME", (1, 0), (1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(risk_table)
    story.append(Spacer(1, 8))

    # Risk flags
    risk_flags = risk_assessment.get("risk_flags", [])
    if risk_flags:
        story.append(Paragraph("Risk Flags:", ParagraphStyle("Bold", parent=body_style, fontName="Helvetica-Bold")))
        for flag in risk_flags:
            story.append(Paragraph(f"⚠  {flag}", body_style))
    story.append(Spacer(1, 8))

    # ─── BORE HOLE DATA ───────────────────────────────────
    bore_holes = extracted_data.get("bore_holes", [])
    if bore_holes:
        story.append(Paragraph("3. BORE HOLE DATA", section_style))

        for bh in bore_holes:
            bh_id = bh.get("id") or "BH"
            depth = bh.get("depth_m")
            wt = bh.get("water_table_m")

            header = f"{bh_id}  |  Depth: {depth}m  |  Water Table: {wt}m" if depth else bh_id
            story.append(Paragraph(header, ParagraphStyle("BHHeader", parent=body_style,
                fontName="Helvetica-Bold", textColor=BLUE)))

            strata = bh.get("strata", [])
            if strata:
                strata_data = [["Depth (m)", "Description", "Classification", "SPT N-Values", "Consistency"]]
                for s in strata:
                    depth_range = f"{s.get('depth_from_m', '?')} – {s.get('depth_to_m', '?')}"
                    n_vals = ", ".join(str(n) for n in s.get("spt_n_values", [])) or "—"
                    strata_data.append([
                        depth_range,
                        Paragraph(s.get("description") or "—", small_style),
                        s.get("soil_classification") or "—",
                        n_vals,
                        s.get("consistency") or "—"
                    ])

                strata_table = Table(strata_data, colWidths=[2.5*cm, 6*cm, 3*cm, 3*cm, 2.5*cm])
                strata_table.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), BLUE),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 8),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_GRAY]),
                    ("PADDING", (0, 0), (-1, -1), 5),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]))
                story.append(strata_table)
            story.append(Spacer(1, 8))

    # ─── LAB RESULTS ──────────────────────────────────────
    lab = extracted_data.get("lab_results", {})
    if lab:
        story.append(Paragraph("4. LABORATORY TEST RESULTS", section_style))

        lab_items = [
            ("Dry Density", lab.get("dry_density_gm_cc"), "gm/cc"),
            ("Bulk Density", lab.get("bulk_density_gm_cc"), "gm/cc"),
            ("Specific Gravity", lab.get("specific_gravity"), ""),
            ("Moisture Content", lab.get("moisture_content_percent"), "%"),
            ("Liquid Limit", lab.get("liquid_limit_percent"), "%"),
            ("Plastic Limit", lab.get("plastic_limit_percent"), "%"),
            ("Cohesion (c)", lab.get("cohesion_kg_cm2"), "kg/cm²"),
            ("Friction Angle (φ)", lab.get("friction_angle_deg"), "°"),
            ("Void Ratio", lab.get("void_ratio"), ""),
            ("Compression Index", lab.get("compression_index"), ""),
        ]

        # Split into two columns
        left = [r for i, r in enumerate(lab_items) if i % 2 == 0]
        right = [r for i, r in enumerate(lab_items) if i % 2 == 1]

        lab_data = [["Parameter", "Value", "Parameter", "Value"]]
        for i in range(max(len(left), len(right))):
            l = left[i] if i < len(left) else ("", "", "")
            r = right[i] if i < len(right) else ("", "", "")
            lval = f"{l[1]} {l[2]}" if l[1] is not None else "—"
            rval = f"{r[1]} {r[2]}" if r[1] is not None else "—"
            if l[0]:
                lab_data.append([l[0], lval, r[0], rval])

        lab_table = Table(lab_data, colWidths=[4.5*cm, 3*cm, 4.5*cm, 3*cm])
        lab_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), BLUE),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BACKGROUND", (0, 1), (0, -1), LIGHT_BLUE),
            ("BACKGROUND", (2, 1), (2, -1), LIGHT_BLUE),
            ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
            ("FONTNAME", (2, 1), (2, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_GRAY]),
            ("PADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(lab_table)
        story.append(Spacer(1, 8))

    # ─── FOUNDATION RECOMMENDATION ────────────────────────
    found = extracted_data.get("foundation", {})
    if found:
        story.append(Paragraph("5. FOUNDATION RECOMMENDATION", section_style))

        found_items = [
            ["Foundation Type", found.get("recommended_type") or "—"],
            ["Foundation Depth", f"{found.get('shallow_footing_depth_m')} m" if found.get("shallow_footing_depth_m") else "—"],
            ["Pile Depth", f"{found.get('pile_depth_m')} m" if found.get("pile_depth_m") else "—"],
            ["Safe Bearing Capacity", f"{found.get('safe_bearing_capacity_t_m2')} t/m²" if found.get("safe_bearing_capacity_t_m2") else "—"],
            ["Allowable Settlement", f"{found.get('allowable_settlement_mm')} mm" if found.get("allowable_settlement_mm") else "—"],
        ]

        found_table = Table(found_items, colWidths=[5*cm, 12*cm])
        found_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), LIGHT_BLUE),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("TEXTCOLOR", (0, 0), (0, -1), BLUE),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, LIGHT_GRAY]),
            ("PADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(found_table)
        story.append(Spacer(1, 8))

    # ─── RECOMMENDATIONS ──────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("6. DETAILED RECOMMENDATIONS", section_style))

    if recommendations:
        lines = recommendations.split("\n")
        for line in lines:
            line = line.strip()
            if not line:
                story.append(Spacer(1, 4))
                continue
            # Strip markdown
            line = line.replace("**", "").replace("## ", "").replace("### ", "").replace("---", "")
            if line.startswith("#"):
                story.append(Paragraph(line.lstrip("#").strip(),
                    ParagraphStyle("H", parent=body_style, fontName="Helvetica-Bold", fontSize=10)))
            elif line.startswith("* ") or line.startswith("- "):
                story.append(Paragraph(f"•  {line[2:]}", body_style))
            else:
                story.append(Paragraph(line, body_style))

    # ─── FOOTER ───────────────────────────────────────────
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=GRAY))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        f"Generated by GeoTech Analyzer  |  {datetime.now().strftime('%d %B %Y %H:%M')}",
        ParagraphStyle("Footer", parent=small_style, alignment=TA_CENTER)
    ))

    doc.build(story)
    return buffer.getvalue()
