import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

export default function SPTChart({ boreHoles }) {
  // Build SPT data points: { depth, n_value, layer }
  const data = [];
  if (!boreHoles) return null;

  boreHoles.forEach((bh) => {
    (bh.strata || []).forEach((s) => {
      (s.spt_n_values || []).forEach((n) => {
        const midDepth = s.depth_from_m != null && s.depth_to_m != null
          ? ((s.depth_from_m + s.depth_to_m) / 2).toFixed(1)
          : s.depth_to_m ?? s.depth_from_m ?? "?";
        data.push({
          depth: `${midDepth}m`,
          n_value: n,
          description: s.description || "",
        });
      });
    });
  });

  if (data.length === 0) return null;

  const getGradientUrl = (n) => {
    if (n < 5)  return "url(#veryLoose)"; 
    if (n < 10) return "url(#loose)"; 
    if (n < 30) return "url(#medium)"; 
    if (n < 50) return "url(#dense)"; 
    return "url(#veryDense)";             
  };

  const getBaseColor = (n) => {
    if (n < 5)  return "#ef4444"; 
    if (n < 10) return "#f97316"; 
    if (n < 30) return "#eab308"; 
    if (n < 50) return "#22c55e"; 
    return "#3b82f6";             
  };

  return (
    <div className="glass-card">
      <p className="section-title text-indigo-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Standard Penetration Test (SPT) Profile
      </p>

      {/* Legend list */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { color: "bg-[#ef4444]", label: "N < 5 (Very Loose)" },
          { color: "bg-[#f97316]", label: "N < 10 (Loose)" },
          { color: "bg-[#eab308]", label: "N < 30 (Medium)" },
          { color: "bg-[#22c55e]", label: "N < 50 (Dense)" },
          { color: "bg-[#3b82f6]", label: "N ≥ 50 (Very Dense)" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 bg-[var(--color-panel-bg)] px-2.5 py-1 rounded-lg border border-[var(--color-panel-border)] text-[10px] transition-colors">
            <div className={`w-2 h-2 rounded-full ${l.color}`}></div>
            <span className="text-[var(--color-text)] font-semibold">{l.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="veryLoose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.15}/>
            </linearGradient>
            <linearGradient id="loose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.15}/>
            </linearGradient>
            <linearGradient id="medium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eab308" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="#eab308" stopOpacity={0.15}/>
            </linearGradient>
            <linearGradient id="dense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.15}/>
            </linearGradient>
            <linearGradient id="veryDense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.15}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-card-border)" opacity={0.4} />
          <XAxis dataKey="depth" stroke="var(--color-text-muted)" tick={{ fontSize: 9, fill: "var(--color-text)" }} label={{ value: "Midpoint Depth", position: "insideBottom", offset: -2, fill: "var(--color-text-title)", fontSize: 10 }} />
          <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 9, fill: "var(--color-text)" }} label={{ value: "N Blow Count", angle: -90, position: "insideLeft", offset: 10, fill: "var(--color-text-title)", fontSize: 10 }} />
          <Tooltip
            cursor={{ fill: "rgba(148, 163, 184, 0.05)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              const dotColor = getBaseColor(d.n_value);
              return (
                <div className="glass-card border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-3.5 shadow-xl text-xs max-w-[220px]">
                  <p className="font-bold text-[var(--color-text)]">Interval depth: {d.depth}</p>
                  <p className="font-extrabold text-sm mt-1 flex items-center gap-1.5" style={{ color: dotColor }}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    Blow Count N = {d.n_value}
                  </p>
                  <p className="text-[var(--color-text-muted)] text-[10px] leading-relaxed mt-1.5 border-t border-[var(--color-border)] pt-1.5">{d.description}</p>
                </div>
              );
            }}
          />
          <ReferenceLine y={10} stroke="#f97316" strokeDasharray="4 2" strokeOpacity={0.5} label={{ value: "N=10 (Loose Threshold)", fontSize: 8, fill: "#f97316", position: "top" }} />
          <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="4 2" strokeOpacity={0.5} label={{ value: "N=30 (Dense Threshold)", fontSize: 8, fill: "#22c55e", position: "top" }} />
          <Bar dataKey="n_value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getGradientUrl(entry.n_value)} stroke={getBaseColor(entry.n_value)} strokeWidth={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

