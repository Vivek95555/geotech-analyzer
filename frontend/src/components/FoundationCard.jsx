export default function FoundationCard({ foundation }) {
  if (!foundation) return null;

  const items = [
    { label: "Foundation Type", value: foundation.recommended_type, highlight: true },
    { label: "Foundation Depth", value: foundation.shallow_footing_depth_m != null ? `${foundation.shallow_footing_depth_m} m` : null },
    { label: "Pile Depth", value: foundation.pile_depth_m != null ? `${foundation.pile_depth_m} m` : null },
    { label: "Safe Bearing Capacity", value: foundation.safe_bearing_capacity_t_m2 != null ? `${foundation.safe_bearing_capacity_t_m2} t/m²` : null },
    { label: "Allowable Settlement", value: foundation.allowable_settlement_mm != null ? `${foundation.allowable_settlement_mm} mm` : null },
  ].filter((i) => i.value);

  return (
    <div className="card">
      <p className="section-title">🏛️ Foundation Recommendation</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ label, value, highlight }) => (
          <div
            key={label}
            className={`rounded-xl p-4 ${highlight ? "bg-blue-600 text-white" : "bg-slate-50"}`}
          >
            <p className={`text-xs font-medium ${highlight ? "text-blue-200" : "text-slate-400"}`}>{label}</p>
            <p className={`text-lg font-bold mt-1 ${highlight ? "text-white" : "text-slate-800"}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
