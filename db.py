"""
Supabase database and storage operations.
Handles saving/fetching reports and PDF files.
"""

import os
import uuid
import logging
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

log = logging.getLogger("geotech-api")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
log.info("Supabase client initialized.")


def upload_pdf_to_storage(pdf_bytes: bytes, filename: str) -> str:
    """
    Upload PDF to Supabase Storage bucket 'pdfs'.
    Returns the public URL of the uploaded file.
    """
    # Use unique filename to avoid conflicts
    unique_name = f"{uuid.uuid4()}_{filename}"

    supabase.storage.from_("Pdfs").upload(
        path=unique_name,
        file=pdf_bytes,
        file_options={"content-type": "application/pdf"}
    )

    # Get public URL
    url = supabase.storage.from_("Pdfs").get_public_url(unique_name)
    log.info(f"PDF uploaded to storage: {unique_name}")
    return url


def save_report(
    filename: str,
    file_url: str,
    extracted_data: dict,
    risk_assessment: dict,
    recommendations: str
) -> str:
    """
    Save full analysis report to Supabase reports table.
    Returns the report ID.
    """
    project = extracted_data.get("project", {})

    record = {
        "filename":        filename,
        "file_url":        file_url,
        "project_name":    project.get("name"),
        "client_name":     project.get("client"),
        "location":        project.get("location"),
        "report_date":     project.get("date"),
        "risk_level":      risk_assessment.get("risk_level"),
        "risk_score":      risk_assessment.get("risk_score"),
        "extracted_data":  extracted_data,
        "risk_assessment": risk_assessment,
        "recommendations": recommendations,
    }

    result = supabase.table("reports").insert(record).execute()
    report_id = result.data[0]["id"]
    log.info(f"Report saved to DB. ID: {report_id}")
    return report_id


def get_all_reports() -> list:
    """Fetch all reports summary (no full JSON, just metadata)."""
    result = supabase.table("reports").select(
        "id, created_at, filename, project_name, client_name, location, risk_level, risk_score"
    ).order("created_at", desc=True).execute()
    return result.data


def get_report_by_id(report_id: str) -> dict | None:
    """Fetch full report by ID."""
    result = supabase.table("reports").select("*").eq("id", report_id).execute()
    if result.data:
        return result.data[0]
    return None


def delete_report(report_id: str) -> bool:
    """Delete a report from DB."""
    supabase.table("reports").delete().eq("id", report_id).execute()
    log.info(f"Report deleted: {report_id}")
    return True
