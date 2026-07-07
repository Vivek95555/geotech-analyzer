export default function LabResults({ labResults }) {
  if (!labResults) return null;

  const params = [
    { label: "Dry Soil Density", value: labResults.dry_density_gm_cc, unit: " gm/cc", icon: "⚖️" },
    { label: "Bulk Soil Density", value: labResults.bulk_density_gm_cc, unit: " gm/cc", icon: "⚖️" },
    { label: "Specific Gravity", value: labResults.specific_gravity, unit: "", icon: "🔬" },
    { label: "Moisture Content", value: labResults.moisture_content_percent, unit: "%", icon: "💧" },
    { label: "Liquid Limit (LL)", value: labResults.liquid_limit_percent, unit: "%", icon: "📏" },
    { label: "Plastic Limit (PL)", value: labResults.plastic_limit_percent, unit: "%", icon: "📏" },
    { label: "Cohesion (c)", value: labResults.cohesion_kg_cm2, unit: " kg/cm²", icon: "🔗" },
    { label: "Friction Angle (φ)", value: labResults.friction_angle_deg, unit: "°", icon: "📐" },
    { label: "Void Ratio (e)", value: labResults.void_ratio, unit: "", icon: "🕳️" },
    { label: "Compression Index (Cc)", value: labResults.compression_index, unit: "", icon: "📉" },
  ].filter((p) => p.value != null);

  const grain = labResults.grain_size || {};
  const grainData = [
    { label: "Gravel", value: grain.gravel_percent, color: "from-amber-600 to-amber-700", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
    { label: "Sand", value: grain.sand_percent, color: "from-yellow-500 to-yellow-600", text: "text-yellow-600 dark:text-yellow-400", dot: "bg-yellow-500" },
    { label: "Silt", value: grain.silt_percent, color: "from-orange-400 to-orange-500", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-400" },
    { label: "Clay", value: grain.clay_percent, color: "from-red-500 to-red-600", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  ].filter((g) => g.value != null);

  if (params.length === 0 && grainData.length === 0) return null;

  return (
    <div className="glass-card flex flex-col justify-between h-full">
      <div>
        <p className="section-title text-indigo-500 dark:text-indigo-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Soil Lab Laboratory Results
        </p>

        {/* Parameters Grid */}
        {params.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
            {params.map(({ label, value, unit, icon }) => (
              <div key={label} className="glass-panel border-[var(--color-panel-border)] text-center hover:bg-slate-500/5 hover:scale-[1.02] transition duration-300">
                <div className="text-lg mb-1">{icon}</div>
                <p className="text-base font-extrabold text-[var(--color-text-title)]">{value}<span className="text-[10px] text-[var(--color-text)] opacity-80 font-normal">{unit}</span></p>
                <p className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide mt-1 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Grain Size Distribution */}
        {grainData.length > 0 && (
          <div className="border-t border-[var(--color-border)] pt-5">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3.5">Grain Size distribution</p>
            
            {/* Stacked Distribution bar */}
            <div className="flex h-6 rounded-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-input-bg)] p-[2px] transition-colors">
              {grainData.map(({ label, value, color }) => (
                <div
                  key={label}
                  className={`bg-gradient-to-r ${color} flex items-center justify-center text-white text-[9px] font-extrabold transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${value}%` }}
                  title={`${label}: ${value}%`}
                >
                  {value > 8 ? `${value}%` : ""}
                </div>
              ))}
            </div>

            {/* Labels list */}
            <div className="flex gap-4 mt-3.5 flex-wrap">
              {grainData.map(({ label, value, text, dot }) => (
                <div key={label} className="flex items-center gap-1.5 bg-[var(--color-panel-bg)] px-3 py-1.5 rounded-xl border border-[var(--color-panel-border)] text-xs transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full ${dot} shadow-inner`}></div>
                  <span className="text-[var(--color-text)] font-medium">
                    {label}: <strong className={`${text} font-bold`}>{value}%</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

