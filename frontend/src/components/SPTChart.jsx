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

  const getColor = (n) => {
    if (n < 5)  return "#ef4444"; // red — very loose
    if (n < 10) return "#f97316"; // orange — loose
    if (n < 30) return "#eab308"; // yellow — medium
    if (n < 50) return "#22c55e"; // green — dense
    return "#3b82f6";             // blue — very dense
  };

  return (
    <div className="card">
      <p className="section-title">📈 SPT N-Value vs Depth</p>
      <div className="flex gap-3 mb-4 flex-wrap">
        {[
          { color: "#ef4444", label: "N<5 Very Loose" },
          { color: "#f97316", label: "N<10 Loose" },
          { color: "#eab308", label: "N<30 Medium" },
          { color: "#22c55e", label: "N<50 Dense" },
          { color: "#3b82f6", label: "N≥50 Very Dense" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }}></div>
            <span className="text-xs text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="depth" tick={{ fontSize: 11 }} label={{ value: "Depth", position: "insideBottom", offset: -2 }} />
          <YAxis tick={{ fontSize: 11 }} label={{ value: "N Value", angle: -90, position: "insideLeft" }} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-sm">
                  <p className="font-bold text-slate-800">Depth: {d.depth}</p>
                  <p className="text-blue-600 font-semibold">N = {d.n_value}</p>
                  <p className="text-slate-500 text-xs mt-1 max-w-48">{d.description}</p>
                </div>
              );
            }}
          />
          <ReferenceLine y={10} stroke="#f97316" strokeDasharray="4 2" label={{ value: "N=10", fontSize: 10 }} />
          <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="4 2" label={{ value: "N=30", fontSize: 10 }} />
          <Bar dataKey="n_value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getColor(entry.n_value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
