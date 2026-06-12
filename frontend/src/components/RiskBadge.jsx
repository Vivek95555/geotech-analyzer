export default function RiskBadge({ riskAssessment }) {
  const { risk_level, risk_score, risk_flags, spt_summary, water_table_risk } = riskAssessment;

  const riskConfig = {
    Low:    { color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", bar: "bg-green-500",  icon: "🟢" },
    Medium: { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200",bar: "bg-yellow-500", icon: "🟡" },
    High:   { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",   bar: "bg-red-500",    icon: "🔴" },
  };

  const cfg = riskConfig[risk_level] || riskConfig.Medium;

  return (
    <div className="card">
      <p className="section-title">⚠️ Risk Assessment</p>

      {/* Risk Level */}
      <div className={`rounded-xl p-4 border ${cfg.bg} ${cfg.border} mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-lg font-bold ${cfg.color}`}>{cfg.icon} {risk_level} Risk</span>
          <span className={`text-2xl font-bold ${cfg.color}`}>{risk_score}/100</span>
        </div>
        <div className="w-full bg-white rounded-full h-2.5">
          <div className={`h-2.5 rounded-full ${cfg.bar} transition-all`} style={{ width: `${risk_score}%` }}></div>
        </div>
      </div>

      {/* SPT Summary */}
      {spt_summary?.average_n != null && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400">Avg. SPT N-Value</p>
            <p className="text-xl font-bold text-slate-800">{spt_summary.average_n}</p>
            <p className="text-xs text-slate-500">{spt_summary.label}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400">Water Table Risk</p>
            <p className={`text-xl font-bold ${riskConfig[water_table_risk]?.color || "text-slate-800"}`}>
              {water_table_risk}
            </p>
            <p className="text-xs text-slate-500">Risk Level</p>
          </div>
        </div>
      )}

      {/* Risk Flags */}
      {risk_flags?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Risk Flags</p>
          <div className="space-y-2">
            {risk_flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3">
                <span className="text-red-500 mt-0.5 shrink-0">⚠️</span>
                <p className="text-xs text-red-700">{flag}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
