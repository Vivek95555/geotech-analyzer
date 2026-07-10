# 🏗️ GeoTech Analyzer — AI-Powered Geotechnical Soil Report Analysis

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)
![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Upload any soil investigation PDF → Get instant borehole data, SPT analysis, risk scoring & foundation recommendations.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Real-World Use Cases](#-real-world-use-cases)
- [Pros & Strengths](#-pros--strengths)
- [Limitations & Cons](#-limitations--cons)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🔍 Overview

**GeoTech Analyzer** is a full-stack AI-powered web application designed for **civil engineers, geotechnical consultants, and construction firms** to automate the tedious and error-prone process of reading soil investigation reports.

Instead of manually going through 20–50 page PDF reports to extract borehole logs, SPT N-values, laboratory results, and soil classifications, this tool does it in **under 2 minutes** using Google's Gemini Vision AI — and produces a structured risk assessment with actionable foundation design recommendations.

### The Problem It Solves

Traditional geotechnical report analysis involves:
- ⏱️ **2–4 hours** of manual data extraction per report
- 📊 Manually tabulating SPT values, soil layers, and lab results
- 🧮 Calculating bearing capacity and risk scores by hand
- 📝 Writing foundation recommendation summaries from scratch

**GeoTech Analyzer reduces this to a single PDF upload and a 2-minute wait.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **PDF Upload (Drag & Drop)** | Upload scanned or digital soil investigation reports with full-screen drag-and-drop blur overlay |
| 🔍 **Gemini Vision OCR** | Extracts text from scanned PDFs using Google Gemini 2.5 Flash multimodal AI — no Tesseract dependency |
| 🏗️ **Structured Data Extraction** | Parses project metadata, borehole logs, strata layers, SPT N-values, and laboratory test results into structured JSON |
| ⚠️ **Risk Assessment Engine** | Calculates a composite geotechnical risk score (0–100) considering SPT averages, water table depth, soil sensitivity, and liquefaction potential |
| 🏠 **Foundation Recommendations** | AI-generated foundation design guidance — shallow footings vs. deep piles with bearing capacity estimates |
| 📊 **Interactive Dashboard** | Visualizes SPT profiles with Recharts bar charts, animated speedometer risk gauge, and soil lithology columns |
| 🌙 **Dark / Light Theme** | Full theme switching with localStorage persistence and CSS custom property system |
| 📜 **Report History** | All analyses are stored in Supabase PostgreSQL with search, filter, and re-view capabilities |
| 📥 **PDF Export** | Generate and download professional PDF reports with ReportLab |
| 🐳 **Docker Ready** | Backend ships with a production Dockerfile for one-command deployment |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI component library |
| **Next.js 15** | SSR framework, routing, and build optimization |
| **TailwindCSS** | Utility-first styling with glassmorphism design system |
| **Recharts** | Interactive SPT bar charts and data visualizations |
| **Plus Jakarta Sans** | Premium Google Font for typography |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | High-performance async Python API framework |
| **Google Gemini 2.5 Flash** | Multimodal LLM for Vision OCR + structured data extraction + recommendation generation |
| **pdf2image + Poppler** | Converts PDF pages to JPEG images for Gemini Vision input |
| **ReportLab** | Generates professional downloadable PDF reports |

### Database & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Supabase (PostgreSQL)** | Stores analysis reports, project metadata, and risk assessments |
| **Supabase Storage** | Stores uploaded PDF files with public URL generation |
| **Docker** | Containerized backend deployment |
| **Render** | Cloud hosting for both frontend (Node) and backend (Docker) |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER BROWSER                      │
│  Next.js Frontend (React + TailwindCSS + Recharts)  │
└──────────────────────┬──────────────────────────────┘
                       │ REST API calls
                       ▼
┌─────────────────────────────────────────────────────┐
│               FastAPI Backend (Python)               │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ PDF → Image │→ │ Gemini Vision│→ │ Structured │ │
│  │ (pdf2image) │  │  OCR Engine  │  │ Extraction │ │
│  └─────────────┘  └──────────────┘  └─────┬──────┘ │
│                                           │         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────▼──────┐ │
│  │  ReportLab  │  │   Risk Score  │← │   Clean &  │ │
│  │ PDF Export  │  │   Calculator  │  │  Normalize │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│           Supabase (PostgreSQL + Storage)            │
│  ┌─────────────┐        ┌─────────────────────┐     │
│  │   reports   │        │   Pdfs (Storage)     │     │
│  │   table     │        │   bucket             │     │
│  └─────────────┘        └─────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

---

## 🌍 Real-World Use Cases

### 1. **Construction Site Pre-Assessment**
Before breaking ground on residential or commercial buildings, engineers must review soil investigation reports to determine safe foundation types. GeoTech Analyzer instantly parses these multi-page reports and provides actionable insights — saving hours of manual work.

### 2. **Infrastructure Projects (Bridges, Highways, Metros)**
Government and municipal infrastructure projects generate hundreds of borehole reports. This tool can batch-process reports and flag high-risk zones (e.g., shallow water tables, loose soils with low SPT values) for prioritized attention.

### 3. **Geotechnical Consulting Firms**
Small to mid-size geotech firms can use this as an internal tool to accelerate their report turnaround time. Instead of junior engineers spending days tabulating data, the AI extracts everything in minutes — letting senior engineers focus on design decisions.

### 4. **Windmill & Solar Farm Foundation Design**
Renewable energy installations require site-specific foundation analysis. This tool was tested against real windmill foundation reports (e.g., Suzlon Infrastructures) and successfully extracted the required bearing capacity and soil classification data.

### 5. **Academic & Research Use**
Civil engineering students and researchers can use this tool to quickly digitize and analyze published geotechnical case studies for thesis work, comparative studies, or database creation.

### 6. **Insurance & Real Estate Due Diligence**
Property insurers and real estate developers can assess subsurface risk profiles before investment decisions — identifying sites prone to settlement, liquefaction, or requiring expensive deep foundations.

---

## ✅ Pros & Strengths

| # | Strength | Detail |
|---|----------|--------|
| 1 | **No Tesseract / OCR Dependency** | Uses Gemini Vision API directly on page images — works on scanned, photocopied, and low-quality PDFs without local OCR installation |
| 2 | **Multi-Page PDF Support** | Handles reports with 1–50+ pages by converting each page to an image and sending them all to Gemini in a single multimodal request |
| 3 | **Structured JSON Output** | Extracts organized data: project info, borehole arrays, strata layers with depth ranges, SPT N-values, lab results (density, Atterberg limits, shear strength), and foundation parameters |
| 4 | **Intelligent Risk Scoring** | Composite risk algorithm considers SPT averages, water table depth, soil type sensitivity, liquefaction potential, and bearing capacity — outputs a 0–100 score with Low/Medium/High classification |
| 5 | **Beautiful, Portfolio-Ready UI** | Glassmorphism design, animated speedometer gauge, interactive lithology columns, Recharts visualizations, and dark/light theme switching |
| 6 | **Full History & Export** | Every analysis is persisted to Supabase with search/filter. Professional PDF reports can be exported with one click |
| 7 | **Free Tier Deployable** | Entire stack runs on Render (free) + Supabase (free) + Gemini API (generous free tier) |
| 8 | **Docker-Ready Backend** | Production Dockerfile included — deploy anywhere (AWS, GCP, Azure, Railway, etc.) |
| 9 | **Memory Optimized** | PDF-to-image conversion uses 90 DPI with per-page memory release — runs within 512MB RAM containers |

---

## ⚠️ Limitations & Cons

| # | Limitation | Detail |
|---|-----------|--------|
| 1 | **LLM Accuracy Variability** | Gemini's extraction accuracy depends on report formatting. Poorly structured, handwritten, or heavily degraded scans may produce incomplete or inaccurate data |
| 2 | **No Multi-Language Support** | Currently optimized for English-language soil reports. Reports in Hindi, Arabic, or other languages may not extract correctly |
| 3 | **API Rate Limits** | Gemini API has rate limits on the free tier. Heavy concurrent usage (10+ simultaneous uploads) may hit quota limits |
| 4 | **No Offline Mode** | Requires active internet connection for both Gemini API calls and Supabase database operations |
| 5 | **Single Report at a Time** | Currently processes one PDF per request. No batch upload/queue system for processing multiple reports simultaneously |
| 6 | **No User Authentication** | No login system — all reports are stored in a shared database. Not suitable for multi-tenant production use without adding auth |
| 7 | **Limited to PDF Format** | Only accepts `.pdf` files. Does not support Word documents, images, or scanned TIFF files directly |
| 8 | **Risk Score is Indicative** | The risk assessment is algorithmic and AI-assisted — it should not replace professional geotechnical engineering judgment for critical structures |
| 9 | **Free Tier Cold Starts** | On Render's free tier, the backend container sleeps after 15 minutes of inactivity. First request after sleep takes 30–60 seconds to boot |
| 10 | **Large PDFs May Timeout** | Reports exceeding 40–50 pages may hit Render's request timeout limits on the free tier (default 30s for free, configurable on paid plans) |

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+** (backend)
- **Node.js 18+** (frontend)
- **Poppler** (`poppler-utils` — required by `pdf2image`)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))
- **Supabase Account** ([Create free project](https://supabase.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/Vivek95555/geotech-analyzer.git
cd geotech-analyzer
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Start the backend server:

```bash
uvicorn app:app --reload --port 5000
```

The API will be available at `http://localhost:5000` with docs at `http://localhost:5000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Supabase Database Setup

Create a `reports` table in your Supabase SQL editor:

```sql
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  filename TEXT,
  file_url TEXT,
  project_name TEXT,
  client_name TEXT,
  location TEXT,
  report_date TEXT,
  risk_level TEXT,
  risk_score INTEGER,
  extracted_data JSONB,
  risk_assessment JSONB,
  recommendations TEXT
);
```

Create a storage bucket named `Pdfs` in Supabase Storage with public access enabled.

---

## ☁️ Deployment

### Option 1: Render Blueprint (One-Click)

The project includes a `render.yaml` file. Connect your GitHub repo to [Render](https://render.com/) and select **Blueprint** — it will automatically configure both services.

### Option 2: Vercel + Render (Best Performance)

| Service | Platform | Directory |
|---------|----------|-----------|
| Frontend | **Vercel** | `frontend/` |
| Backend | **Render** (Docker) | `backend/` |

Set `NEXT_PUBLIC_API_URL` on Vercel pointing to your Render backend URL.

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/analyze-soil-report` | Upload PDF and run full analysis pipeline |
| `GET` | `/reports` | Fetch all report summaries |
| `GET` | `/reports/{id}` | Fetch full report by ID |
| `DELETE` | `/reports/{id}` | Delete a report |
| `GET` | `/reports/{id}/export` | Download analysis as formatted PDF |

---

## 📸 Screenshots

<img width="374" height="350" alt="image" src="https://github.com/user-attachments/assets/e0eb4128-e5fe-45d6-b231-3e3e8a76b030" />
<img width="650" height="435" alt="image" src="https://github.com/user-attachments/assets/0c09e382-e241-49f8-80d3-70544bdc0b91" />
<img width="632" height="459" alt="image" src="https://github.com/user-attachments/assets/ee2e7e82-a647-4add-8b46-5dbbe3c94999" />



---

## 🔮 Future Improvements

- [ ] **Batch Upload** — Queue system for processing multiple PDFs simultaneously
- [ ] **User Authentication** — Multi-tenant support with Supabase Auth
- [ ] **Multi-Language OCR** — Support for Hindi, Arabic, and other regional languages
- [ ] **Comparative Analysis** — Compare 2+ reports side-by-side for site selection
- [ ] **Map Integration** — Plot borehole locations on a satellite map
- [ ] **IS Code Compliance** — Auto-check results against IS 1893, IS 2131, and IS 6403 standards
- [ ] **Mobile App** — React Native companion app for field engineers
- [ ] **Webhook Notifications** — Email/Slack alerts when analysis completes

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Vivek Solanki](https://github.com/Vivek95555)**

⭐ Star this repo if you found it useful!

</div>
