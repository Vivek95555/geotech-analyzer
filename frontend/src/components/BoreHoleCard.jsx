export default function BoreHoleCard({ boreHoles }) {
  if (!boreHoles || boreHoles.length === 0) return null;

  return (
    <div className="card">
      <p className="section-title">🕳️ Bore Hole Data</p>
      <div className="space-y-6">
        {boreHoles.map((bh, i) => (
          <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
            {/* BH Header */}
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold">{bh.id || `BH-0${i + 1}`}</span>
              <div className="flex gap-4 text-sm">
                {bh.depth_m != null && <span>Depth: {bh.depth_m}m</span>}
                {bh.water_table_m != null && <span>💧 GWT: {bh.water_table_m}m</span>}
              </div>
            </div>

            {/* Strata Table */}
            {bh.strata && bh.strata.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left">Depth (m)</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Classification</th>
                      <th className="px-4 py-2 text-left">SPT N-Values</th>
                      <th className="px-4 py-2 text-left">Consistency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bh.strata.map((s, j) => (
                      <tr key={j} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-blue-700 whitespace-nowrap">
                          {s.depth_from_m ?? "?"} – {s.depth_to_m ?? "?"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 max-w-xs">{s.description || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{s.soil_classification || "—"}</td>
                        <td className="px-4 py-3">
                          {s.spt_n_values && s.spt_n_values.length > 0 ? (
                            <div className="flex gap-1 flex-wrap">
                              {s.spt_n_values.map((n, k) => (
                                <span key={k} className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                  {n}
                                </span>
                              ))}
                            </div>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {s.consistency ? (
                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                              {s.consistency}
                            </span>
                          ) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
