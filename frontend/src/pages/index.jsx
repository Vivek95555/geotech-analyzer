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

export default function Home({ theme, toggleTheme }) {
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
      <div className="relative min-h-screen bg-[var(--color-bg)] transition-colors duration-300">
        <div className="absolute top-6 right-8 z-20 flex gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-[var(--color-text)] hover:text-[var(--color-text-title)] bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] shadow-md transition duration-300 flex items-center justify-center backdrop-blur-md"
            title="Toggle Light/Dark Theme"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => router.push("/history")}
            className="text-xs font-bold px-4 py-2.5 rounded-xl text-[var(--color-text)] hover:text-[var(--color-text-title)] bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] shadow-md transition duration-300 flex items-center gap-2 backdrop-blur-md"
          >
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Report History
          </button>
        </div>
        <UploadCard onResult={setResult} onLoading={setLoading} loading={loading} theme={theme} />
      </div>
    );
  }

  const { extracted_data, risk_assessment, recommendations } = result;
  const isHighRisk = risk_assessment.risk_level === "High";
  const isMediumRisk = risk_assessment.risk_level === "Medium";

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-20 relative overflow-hidden transition-colors duration-300">
      {/* Background radial glows */}
      <div 
        className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"
        style={{ opacity: "var(--glow-opacity-multiplier)" }}
      ></div>
      <div 
        className="absolute bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" 
        style={{ animationDelay: "-3s", opacity: "var(--glow-opacity-multiplier)" }}
      ></div>

      {/* Top Nav Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-nav-bg)] border-b border-[var(--color-border)] shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-extrabold tracking-tight text-[var(--color-text-title)] text-lg">
              GeoTech Analyzer
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Risk badge in nav */}
            <span className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border shadow-sm
              ${isHighRisk ? "bg-red-500/10 border-red-500/30 text-red-400" :
                isMediumRisk ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}`}>
              {risk_assessment.risk_level || "Medium"} Risk
            </span>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] text-[var(--color-text)] hover:text-[var(--color-text-title)] rounded-xl shadow-sm transition duration-300 flex items-center justify-center"
              title="Toggle Light/Dark Theme"
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {result?.report_id && (
              <button
                onClick={handleExport}
                className="text-xs font-bold px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl shadow-md transition duration-300 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export PDF
              </button>
            )}

            <button
              onClick={() => router.push("/history")}
              className="text-xs font-bold px-4 py-2 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] text-[var(--color-text)] hover:text-[var(--color-text-title)] rounded-xl transition duration-300 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              History
            </button>

            <button
              onClick={handleReset}
              className="text-xs font-bold px-4 py-2 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] text-[var(--color-text)] hover:text-[var(--color-text-title)] rounded-xl transition duration-300 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              New Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-6 z-10 relative">

        {/* Project Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-border)] pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-title)]">
              {extracted_data?.project?.name || "Geotechnical Soil Analysis"}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-sm text-[var(--color-text)] opacity-80">
              <span className="flex items-center gap-1">🏢 {extracted_data?.project?.client || "Private Client"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">📍 {extracted_data?.project?.location || "N/A"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">📅 {extracted_data?.project?.date || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Row 1: Project Info + Risk Assessment (custom gauge) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectInfo
            project={extracted_data?.project}
            siteConditions={extracted_data?.site_conditions}
          />
          <RiskBadge riskAssessment={risk_assessment} />
        </div>

        {/* Row 2: Foundation Recommendation */}
        <FoundationCard foundation={extracted_data?.foundation} />

        {/* Row 3: Bore Holes Data with Strata Visual Column & Tabs */}
        <BoreHoleCard boreHoles={extracted_data?.bore_holes} />

        {/* Row 4: SPT Chart + Lab Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SPTChart boreHoles={extracted_data?.bore_holes} />
          <LabResults labResults={extracted_data?.lab_results} />
        </div>

        {/* Row 5: AI-powered recommendations */}
        <Recommendations text={recommendations} />

      </div>
    </main>
  );
}

