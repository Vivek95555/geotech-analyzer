import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import API_URL from "../lib/api";

const RISK_STYLES = {
  High:    { bg: "bg-red-500/10 border-red-500/20 text-rose-400", dot: "bg-red-500" },
  Medium:  { bg: "bg-amber-500/10 border-amber-500/20 text-amber-400", dot: "bg-amber-500" },
  Low:     { bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", dot: "bg-emerald-500" },
};

export default function HistoryPage({ theme, toggleTheme }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/reports`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this report permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`${API_URL}/reports/${id}`, { method: "DELETE" });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Delete failed.");
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = async (id, projectName, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/reports/${id}/export`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `geotech_${projectName || id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed.");
    }
  };

  const handleView = async (report) => {
    try {
      const res = await fetch(`${API_URL}/reports/${report.id}`);
      const fullReport = await res.json();
      sessionStorage.setItem("loadedReport", JSON.stringify({
        extracted_data: fullReport.extracted_data || {},
        risk_assessment: fullReport.risk_assessment || {},
        recommendations: fullReport.recommendations || "",
        report_id: fullReport.id,
        file_url: fullReport.file_url,
      }));
      router.push("/");
    } catch {
      alert("Failed to load report.");
    }
  };

  // Filter reports locally
  const filteredReports = reports.filter((report) => {
    const name = (report.project_name || report.filename || "").toLowerCase();
    const client = (report.client_name || "").toLowerCase();
    const location = (report.location || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch = name.includes(term) || client.includes(term) || location.includes(term);
    const matchesRisk = riskFilter === "All" || report.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

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

      {/* Nav */}
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

            <button
              onClick={() => router.push("/")}
              className="text-xs font-bold px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl shadow-md transition duration-300 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 z-10 relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-title)]">
            Analysis Report History
          </h1>
          <p className="text-[var(--color-text)] opacity-70 text-xs mt-2.5">
            {reports.length} report{reports.length !== 1 ? "s" : ""} saved in project history
          </p>
        </div>

        {/* Search and Filters Bar */}
        {!loading && reports.length > 0 && (
          <div className="glass-panel border-[var(--color-border)] bg-[var(--color-panel-bg)] p-4 rounded-2xl mb-6 flex flex-col sm:flex-row gap-4 items-center transition-colors">
            {/* Search Input */}
            <div className="w-full sm:flex-1 relative">
              <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by project name, client, or location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] text-[var(--color-text)] placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/50 transition duration-300"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-1 bg-[var(--color-input-bg)] p-1 rounded-xl border border-[var(--color-input-border)] shrink-0 transition-colors">
              {["All", "Low", "Medium", "High"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition duration-200
                    ${riskFilter === lvl
                      ? "bg-[var(--color-card-bg)] border border-[var(--color-card-border)] text-[var(--color-text-title)] shadow-sm"
                      : "text-slate-500 hover:text-[var(--color-text)]"}`}
                >
                  {lvl} Risk
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950/20 border border-red-800/30 rounded-2xl p-4 text-red-400 text-xs flex gap-2.5 items-center">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && (reports.length === 0 || filteredReports.length === 0) && (
          <div className="text-center py-20 glass-card">
            <div className="w-16 h-16 rounded-full bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.625-12.15c.311.195.516.539.516.908v3.62c0 .248-.4.248-.4 0v-3.62c0-.184-.102-.356-.258-.454l-2.241-1.397A1.5 1.5 0 008.76.756l-2.241 1.397a.53.53 0 00-.258.454v3.62c0 .248-.4.248-.4 0v-3.62c0-.369.205-.713.516-.908L8.76.756a1.5 1.5 0 011.606 0l2.256 1.397zM2.25 12.75h19.5m0 0v6.75A2.25 2.25 0 0119.5 21.75h-15a2.25 2.25 0 01-2.25-2.25v-6.75m19.5 0H2.25" />
              </svg>
            </div>
            <p className="text-[var(--color-text-title)] font-bold text-lg">No records found</p>
            <p className="text-[var(--color-text)] opacity-70 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
              {reports.length === 0 ? "You haven't analyzed any report yet. Upload a soil PDF on the dashboard." : "No reports match your active search terms or filters."}
            </p>
            {reports.length === 0 && (
              <button
                onClick={() => router.push("/")}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md transition duration-300"
              >
                Upload Report
              </button>
            )}
          </div>
        )}

        {/* Reports Table */}
        {!loading && filteredReports.length > 0 && (
          <div className="glass-card border-[var(--color-border)] bg-[var(--color-panel-bg)] p-0 overflow-hidden shadow-2xl transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-panel-bg)] border-b border-[var(--color-border)] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-center">Risk Level</th>
                    <th className="px-6 py-4 text-center">Hazard Rating</th>
                    <th className="px-6 py-4">Date Indexed</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-xs text-[var(--color-text)]">
                  {filteredReports.map((report) => {
                    const rStyle = RISK_STYLES[report.risk_level] || RISK_STYLES.Medium;
                    const date = new Date(report.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    });

                    return (
                      <tr
                        key={report.id}
                        onClick={() => handleView(report)}
                        className="hover:bg-slate-500/5 cursor-pointer transition duration-150"
                      >
                        <td className="px-6 py-4 font-bold text-[var(--color-text-title)] max-w-xs truncate">
                          {report.project_name || report.filename || "—"}
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text)] opacity-85 max-w-[120px] truncate">
                          {report.client_name || "—"}
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text)] opacity-85 max-w-[120px] truncate">
                          {report.location || "—"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${rStyle.bg}`}>
                            <span className={`w-1 h-1 rounded-full ${rStyle.dot}`}></span>
                            {report.risk_level || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-extrabold text-[var(--color-text-title)]">{report.risk_score ?? "—"}</span>
                          <span className="text-slate-500 text-[10px]">/100</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{date}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                            {/* View */}
                            <button
                              onClick={() => handleView(report)}
                              className="text-[10px] font-bold px-3 py-1.5 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] text-[var(--color-text)] hover:text-[var(--color-text-title)] rounded-lg transition duration-300"
                            >
                              View
                            </button>
                            {/* Export */}
                            <button
                              onClick={(e) => handleExport(report.id, report.project_name, e)}
                              className="text-[10px] font-bold px-3 py-1.5 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] text-[var(--color-text)] hover:text-[var(--color-text-title)] rounded-lg transition duration-300"
                            >
                              ↓ PDF
                            </button>
                            {/* Delete */}
                            <button
                              onClick={(e) => handleDelete(report.id, e)}
                              disabled={deleting === report.id}
                              className="text-[10px] font-bold px-3 py-1.5 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] text-[var(--color-text)] hover:text-rose-400 rounded-lg transition duration-300 disabled:opacity-50"
                            >
                              {deleting === report.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

