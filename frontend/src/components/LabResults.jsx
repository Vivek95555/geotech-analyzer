export default function LabResults({ labResults }) {
  if (!labResults) return null;

  const params = [
    { label: "Dry Density", value: labResults.dry_density_gm_cc, unit: "gm/cc", icon: "⚖️" },
    { label: "Bulk Density", value: labResults.bulk_density_gm_cc, unit: "gm/cc", icon: "⚖️" },
    { label: "Specific Gravity", value: labResults.specific_gravity, unit: "", icon: "🔬" },
    { label: "Moisture Content", value: labResults.moisture_content_percent, unit: "%", icon: "💧" },
    { label: "Liquid Limit", value: labResults.liquid_limit_percent, unit: "%", icon: "📏" },
    { label: "Plastic Limit", value: labResults.plastic_limit_percent, unit: "%", icon: "📏" },
    { label: "Cohesion (c)", value: labResults.cohesion_kg_cm2, unit: "kg/cm²", icon: "🔗" },
    { label: "Friction Angle (φ)", value: labResults.friction_angle_deg, unit: "°", icon: "📐" },
    { label: "Void Ratio (e)", value: labResults.void_ratio, unit: "", icon: "🕳️" },
    { label: "Compression Index (Cc)", value: labResults.compression_index, unit: "", icon: "📉" },
  ].filter((p) => p.value != null);

  const grain = labResults.grain_size || {};
  const grainData = [
    { label: "Gravel", value: grain.gravel_percent, color: "bg-amber-500" },
    { label: "Sand", value: grain.sand_percent, color: "bg-yellow-400" },
    { label: "Silt", value: grain.silt_percent, color: "bg-orange-300" },
    { label: "Clay", value: grain.clay_percent, color: "bg-red-400" },
  ].filter((g) => g.value != null);

  if (params.length === 0 && grainData.length === 0) return null;

  return (
    <div className="card">
      <p className="section-title">🧪 Laboratory Results</p>

      {/* Parameters Grid */}
      {params.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {params.map(({ label, value, unit, icon }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-lg font-bold text-slate-800">{value}{unit}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Grain Size Distribution */}
      {grainData.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-3">Grain Size Distribution</p>
          <div className="flex h-8 rounded-full overflow-hidden gap-0.5">
            {grainData.map(({ label, value, color }) => (
              <div
                key={label}
                className={`${color} flex items-center justify-center text-white text-xs font-bold transition-all`}
                style={{ width: `${value}%` }}
                title={`${label}: ${value}%`}
              >
                {value > 8 ? `${value}%` : ""}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2 flex-wrap">
            {grainData.map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="text-xs text-slate-500">{label}: {value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
