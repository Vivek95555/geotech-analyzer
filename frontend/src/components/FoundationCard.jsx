export default function FoundationCard({ foundation }) {
  if (!foundation) return null;

  const items = [
    { label: "Foundation Design Type", value: foundation.recommended_type, highlight: true, icon: "🏛️" },
    { label: "Recommended Footing Depth", value: foundation.shallow_footing_depth_m != null ? `${foundation.shallow_footing_depth_m} meters` : null, highlight: false, icon: "📐" },
    { label: "Recommended Pile Depth", value: foundation.pile_depth_m != null ? `${foundation.pile_depth_m} meters` : null, highlight: false, icon: "🏗️" },
    { label: "Safe Bearing Capacity (SBC)", value: foundation.safe_bearing_capacity_t_m2 != null ? `${foundation.safe_bearing_capacity_t_m2} t/m²` : null, highlight: false, icon: "⚖️" },
    { label: "Allowable Settlement limit", value: foundation.allowable_settlement_mm != null ? `${foundation.allowable_settlement_mm} mm` : null, highlight: false, icon: "📉" },
  ].filter((i) => i.value);

  return (
    <div className="glass-card relative overflow-hidden">
      {/* Decorative side glow */}
      <div className="absolute top-0 right-0 w-24 h-full bg-indigo-500/5 blur-2xl pointer-events-none"></div>
      
      <p className="section-title text-indigo-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Structural Foundation Recommendations
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ label, value, highlight, icon }) => (
          <div
            key={label}
            className={`rounded-2xl p-5 border transition-all duration-300 relative group overflow-hidden
              ${highlight 
                ? "bg-gradient-to-tr from-indigo-600 to-violet-700 border-indigo-400/30 text-white shadow-[0_4px_25px_rgba(99,102,241,0.15)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.25)] hover:scale-[1.01]" 
                : "glass-panel border-[var(--color-panel-border)] hover:bg-slate-500/5 hover:border-[var(--color-border)]"}`}
          >
            {highlight && (
              <div className="absolute -right-6 -bottom-6 text-white/10 opacity-30 text-7xl font-bold select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                {icon}
              </div>
            )}
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${highlight ? "text-indigo-200" : "text-[var(--color-text-muted)]"}`}>
                {label}
              </span>
              <span className={`text-sm ${highlight ? "text-white" : "text-indigo-500 dark:text-indigo-400"}`}>{icon}</span>
            </div>
            <p className={`text-xl font-extrabold mt-1 tracking-tight ${highlight ? "text-white" : "text-[var(--color-text-title)]"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

