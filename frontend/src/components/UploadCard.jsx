import { useState, useEffect } from "react";
import API_URL from "../lib/api";

export default function UploadCard({ onResult, onLoading, loading }) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "OCR Scanning", desc: "Parsing PDF characters and structure" },
    { label: "AI Extraction", desc: "Identifying bore logs & SPT N-values" },
    { label: "Risk Assessment", desc: "Calculating geotechnical hazard rating" },
    { label: "Recommendation Engines", desc: "Designing pile & shallow foundations" },
    { label: "Finalizing Report", desc: "Storing analysis in database" }
  ];

  // Dynamic step animation for the loader
  useEffect(() => {
    let interval;
    if (loading) {
      setActiveStep(0);
      interval = setInterval(() => {
        setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setActiveStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Window-level drag and drop handlers to prevent default browser behavior and trigger background blur
  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      // Only set dragging to false when cursor exits the browser window bounds
      if (
        e.clientX <= 0 ||
        e.clientY <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        setDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleFileSelect = (file) => {
    if (!file || !file.name.endsWith(".pdf")) {
      setError("Please upload a valid PDF investigation report.");
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  const handleClearFile = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedFile(null);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[var(--color-bg)] transition-colors duration-300">
      {/* Background radial glows */}
      <div 
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow"
        style={{ opacity: "var(--glow-opacity-multiplier)" }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" 
        style={{ animationDelay: "-3s", opacity: "var(--glow-opacity-multiplier)" }}
      ></div>

      {/* Dynamic Background Blur Overlay when file is selected or loading */}
      <div 
        className={`absolute inset-0 transition-all duration-700 pointer-events-none z-0
          ${selectedFile || loading ? "backdrop-blur-md bg-black/5" : "backdrop-blur-none bg-transparent"}`}
      ></div>

      {/* Full-Screen Drag and Drop Blur Indicator Overlay */}
      {dragging && (
        <div className="absolute inset-0 z-50 backdrop-blur-md bg-slate-950/40 flex items-center justify-center transition-all duration-300">
          <div className="border-2 border-dashed border-indigo-500 rounded-3xl p-12 bg-[var(--color-card-bg)] border-[var(--color-card-border)] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.25)] animate-pulse pointer-events-none max-w-sm text-center mx-6">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-lg font-bold text-[var(--color-text-title)]">Drop Soil Report Here</p>
            <p className="text-xs text-[var(--color-text)] opacity-70 mt-1.5">Release to load the investigation PDF</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10 z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text-title)]">
          Geotechnical Report Analyzer
        </h1>
        <p className="text-[var(--color-text)] opacity-85 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
          Upload a soil investigation PDF to instantly extract bore hole data,
          SPT values, lab results, and get AI-powered foundation recommendations.
        </p>
      </div>

      <div className="w-full max-w-lg z-10">
        {/* Drop Zone (Only when no file is selected) */}
        {!loading && !selectedFile && (
          <label
            className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 glass-card border-[var(--color-input-border)] hover:border-indigo-500/50 hover:bg-indigo-500/5"
          >
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
            
            {/* Folder / File Icon */}
            <div className="w-16 h-16 rounded-full bg-[var(--color-panel-bg)] flex items-center justify-center border border-[var(--color-panel-border)] mb-4 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>

            <p className="text-[var(--color-text-title)] font-semibold text-lg text-center truncate max-w-xs">
              Drop your PDF here
            </p>
            <p className="text-[var(--color-text)] opacity-70 text-xs mt-1.5">
              supports geotechnical logs, SPT reports up to 25MB
            </p>

            <div className="mt-6 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] transition-all">
              Choose PDF File
            </div>
          </label>
        )}

        {/* Selected File Card Details */}
        {!loading && selectedFile && (
          <div className="glass-card p-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden backdrop-blur-xl transition-all duration-300">
            <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>

            <div className="relative z-10">
              <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4">Selected Soil Report</p>
              
              <div className="flex items-center gap-4 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] p-4 rounded-xl mb-6">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--color-text-title)] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-[var(--color-text)] opacity-70 mt-0.5">
                    PDF Document • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={handleClearFile}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-400 flex items-center justify-center border border-rose-500/20 hover:border-rose-500/30 transition duration-300"
                  title="Remove File"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Actions Grid */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAnalyze}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Start Geotechnical Analysis
                </button>

                <label className="py-3 px-4 bg-[var(--color-panel-bg)] hover:bg-[var(--color-panel-bg)]/80 text-[var(--color-text)] hover:text-[var(--color-text-title)] border border-[var(--color-panel-border)] hover:border-[var(--color-border)] rounded-xl font-bold text-sm transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Replace File
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step Loader */}
        {loading && (
          <div className="glass-card mt-6 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                <span className="font-bold text-[var(--color-text-title)] text-sm">Processing Investigation...</span>
              </div>
              <span className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold">Step {activeStep + 1} of {steps.length}</span>
            </div>

            {/* Stepper Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const isCompleted = index < activeStep;
                const isActive = index === activeStep;
                const isPending = index > activeStep;

                return (
                  <div key={index} className="flex gap-4 relative">
                    {/* Visual Connector Line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute left-2.5 top-5 w-0.5 h-8 -ml-[1px] z-0 transition-colors duration-500
                        ${isCompleted ? "bg-indigo-500" : "bg-slate-800"}`} />
                    )}

                    {/* Step Icon Indicator */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 shrink-0 transition-all duration-300
                      ${isCompleted ? "bg-indigo-500 text-white" : ""}
                      ${isActive ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] border border-indigo-400" : ""}
                      ${isPending ? "bg-slate-900 text-slate-600 border border-slate-800" : ""}`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    {/* Step Labels */}
                    <div className="flex-1 -mt-0.5">
                      <p className={`text-xs font-bold transition-colors duration-300
                        ${isCompleted ? "text-[var(--color-text-muted)]" : ""}
                        ${isActive ? "text-indigo-600 dark:text-indigo-300" : ""}
                        ${isPending ? "text-slate-600" : ""}`}
                      >
                        {step.label}
                      </p>
                      <p className={`text-[10px] mt-0.5 transition-colors duration-300
                        ${isCompleted ? "text-[var(--color-text-muted)]" : ""}
                        ${isActive ? "text-[var(--color-text)]" : ""}
                        ${isPending ? "text-slate-700" : ""}`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="mt-5 bg-red-950/20 border border-red-800/40 rounded-xl p-4 flex gap-3 items-start animate-shake">
            <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-300 text-xs font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Feature badges list */}
        {!loading && !selectedFile && (
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { icon: (
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                </svg>
              ), label: "OCR Extraction", desc: "For scanned documents" },
              { icon: (
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                </svg>
              ), label: "Borehole Data", desc: "SPT and lithology logs" },
              { icon: (
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ), label: "Foundation Rec.", desc: "AI bearing calculations" },
            ].map((f) => (
              <div key={f.label} className="glass-panel text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] flex items-center justify-center mb-2">
                  {f.icon}
                </div>
                <p className="text-xs font-bold text-[var(--color-text-title)]">{f.label}</p>
                <p className="text-[10px] text-[var(--color-text)] opacity-80 mt-1 leading-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
