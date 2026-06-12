# Geotechnical Soil Report Analyzer

AI-powered tool for civil engineers and builders to analyze geotechnical soil investigation reports.

## What it does
- Upload any soil investigation PDF (scanned or digital)
- Extracts bore hole data, SPT N-values, strata layers, lab results
- Calculates site risk score (Low / Medium / High)
- Generates foundation recommendations

## Tech Stack
- **Backend:** FastAPI + Python
- **OCR:** Tesseract (works on scanned PDFs)
- **LLM:** Groq (llama-3.1-8b-instant) — two-pass extraction
- **Frontend:** Next.js + Recharts + TailwindCSS

## Project Structure
```	
Response body
Download
{
  "extracted_data": {
    "project": {
      "name": "GEOTECHNICAL INVESTIGATION FOR PROPOSED WINDMILL FOUNDATION AT LOCATION JDA-13 AT BALNABA VILLAGE, BHUJ-KUTCH",
      "client": "M/S SUZLON INFRASTRUCTURES SERVICES LTD",
      "location": "JDA 13, Balnaba Village",
      "date": "18/02/2010",
      "executed_by": "GEO TEST HOUSE"
    },
    "site_conditions": {
      "groundwater_table_m": 1.2,
      "soil_type_general": "VERY SENSITIVE CLAYS ( SOFT ALLUVIAL, ESTUARINE AND MARINE CLAYS )"
    },
    "bore_holes": [
      {
        "id": null,
        "depth_m": 10,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": 0,
            "depth_to_m": 10,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": 10,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": 0,
            "depth_to_m": 0.3,
            "description": "Brownish Black Silty Clay of High Plasticity with Little Gravel",
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          },
          {
            "depth_from_m": 0.3,
            "depth_to_m": 5.1,
            "description": "Brownish Yellow Very Stiff Silty Clay of Medium Plasticity with Little Gravel",
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          },
          {
            "depth_from_m": 5.1,
            "depth_to_m": 10,
            "description": "Yellow Hard Silty Clay of Low Plasticity with Little Gravel",
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": "01",
        "depth_m": 10,
        "water_table_m": 1.2,
        "strata": [
          {
            "depth_from_m": 0,
            "depth_to_m": 1.2,
            "description": "Brownish Black Silty Clay of High Plasticity with Little Gravel",
            "soil_classification": "SY",
            "spt_n_values": [
              4.535
            ],
            "consistency": "High swelling characteristic"
          },
          {
            "depth_from_m": 1.2,
            "depth_to_m": 2.25,
            "description": "Brownish Yellow Very Stiff Silty Clay of Medium Plasticity with Little Gravel",
            "soil_classification": "SAS",
            "spt_n_values": [
              5.35
            ],
            "consistency": "Very Stiff"
          },
          {
            "depth_from_m": 2.25,
            "depth_to_m": 10,
            "description": "Yellow Hard Silty Clay of Low Plasticity with Little Gravel",
            "soil_classification": "SAS",
            "spt_n_values": [
              7.092
            ],
            "consistency": "Hard"
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      }
    ],
    "lab_results": {
      "bulk_density_gm_cc": 1.541,
      "dry_density_gm_cc": 1.937,
      "specific_gravity": 2.551,
      "moisture_content_percent": 0.13,
      "liquid_limit_percent": 40,
      "plastic_limit_percent": 20,
      "cohesion_kg_cm2": 0.48,
      "friction_angle_deg": 8,
      "void_ratio": 0.6554,
      "grain_size": {
        "gravel_percent": null,
        "sand_percent": null,
        "silt_percent": null,
        "clay_percent": null
      }
    },
    "foundation": {
      "recommended_type": "RCC Circular Raft",
      "shallow_footing_depth_m": null,
      "pile_depth_m": null,
      "safe_bearing_capacity_t_m2": 19.84,
      "allowable_settlement_mm": 100,
      "risk_flags": []
    }
  },
  "risk_assessment": {
    "risk_level": "Medium",
    "risk_score": 40,
    "risk_flags": [
      "Shallow water table at 1.2m — dewatering required during excavation",
      "Low average SPT N-value (5.7) — moderate strength, monitor settlement"
    ],
    "spt_summary": {
      "average_n": 5.7,
      "label": "Loose / Soft",
      "risk": "medium"
    },
    "water_table_risk": "High"
  },
  "recommendations": "**FOUNDATION RECOMMENDATION REPORT**\n\n**1. SITE SUMMARY**\n\nThe subsurface conditions at the proposed windmill location (JDA-13, Balnaba Village) consist of very sensitive clays (soft alluvial, estuarine, and marine clays) with a groundwater table at 1.2 meters below ground level. The soil profile is characterized by three distinct layers:\n\n- **Layer 1 (0-1.2 meters):** Brownish Black Silty Clay of High Plasticity with Little Gravel, exhibiting high swelling characteristics.\n- **Layer 2 (1.2-2.25 meters):** Brownish Yellow Very Stiff Silty Clay of Medium Plasticity with Little Gravel, showing very stiff consistency.\n- **Layer 3 (2.25-10 meters):** Yellow Hard Silty Clay of Low Plasticity with Little Gravel, exhibiting hard consistency.\n\n**2. FOUNDATION RECOMMENDATION**\n\nBased on the site conditions and soil properties, I recommend a **RCC Circular Raft Foundation**. This type of foundation is suitable for the very sensitive clays present at the site, as it distributes the loads evenly and minimizes settlement risks.\n\n- **Recommended Depth:** The recommended depth of the raft foundation is 10 meters, which covers the entire soil profile and ensures that the foundation is below the groundwater table.\n- **Safe Bearing Capacity:** The safe bearing capacity of the soil is estimated to be 19.84 t/m², which is sufficient to support the windmill's loads.\n- **Special Construction Considerations:** Due to the high plasticity and swelling characteristics of the soil in Layer 1, it is essential to ensure that the foundation is designed and constructed to prevent excessive settlement and to minimize the risk of soil liquefaction.\n\n**3. RISK ASSESSMENT**\n\n- **Settlement Risk:** Medium. The presence of sensitive clays and the high plasticity of the soil in Layer 1 increase the risk of excessive settlement. However, the recommended raft foundation design and construction methods should mitigate this risk.\n- **Water Table Related Risks:** Low. The groundwater table is at a relatively shallow depth, and the raft foundation is designed to be below the water table.\n- **Weak Soil Layers:** Layer 1 (0-1.2 meters) is the most critical layer, with high swelling characteristics and high plasticity. It is essential to monitor the soil behavior during construction and to implement measures to prevent excessive settlement.\n\n**4. CONSTRUCTION GUIDELINES**\n\n- **Pile Specifications:** Not required, as the recommended raft foundation is designed to be shallow and to distribute the loads evenly.\n- **Dewatering Requirements:** Not required, as the raft foundation is designed to be below the groundwater table.\n- **Soil Improvement:** Not recommended, as the soil properties are suitable for the recommended foundation design. However, it is essential to monitor the soil behavior during construction and to implement measures to prevent excessive settlement."
}	
Response body
Download
{
  "extracted_data": {
    "project": {
      "name": "GEOTECHNICAL INVESTIGATION FOR PROPOSED WINDMILL FOUNDATION AT LOCATION JDA-13 AT BALNABA VILLAGE, BHUJ-KUTCH",
      "client": "M/S SUZLON INFRASTRUCTURES SERVICES LTD",
      "location": "JDA 13, Balnaba Village",
      "date": "18/02/2010",
      "executed_by": "GEO TEST HOUSE"
    },
    "site_conditions": {
      "groundwater_table_m": 1.2,
      "soil_type_general": "VERY SENSITIVE CLAYS ( SOFT ALLUVIAL, ESTUARINE AND MARINE CLAYS )"
    },
    "bore_holes": [
      {
        "id": null,
        "depth_m": 10,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": 0,
            "depth_to_m": 10,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": null,
        "depth_m": 10,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": 0,
            "depth_to_m": 0.3,
            "description": "Brownish Black Silty Clay of High Plasticity with Little Gravel",
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          },
          {
            "depth_from_m": 0.3,
            "depth_to_m": 5.1,
            "description": "Brownish Yellow Very Stiff Silty Clay of Medium Plasticity with Little Gravel",
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          },
          {
            "depth_from_m": 5.1,
            "depth_to_m": 10,
            "description": "Yellow Hard Silty Clay of Low Plasticity with Little Gravel",
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      },
      {
        "id": "01",
        "depth_m": 10,
        "water_table_m": 1.2,
        "strata": [
          {
            "depth_from_m": 0,
            "depth_to_m": 1.2,
            "description": "Brownish Black Silty Clay of High Plasticity with Little Gravel",
            "soil_classification": "SY",
            "spt_n_values": [
              4.535
            ],
            "consistency": "High swelling characteristic"
          },
          {
            "depth_from_m": 1.2,
            "depth_to_m": 2.25,
            "description": "Brownish Yellow Very Stiff Silty Clay of Medium Plasticity with Little Gravel",
            "soil_classification": "SAS",
            "spt_n_values": [
              5.35
            ],
            "consistency": "Very Stiff"
          },
          {
            "depth_from_m": 2.25,
            "depth_to_m": 10,
            "description": "Yellow Hard Silty Clay of Low Plasticity with Little Gravel",
            "soil_classification": "SAS",
            "spt_n_values": [
              7.092
            ],
            "consistency": "Hard"
          }
        ]
      },
      {
        "id": null,
        "depth_m": null,
        "water_table_m": null,
        "strata": [
          {
            "depth_from_m": null,
            "depth_to_m": null,
            "description": null,
            "soil_classification": null,
            "spt_n_values": [],
            "consistency": null
          }
        ]
      }
    ],
    "lab_results": {
      "bulk_density_gm_cc": 1.541,
      "dry_density_gm_cc": 1.937,
      "specific_gravity": 2.551,
      "moisture_content_percent": 0.13,
      "liquid_limit_percent": 40,
      "plastic_limit_percent": 20,
      "cohesion_kg_cm2": 0.48,
      "friction_angle_deg": 8,
      "void_ratio": 0.6554,
      "grain_size": {
        "gravel_percent": null,
        "sand_percent": null,
        "silt_percent": null,
        "clay_percent": null
      }
    },
    "foundation": {
      "recommended_type": "RCC Circular Raft",
      "shallow_footing_depth_m": null,
      "pile_depth_m": null,
      "safe_bearing_capacity_t_m2": 19.84,
      "allowable_settlement_mm": 100,
      "risk_flags": []
    }
  },
  "risk_assessment": {
    "risk_level": "Medium",
    "risk_score": 40,
    "risk_flags": [
      "Shallow water table at 1.2m — dewatering required during excavation",
      "Low average SPT N-value (5.7) — moderate strength, monitor settlement"
    ],
    "spt_summary": {
      "average_n": 5.7,
      "label": "Loose / Soft",
      "risk": "medium"
    },
    "water_table_risk": "High"
  },
  "recommendations": "**FOUNDATION RECOMMENDATION REPORT**\n\n**1. SITE SUMMARY**\n\nThe subsurface conditions at the proposed windmill location (JDA-13, Balnaba Village) consist of very sensitive clays (soft alluvial, estuarine, and marine clays) with a groundwater table at 1.2 meters below ground level. The soil profile is characterized by three distinct layers:\n\n- **Layer 1 (0-1.2 meters):** Brownish Black Silty Clay of High Plasticity with Little Gravel, exhibiting high swelling characteristics.\n- **Layer 2 (1.2-2.25 meters):** Brownish Yellow Very Stiff Silty Clay of Medium Plasticity with Little Gravel, showing very stiff consistency.\n- **Layer 3 (2.25-10 meters):** Yellow Hard Silty Clay of Low Plasticity with Little Gravel, exhibiting hard consistency.\n\n**2. FOUNDATION RECOMMENDATION**\n\nBased on the site conditions and soil properties, I recommend a **RCC Circular Raft Foundation**. This type of foundation is suitable for the very sensitive clays present at the site, as it distributes the loads evenly and minimizes settlement risks.\n\n- **Recommended Depth:** The recommended depth of the raft foundation is 10 meters, which covers the entire soil profile and ensures that the foundation is below the groundwater table.\n- **Safe Bearing Capacity:** The safe bearing capacity of the soil is estimated to be 19.84 t/m², which is sufficient to support the windmill's loads.\n- **Special Construction Considerations:** Due to the high plasticity and swelling characteristics of the soil in Layer 1, it is essential to ensure that the foundation is designed and constructed to prevent excessive settlement and to minimize the risk of soil liquefaction.\n\n**3. RISK ASSESSMENT**\n\n- **Settlement Risk:** Medium. The presence of sensitive clays and the high plasticity of the soil in Layer 1 increase the risk of excessive settlement. However, the recommended raft foundation design and construction methods should mitigate this risk.\n- **Water Table Related Risks:** Low. The groundwater table is at a relatively shallow depth, and the raft foundation is designed to be below the water table.\n- **Weak Soil Layers:** Layer 1 (0-1.2 meters) is the most critical layer, with high swelling characteristics and high plasticity. It is essential to monitor the soil behavior during construction and to implement measures to prevent excessive settlement.\n\n**4. CONSTRUCTION GUIDELINES**\n\n- **Pile Specifications:** Not required, as the recommended raft foundation is designed to be shallow and to distribute the loads evenly.\n- **Dewatering Requirements:** Not required, as the raft foundation is designed to be below the groundwater table.\n- **Soil Improvement:** Not recommended, as the soil properties are suitable for the recommended foundation design. However, it is essential to monitor the soil behavior during construction and to implement measures to prevent excessive settlement."
}
├── app.py              # FastAPI backend
├── geotech_schema.py   # JSON schema + risk thresholds
├── geotech_prompt.py   # LLM prompts
├── geotech_score.py    # Risk scoring engine
├── frontend/           # Next.js dashboard
├── .env                # API keys
└── requirements.txt
```

## Setup

### Backend
```
pip install -r requirements.txt
python app.py
```
Runs on http://localhost:5000

### Frontend
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:3000

### API Docs
http://localhost:5000/docs
