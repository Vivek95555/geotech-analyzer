const statusStyles = {
  Optimal:   { bg: "bg-green-50",  border: "border-green-300",  text: "text-green-700",  badge: "bg-green-100 text-green-700",  icon: "🟢" },
  Deficient: { bg: "bg-red-50",    border: "border-red-300",    text: "text-red-700",    badge: "bg-red-100 text-red-700",      icon: "🔴" },
  Excess:    { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-700",icon: "🟡" },
  Unknown:   { bg: "bg-gray-50",   border: "border-gray-200",   text: "text-gray-500",   badge: "bg-gray-100 text-gray-500",    icon: "⚪" },
};

export default function NutrientCard({ label, value, unit, status, idealMin, idealMax }) {
  const style = statusStyles[status] || statusStyles.Unknown;

  return (
    <div className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-semibold text-gray-600">{label}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
          {style.icon} {status}
        </span>
      </div>

      <p className={`text-2xl font-bold ${style.text}`}>
        {value !== null && value !== undefined ? value : "N/A"}
        <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </p>

      <p className="text-xs text-gray-400 mt-1">
        Ideal: {idealMin} – {idealMax} {unit}
      </p>
    </div>
  );
}
