export default function ScoreGauge({ score }) {
  const getColor = (s) => {
    if (s >= 70) return "#2d6a4f";
    if (s >= 40) return "#f4a261";
    return "#e63946";
  };

  const getLabel = (s) => {
    if (s >= 70) return "Healthy";
    if (s >= 40) return "Moderate";
    return "Poor";
  };

  const color = getColor(score);
  const radius = 70;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Soil Health Score</h3>

      <svg width="180" height="100" viewBox="0 0 180 100">
        {/* Background arc */}
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 251.2} 251.2`}
        />
        {/* Score text */}
        <text x="90" y="80" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color}>
          {score}
        </text>
        <text x="90" y="98" textAnchor="middle" fontSize="11" fill="#9ca3af">
          out of 100
        </text>
      </svg>

      <span
        className="mt-2 px-4 py-1 rounded-full text-white text-sm font-semibold"
        style={{ backgroundColor: color }}
      >
        {getLabel(score)}
      </span>
    </div>
  );
}
