import os
import json
import logging
import time
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pdf2image import convert_from_bytes
from google import genai
from google.genai import types
from google.oauth2 import service_account
import google.auth.transport.requests
from dotenv import load_dotenv

from geotech_prompt import build_extraction_prompt, build_recommendation_prompt
from geotech_score import assess_risk, clean_extracted_data
from db import upload_pdf_to_storage, save_report, get_all_reports, get_report_by_id, delete_report
from pdf_export import generate_report_pdf

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
log = logging.getLogger("geotech-api")

# Configure Gemini via service account (uses GCP billing + credits)
GCP_PROJECT = os.getenv("GCP_PROJECT_ID", "gen-lang-client-0435750071")
GCP_LOCATION = os.getenv("GCP_LOCATION", "us-central1")
GEMINI_MODEL = "gemini-2.5-flash"

SERVICE_ACCOUNT_JSON = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
if SERVICE_ACCOUNT_JSON:
    sa_info = json.loads(SERVICE_ACCOUNT_JSON)
    credentials = service_account.Credentials.from_service_account_info(
        sa_info,
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    # Refresh token
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    gemini_client = genai.Client(
        vertexai=True,
        project=GCP_PROJECT,
        location=GCP_LOCATION,
        credentials=credentials
    )
    log.info(f"Gemini client initialized via service account. Project: {GCP_PROJECT}")
else:
    # Fallback for local dev with API key
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    log.info("Gemini client initialized via API key.")

log.info(f"Model: {GEMINI_MODEL}")

app = FastAPI(title="Geotechnical Soil Report Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_text_with_gemini_vision(pdf_bytes: bytes) -> str:
    """Convert PDF pages to images and send to Gemini Vision for OCR."""
    log.info("Converting PDF to images at 150 DPI...")
    pages = convert_from_bytes(pdf_bytes, dpi=150)
    log.info(f"PDF has {len(pages)} page(s). Sending to Gemini Vision...")
    t = time.time()

    parts = []
    for page_image in pages:
        buf = BytesIO()
        page_image.save(buf, format="JPEG", quality=80)
        buf.seek(0)
        parts.append(types.Part.from_bytes(data=buf.read(), mime_type="image/jpeg"))

    parts.append(types.Part.from_text(text=
        "Extract ALL text from these soil investigation report pages exactly as written. "
        "Preserve all numbers, units, table values, bore hole data, SPT N-values, "
        "lab test results, and labels. Return only the extracted text, no commentary."
    ))

    response = gemini_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=parts
    )
    text = response.text.strip()
    log.info(f"Gemini Vision OCR complete in {time.time()-t:.1f}s — {len(text)} chars")
    return text


def call_gemini(prompt: str, label: str = "call") -> str:
    """Call Gemini and return response text."""
    log.info(f"Gemini [{label}] — prompt: {len(prompt)} chars")
    t = time.time()
    response = gemini_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt
    )
    result = response.text.strip()
    log.info(f"Gemini [{label}] done in {time.time()-t:.1f}s — {len(result)} chars")
    return result


def parse_json_from_response(raw: str) -> dict:
    """Robustly extract JSON from LLM response."""
    if "```" in raw:
        parts = raw.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            if part.startswith("{"):
                raw = part
                break

    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start != -1 and end > start:
        raw = raw[start:end]

    return json.loads(raw.strip())


def extract_geotech_data(report_text: str) -> dict:
    """Send full report text to Gemini for structured extraction."""
    log.info(f"Extracting geotechnical data... {len(report_text)} chars")
    prompt = build_extraction_prompt(report_text)
    raw = call_gemini(prompt, "extraction")
    data = parse_json_from_response(raw)
    log.info("JSON parsed successfully")
    return data


def get_recommendations(report_text: str, extracted_data: dict) -> str:
    """Get foundation recommendations from Gemini."""
    log.info("Generating recommendations...")
    prompt = build_recommendation_prompt(report_text, extracted_data)
    return call_gemini(prompt, "recommendations")


@app.get("/")
def root():
    return {"status": "ok", "service": "Geotechnical Soil Report Analyzer API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze-soil-report")
async def analyze_soil_report(file: UploadFile = File(...)):
    """Upload a geotechnical soil investigation PDF for full analysis."""
    log.info(f"--- New request: {file.filename} ---")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    pdf_bytes = await file.read()
    log.info(f"File size: {len(pdf_bytes) / 1024:.1f} KB")

    if len(pdf_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        total_start = time.time()

        # Step 1: Gemini Vision OCR
        report_text = extract_text_with_gemini_vision(pdf_bytes)
        if not report_text:
            raise HTTPException(status_code=422, detail="Could not extract text from the PDF.")

        # Step 2: Extract structured geotechnical data
        extracted_data = extract_geotech_data(report_text)

        # Step 3: Clean and normalize
        extracted_data = clean_extracted_data(extracted_data)
        log.info(f"Clean bore holes: {len(extracted_data.get('bore_holes', []))}")

        # Step 4: Risk assessment
        risk_assessment = assess_risk(extracted_data)
        log.info(f"Risk: {risk_assessment['risk_level']} (score: {risk_assessment['risk_score']})")

        # Step 5: Recommendations
        recommendations = get_recommendations(report_text, extracted_data)

        # Step 6: Save to Supabase
        try:
            file_url = upload_pdf_to_storage(pdf_bytes, file.filename)
            report_id = save_report(
                filename=file.filename,
                file_url=file_url,
                extracted_data=extracted_data,
                risk_assessment=risk_assessment,
                recommendations=recommendations
            )
            log.info(f"Saved to Supabase. Report ID: {report_id}")
        except Exception as db_err:
            log.warning(f"DB save failed (non-critical): {db_err}")
            report_id = None
            file_url = None

        log.info(f"--- Total: {time.time()-total_start:.1f}s ---")

        return {
            "report_id":      report_id,
            "extracted_data": extracted_data,
            "risk_assessment": risk_assessment,
            "recommendations": recommendations,
            "file_url":       file_url
        }

    except json.JSONDecodeError:
        log.error("Gemini returned invalid JSON")
        raise HTTPException(status_code=500, detail="LLM returned invalid JSON. Try again.")
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        log.error(f"Error: {str(e)}")
        log.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@app.get("/reports/{report_id}/export")
def export_report(report_id: str):
    """Generate and download a professional PDF report."""
    report = get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    try:
        pdf_bytes = generate_report_pdf(
            extracted_data=report["extracted_data"],
            risk_assessment=report["risk_assessment"],
            recommendations=report["recommendations"]
        )
        project_name = (report.get("project_name") or "report").replace(" ", "_")[:30]
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=geotech_{project_name}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@app.get("/reports")
def list_reports():
    try:
        return {"reports": get_all_reports()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/reports/{report_id}")
def get_report(report_id: str):
    report = get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@app.delete("/reports/{report_id}")
def remove_report(report_id: str):
    delete_report(report_id)
    return {"message": "Report deleted"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", 10000)))
