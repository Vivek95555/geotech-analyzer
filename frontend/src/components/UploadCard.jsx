import { useState } from "react";
import API_URL from "../lib/api";

export default function UploadCard({ onResult, onLoading, loading }) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileSelect = (file) => {
    if (!file || !file.name.endsWith(".pdf")) {
      setError("Please upload a valid PDF file.");
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    onLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${API_URL}/analyze-soil-report`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Something went wrong.");
        onLoading(false);
        return;
      }
      onResult(data);
    } catch (err) {
      setError("Could not connect to server. Make sure the backend is running on port 5000.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
          <span className="text-3xl">🏗️</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Geotechnical Report Analyzer</h1>
        <p className="text-slate-500 mt-2 max-w-md">
          Upload a soil investigation PDF to instantly extract bore hole data,
          SPT values, lab results, and get AI-powered foundation recommendations.
        </p>
      </div>

      <div className="w-full max-w-lg">

        {/* Drop Zone */}
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-200
            ${dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFileSelect(e.dataTransfer.files[0]);
          }}
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          <div className="text-5xl mb-3">
            {selectedFile ? "📄" : "📂"}
          </div>
          <p className="text-slate-700 font-semibold text-lg text-center">
            {selectedFile ? selectedFile.name : "Drop your PDF here"}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {selectedFile ? "Click to change file" : "or click to browse"}
          </p>
          {!selectedFile && (
            <div className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">
              Browse File
            </div>
          )}
        </label>

        {/* Analyze Button — appears after file selected */}
        {selectedFile && !loading && (
          <button
            onClick={handleAnalyze}
            className="mt-4 w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-700 active:scale-95 transition shadow-lg"
          >
            🔍 Analyze Soil Report
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="font-semibold text-slate-700">Analyzing report...</span>
            </div>
            <div className="space-y-2 text-sm text-slate-500">
              <p>⚙️ Running OCR on PDF pages</p>
              <p>🤖 Extracting geotechnical parameters with AI</p>
              <p>📊 Calculating risk assessment</p>
              <p>💡 Generating foundation recommendations</p>
              <p>💾 Saving to database</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Feature cards */}
        {!loading && !selectedFile && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: "🔍", label: "OCR Extraction", desc: "Works on scanned PDFs" },
              { icon: "📐", label: "Bore Hole Data", desc: "SPT values & strata" },
              { icon: "🏛️", label: "Foundation Rec.", desc: "AI-powered advice" },
            ].map((f) => (
              <div key={f.label} className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
                <div className="text-2xl mb-1">{f.icon}</div>
                <p className="text-xs font-semibold text-slate-700">{f.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
