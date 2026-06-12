export default function Recommendations({ text }) {
  if (!text) return null;

  // Convert markdown-style text to formatted lines
  const lines = text.split("\n").filter((l) => l.trim());

  return (
    <div className="card">
      <p className="section-title">💡 Foundation Recommendation Report</p>
      <div className="prose prose-sm max-w-none">
        {lines.map((line, i) => {
          // Headers (## or ###)
          if (line.startsWith("### ")) {
            return <h3 key={i} className="text-base font-bold text-slate-800 mt-4 mb-1">{line.replace("### ", "")}</h3>;
          }
          if (line.startsWith("## ")) {
            return <h2 key={i} className="text-lg font-bold text-blue-700 mt-5 mb-2">{line.replace("## ", "")}</h2>;
          }
          if (line.startsWith("**") && line.endsWith("**")) {
            return <p key={i} className="font-bold text-slate-800 mt-3">{line.replace(/\*\*/g, "")}</p>;
          }
          // Bullet points
          if (line.startsWith("* ") || line.startsWith("- ")) {
            return (
              <div key={i} className="flex gap-2 mt-1">
                <span className="text-blue-500 shrink-0">•</span>
                <p className="text-sm text-slate-600">{line.replace(/^[*\-] /, "").replace(/\*\*/g, "")}</p>
              </div>
            );
          }
          // Numbered list
          if (/^\d+\./.test(line)) {
            return (
              <div key={i} className="flex gap-2 mt-1">
                <span className="text-blue-600 font-bold shrink-0 text-sm">{line.match(/^\d+/)[0]}.</span>
                <p className="text-sm text-slate-600">{line.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "")}</p>
              </div>
            );
          }
          // Divider
          if (line.startsWith("---")) {
            return <hr key={i} className="my-4 border-slate-200" />;
          }
          // Normal paragraph
          return (
            <p key={i} className="text-sm text-slate-600 mt-1 leading-relaxed">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        })}
      </div>
    </div>
  );
}
