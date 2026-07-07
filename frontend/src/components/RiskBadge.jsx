export default function RiskBadge({ riskAssessment }) {
  const { risk_level, risk_score, risk_flags, spt_summary, water_table_risk } = riskAssessment;

  const riskConfig = {
    Low:    { color: "text-emerald-400",  bg: "bg-emerald-500/10",  border: "border-emerald-500/30", bar: "#10b981", glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]", icon: "🟢" },
    Medium: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", bar: "#f59e0b", glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]", icon: "🟡" },
    High:   { color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/30",   bar: "#ef4444", glow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]",  icon: "🔴" },
  };

  const cfg = riskConfig[risk_level] || riskConfig.Medium;
  
  // Speedometer calculation
  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius; // 251.3
  const offset = circumference - ((risk_score ?? 50) / 100) * circumference;
  
  // Angle for needle (from -90deg to +90deg)
  const needleAngle = ((risk_score ?? 50) / 100) * 180 - 90;

  return (
    <div className="glass-card flex flex-col justify-between h-full">
      <div>
        <p className="section-title text-indigo-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Geotechnical Hazard Risk Assessment
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          {/* Gauge Widget */}
          <div className="relative w-44 h-32 flex justify-center shrink-0">
            <svg width="176" height="128" viewBox="0 0 180 130" className="overflow-visible">
              {/* Background Track */}
              <path
                d="M 10 100 A 80 80 0 0 1 170 100"
                fill="none"
                stroke="var(--color-input-border)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Color Progress Fill */}
              <path
                d="M 10 100 A 80 80 0 0 1 170 100"
                fill="none"
                stroke={cfg.bar}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
              
              {/* Needle pointer (rendered first so it sits behind the central hub) */}
              <line
                x1="90"
                y1="100"
                x2="90"
                y2="28"
                stroke={cfg.bar}
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${needleAngle}deg)`,
                  transformOrigin: "90px 100px",
                  transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              />
              
              {/* Central Hub Cap (rendered on top of the needle to mask its pivot) */}
              {/* Outer Hub Ring */}
              <circle cx="90" cy="100" r="32" fill="var(--color-bg)" stroke="var(--color-card-border)" strokeWidth="1.5" className="transition-colors duration-300" />
              {/* Inner Hub Circle */}
              <circle cx="90" cy="100" r="26" fill="var(--color-panel-bg)" stroke="var(--color-border)" strokeWidth="0.5" className="transition-colors duration-300" />
              
              {/* Digital Score text inside the Hub */}
              <text x="90" y="96" textAnchor="middle" fill="var(--color-text-title)" className="text-xl font-extrabold tracking-tight transition-colors duration-300">{risk_score}</text>
              <text x="90" y="109" textAnchor="middle" fill="var(--color-text-muted)" className="text-[7.5px] font-bold tracking-widest uppercase transition-colors duration-300">Score</text>
            </svg>
          </div>

          {/* Risk Level Badge & Overview */}
          <div className="flex-1 w-full text-center sm:text-left">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${cfg.bg} ${cfg.border} ${cfg.color} ${cfg.glow} mb-2`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {risk_level} Risk Level
            </span>
            <p className="text-xs text-[var(--color-text)] leading-relaxed mt-1">
              Based on the average SPT N-values of soil layers and ground water conditions, the overall risk is classified as <strong className={cfg.color}>{risk_level.toLowerCase()}</strong>.
            </p>
          </div>
        </div>

        {/* Mini parameter summary grid */}
        {spt_summary?.average_n != null && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="glass-panel border-[var(--color-panel-border)] text-center">
              <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Avg. SPT N-Value</p>
              <p className="text-lg font-extrabold text-[var(--color-text-title)] mt-1">{spt_summary.average_n}</p>
              <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-0.5">{spt_summary.label}</p>
            </div>
            <div className="glass-panel border-[var(--color-panel-border)] text-center">
              <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Water Table Hazard</p>
              <p className={`text-lg font-extrabold mt-1 ${riskConfig[water_table_risk]?.color || "text-[var(--color-text-title)]"}`}>
                {water_table_risk}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] font-semibold mt-0.5">Risk Level</p>
            </div>
          </div>
        )}

        {/* Risk Flags list */}
        {risk_flags?.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2.5">Stability Hazard Flags</p>
            <div className="space-y-2">
              {risk_flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 hover:bg-rose-500/10 transition duration-300">
                  <svg className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs text-rose-700 dark:text-rose-300 leading-normal font-medium">{flag}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

