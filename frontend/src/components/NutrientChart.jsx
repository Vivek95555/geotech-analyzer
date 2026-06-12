import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function NutrientChart({ parameterScores }) {
  // Convert scores to percentage of their weight for radar
  const data = Object.entries(parameterScores).map(([key, info]) => ({
    param: formatLabel(key),
    score: Math.round((info.score / info.weight) * 100),
    fullMark: 100,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Nutrient Profile</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="param" tick={{ fontSize: 11 }} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#2d6a4f"
            fill="#52b788"
            fillOpacity={0.4}
          />
          <Tooltip formatter={(val) => `${val}%`} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatLabel(key) {
  const labels = {
    pH: "pH",
    organic_carbon_percent: "Org. Carbon",
    nitrogen_kg_ha: "Nitrogen",
    phosphorus_kg_ha: "Phosphorus",
    potassium_kg_ha: "Potassium",
    zinc_mg_kg: "Zinc",
    iron_mg_kg: "Iron",
    manganese_mg_kg: "Manganese",
    copper_mg_kg: "Copper",
    boron_mg_kg: "Boron",
  };
  return labels[key] || key;
}
