import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import API_URL from "../lib/api";
import UploadCard from "../components/UploadCard";
import ProjectInfo from "../components/ProjectInfo";
import RiskBadge from "../components/RiskBadge";
import BoreHoleCard from "../components/BoreHoleCard";
import SPTChart from "../components/SPTChart";
import LabResults from "../components/LabResults";
import FoundationCard from "../components/FoundationCard";
import Recommendations from "../components/Recommendations";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load report from history if navigated from history page
  useEffect(() => {
    const stored = sessionStorage.getItem("loadedReport");
    if (stored) {
      setResult(JSON.parse(stored));
      sessionStorage.removeItem("loadedReport");
    }
  }, []);

  const handleReset = () => setResult(null);

  const handleExport = async () => {
    if (!result?.report_id) return;
    try {
      const res = await fetch(`${API_URL}/reports/${result.report_id}/export`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `geotech_report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed.");
    }
  };

  if (!result) {
    return (
      <div>
        <div className="absolute top-4 right-6">
          <button
            onClick={() => router.push("/history")}
            className="text-sm px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition"
          >
            📂 Report History
          </button>
        </div>
        <UploadCard onResult={setResult} onLoading={setLoading} loading={loading} />
      </div>
    );
  }

  const { extracted_data, risk_assessment, recommendations } = result;

  return (
    <main className="min-h-screen bg-slate-100 pb-16">

      {/* Top Nav Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">🏗️</div>
            <span className="font-bold text-slate-800">GeoTech Analyzer</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Risk badge in nav */}
            <span className={`text-xs font-semibold px-3 py-1 rounded-full
              ${risk_assessment.risk_level === "High" ? "bg-red-100 text-red-700" :
                risk_assessment.risk_level === "Medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-green-100 text-green-700"}`}>
              {risk_assessment.risk_level} Risk
            </span>
            {result?.report_id && (
              <button
                onClick={handleExport}
                className="text-sm px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                ↓ Export PDF
              </button>
            )}
            <button
              onClick={() => router.push("/history")}
              className="text-sm px-4 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              📂 History
            </button>
            <button
              onClick={handleReset}
              className="text-sm px-4 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              ← New Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">

        {/* Project Title */}
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {extracted_data?.project?.name || "Geotechnical Report Analysis"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {extracted_data?.project?.client} · {extracted_data?.project?.location} · {extracted_data?.project?.date}
          </p>
        </div>

        {/* Row 1: Project Info + Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectInfo
            project={extracted_data?.project}
            siteConditions={extracted_data?.site_conditions}
          />
          <RiskBadge riskAssessment={risk_assessment} />
        </div>

        {/* Row 2: Foundation */}
        <FoundationCard foundation={extracted_data?.foundation} />

        {/* Row 3: Bore Holes */}
        <BoreHoleCard boreHoles={extracted_data?.bore_holes} />

        {/* Row 4: SPT Chart + Lab Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SPTChart boreHoles={extracted_data?.bore_holes} />
          <LabResults labResults={extracted_data?.lab_results} />
        </div>

        {/* Row 5: Recommendations */}
        <Recommendations text={recommendations} />

      </div>
    </main>
  );
}
