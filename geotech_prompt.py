"""Prompt utilities for geotechnical soil report analysis."""

import json
from geotech_schema import GEOTECH_JSON_TEMPLATE


def build_extraction_prompt(report_text: str) -> str:
    """Compact extraction prompt to stay within Groq free tier limits."""
    return f"""Extract geotechnical data from this soil report. Return ONLY valid JSON, no explanation.

Use this exact structure (null if not found):
{{
  "project": {{"name": null, "client": null, "location": null, "date": null, "executed_by": null}},
  "site_conditions": {{"groundwater_table_m": null, "soil_type_general": null}},
  "bore_holes": [{{"id": null, "depth_m": null, "water_table_m": null, "strata": [{{"depth_from_m": null, "depth_to_m": null, "description": null, "soil_classification": null, "spt_n_values": [], "consistency": null}}]}}],
  "lab_results": {{"bulk_density_gm_cc": null, "dry_density_gm_cc": null, "specific_gravity": null, "moisture_content_percent": null, "liquid_limit_percent": null, "plastic_limit_percent": null, "cohesion_kg_cm2": null, "friction_angle_deg": null, "void_ratio": null, "grain_size": {{"gravel_percent": null, "sand_percent": null, "silt_percent": null, "clay_percent": null}}}},
  "foundation": {{"recommended_type": null, "shallow_footing_depth_m": null, "pile_depth_m": null, "safe_bearing_capacity_t_m2": null, "allowable_settlement_mm": null, "risk_flags": []}}
}}

Report text:
{report_text}
"""


def build_recommendation_prompt(report_text: str, extracted_data: dict) -> str:
    """
    Build prompt to generate foundation recommendations and risk assessment
    based on extracted geotechnical data.
    """
    data_str = json.dumps(extracted_data, indent=2)

    return f"""You are a senior geotechnical engineer. Based on the soil investigation data below, provide a professional foundation recommendation report.

Extracted Soil Data:
{data_str}

Provide your analysis in the following structure:

1. SITE SUMMARY
   - Brief description of subsurface conditions
   - Key soil layers and their properties

2. FOUNDATION RECOMMENDATION
   - Recommended foundation type and why
   - Recommended depth
   - Safe bearing capacity
   - Any special construction considerations

3. RISK ASSESSMENT
   - Settlement risk (Low/Medium/High) with explanation
   - Water table related risks
   - Any weak soil layers that need attention

4. CONSTRUCTION GUIDELINES
   - Pile specifications if applicable
   - Dewatering requirements
   - Any soil improvement needed

Be specific, practical, and concise. Use engineering terminology appropriate for civil engineers.
"""
