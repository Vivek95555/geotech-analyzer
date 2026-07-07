import { useState, useEffect } from "react";

export default function BoreHoleCard({ boreHoles }) {
  const [activeTab, setActiveTab] = useState(0);

  // Reset active tab if boreHoles change
  useEffect(() => {
    setActiveTab(0);
  }, [boreHoles]);

  if (!boreHoles || boreHoles.length === 0) return null;

  // Safeguard index bounds
  const bhIndex = activeTab >= boreHoles.length ? 0 : activeTab;
  const bh = boreHoles[bhIndex];

  // Helper to determine texture CSS classes and labels
  const getSoilRepresentation = (desc = "", classification = "") => {
    const text = `${desc} ${classification}`.toLowerCase();
    if (text.includes("clay")) {
      return { texture: "clay-texture", label: "Clay Layer", border: "border-amber-800/40" };
    }
    if (text.includes("sand")) {
      return { texture: "sand-texture", label: "Sand Layer", border: "border-yellow-600/40" };
    }
    if (text.includes("silt")) {
      return { texture: "silt-texture", label: "Silt Layer", border: "border-amber-900/40" };
    }
    if (text.includes("gravel") || text.includes("stone") || text.includes("rock")) {
      return { texture: "gravel-texture", label: "Gravel / Rock", border: "border-slate-600/40" };
    }
    return { texture: "bg-slate-800", label: "Undifferentiated Soil", border: "border-slate-700/40" };
  };

  // Get total borehole depth for scale calculation
  const getBoreholeMaxDepth = (borehole) => {
    if (borehole.depth_m) return borehole.depth_m;
    if (borehole.strata && borehole.strata.length > 0) {
      const last = borehole.strata[borehole.strata.length - 1];
      return last.depth_to_m ?? 10;
    }
    return 10;
  };

  const maxDepth = getBoreholeMaxDepth(bh);

  return (
    <div className="glass-card">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-4 mb-6 gap-4">
        <p className="section-title text-indigo-400 mb-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Subsurface Bore Hole Profiles
        </p>

        {/* Tab Buttons */}
        <div className="flex gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-900 shrink-0 overflow-x-auto">
          {boreHoles.map((tabBh, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition duration-300 whitespace-nowrap
                ${idx === bhIndex 
                  ? "bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-[0_2px_10px_rgba(99,102,241,0.2)]" 
                  : "text-slate-400 hover:text-slate-200"}`}
            >
              {tabBh.id || `BH-0${idx + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Visual Soil Profile Column (Left 3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between glass-panel border-slate-900 bg-slate-950/20 p-5 rounded-2xl min-h-[300px]">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Stratigraphy Column</p>
            
            {/* Visual Column Meter */}
            <div className="relative flex gap-4">
              {/* Depth ruler */}
              <div className="w-8 flex flex-col justify-between text-[9px] font-mono text-slate-500 select-none py-1 py-0.5 relative">
                <span>0.0m</span>
                <span className="absolute top-1/4">{(maxDepth * 0.25).toFixed(1)}m</span>
                <span className="absolute top-1/2">{(maxDepth * 0.5).toFixed(1)}m</span>
                <span className="absolute top-3/4">{(maxDepth * 0.75).toFixed(1)}m</span>
                <span className="absolute bottom-0">{maxDepth.toFixed(1)}m</span>
              </div>

              {/* Column representation */}
              <div className="flex-1 h-72 w-14 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex flex-col">
                {bh.strata && bh.strata.map((s, idx) => {
                  const from = s.depth_from_m ?? 0;
                  const to = s.depth_to_m ?? maxDepth;
                  const thickness = to - from;
                  const pct = (thickness / maxDepth) * 100;
                  const soil = getSoilRepresentation(s.description, s.soil_classification);
                  
                  return (
                    <div
                      key={idx}
                      className={`${soil.texture} ${soil.border} border-b flex flex-col items-center justify-center text-center px-1 select-none transition-all duration-300 relative group cursor-help`}
                      style={{ height: `${pct}%` }}
                      title={`${soil.label}: ${from}m - ${to}m\n${s.description}`}
                    >
                      {pct > 12 && (
                        <span className="text-[8px] font-extrabold text-white bg-slate-950/80 px-1 py-0.5 rounded backdrop-blur-sm border border-slate-800/40">
                          {s.soil_classification || "Soil"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Texture Legend */}
          <div className="mt-6 pt-4 border-t border-[var(--color-border)] grid grid-cols-2 gap-2 text-[9px] text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded clay-texture border border-amber-800/40" />
              <span>Clay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded sand-texture border border-yellow-600/40" />
              <span>Sand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded silt-texture border border-amber-900/40" />
              <span>Silt</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded gravel-texture border border-slate-600/40" />
              <span>Rock/Gravel</span>
            </div>
          </div>
        </div>

        {/* Detailed Strata Table (Right 9 cols) */}
        <div className="lg:col-span-9 flex flex-col justify-between">
          <div className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-panel-bg)] rounded-2xl">
            {/* BH Information Bar */}
            <div className="bg-[var(--color-panel-bg)] border-b border-[var(--color-border)] px-5 py-3 flex items-center justify-between text-xs text-[var(--color-text)]">
              <span className="font-bold text-[var(--color-text-title)] text-sm">{bh.id || `Bore Hole ${bhIndex + 1}`}</span>
              <div className="flex gap-4">
                {bh.depth_m != null && (
                  <span className="flex items-center gap-1">
                    📏 Total Depth: <strong className="text-[var(--color-text-title)]">{bh.depth_m}m</strong>
                  </span>
                )}
                {bh.water_table_m != null && (
                  <span className="flex items-center gap-1">
                    💧 Water Table: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{bh.water_table_m}m</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            {bh.strata && bh.strata.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-panel-bg)] border-b border-[var(--color-border)] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-5 py-3">Depth Interval</th>
                      <th className="px-5 py-3">Soil Lithology & Description</th>
                      <th className="px-5 py-3">USCS Class</th>
                      <th className="px-5 py-3">SPT N-Values</th>
                      <th className="px-5 py-3">Relative Density</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] text-xs text-[var(--color-text)]">
                    {bh.strata.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-500/5 transition duration-150">
                        <td className="px-5 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          {s.depth_from_m ?? "?"}m – {s.depth_to_m ?? "?"}m
                        </td>
                        <td className="px-5 py-4 max-w-sm leading-relaxed text-[var(--color-text)] font-medium">
                          {s.description || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] text-indigo-600 dark:text-indigo-300 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold">
                            {s.soil_classification || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {s.spt_n_values && s.spt_n_values.length > 0 ? (
                            <div className="flex gap-1 flex-wrap">
                              {s.spt_n_values.map((n, k) => (
                                <span key={k} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {n}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {s.consistency ? (
                            <span className="bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] text-[var(--color-text-muted)] text-[10px] px-2 py-0.5 rounded-full font-semibold">
                              {s.consistency}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--color-text-muted)] text-xs">No strata layers parsed for this borehole.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

