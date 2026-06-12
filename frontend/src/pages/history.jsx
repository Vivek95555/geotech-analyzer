import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import API_URL from "../lib/api";

const RISK_STYLES = {
  High:    { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500" },
  Medium:  { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  Low:     { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500" },
};

export default function HistoryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
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
    if (!confirm("Delete this report?")) return;
    setDeleting(id);
    try {
      await fetch(`http://localhost:5000/reports/${id}`, { method: "DELETE" });
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
    // Fetch full report data first (history list only has metadata)
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

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      {/* Nav */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">🏗️</div>
            <span className="font-bold text-slate-800">GeoTech Analyzer</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + New Analysis
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Report History</h1>
          <p className="text-slate-500 mt-1">
            {reports.length} report{reports.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">{error}</div>
        )}

        {/* Empty state */}
        {!loading && reports.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-slate-600 font-semibold text-lg">No reports yet</p>
            <p className="text-slate-400 mt-1 mb-6">Upload a soil investigation PDF to get started</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Upload Report
            </button>
          </div>
        )}

        {/* Reports Table */}
        {!loading && reports.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => {
                  const rStyle = RISK_STYLES[report.risk_level] || RISK_STYLES.Medium;
                  const date = new Date(report.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  });

                  return (
                    <tr
                      key={report.id}
                      onClick={() => handleView(report)}
                      className="hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800 text-sm max-w-xs truncate">
                          {report.project_name || report.filename || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-32 truncate">
                        {report.client_name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-32 truncate">
                        {report.location || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${rStyle.bg} ${rStyle.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${rStyle.dot}`}></span>
                          {report.risk_level || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">{report.risk_score ?? "—"}</span>
                        <span className="text-slate-400 text-xs">/100</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{date}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {/* View */}
                          <button
                            onClick={() => handleView(report)}
                            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                          >
                            View
                          </button>
                          {/* Export */}
                          <button
                            onClick={(e) => handleExport(report.id, report.project_name, e)}
                            className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium"
                          >
                            ↓ PDF
                          </button>
                          {/* Delete */}
                          <button
                            onClick={(e) => handleDelete(report.id, e)}
                            disabled={deleting === report.id}
                            className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
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
        )}
      </div>
    </main>
  );
}
