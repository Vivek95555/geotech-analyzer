export default function Recommendations({ text }) {
  if (!text) return null;

  // Convert markdown-style text to formatted lines
  const lines = text.split("\n").filter((l) => l.trim());

  return (
    <div className="glass-card relative overflow-hidden">
      {/* Visual top accent bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <p className="section-title text-indigo-400 mt-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI-Powered Engineering Recommendations
      </p>

      <div className="max-w-none text-[var(--color-text)] space-y-3.5 leading-relaxed text-sm">
        {lines.map((line, i) => {
          // Headers (## or ###)
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} className="text-sm font-extrabold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider mt-6 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                {line.replace("### ", "")}
              </h3>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="text-base font-black text-[var(--color-text-title)] mt-8 mb-3 border-b border-[var(--color-border)] pb-2">
                {line.replace("## ", "")}
              </h2>
            );
          }
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={i} className="font-bold text-[var(--color-text-title)] mt-4 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {line.replace(/\*\*/g, "")}
              </p>
            );
          }
          // Bullet points
          if (line.startsWith("* ") || line.startsWith("- ")) {
            return (
              <div key={i} className="flex gap-3 pl-2 mt-2 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] rounded-xl p-3 hover:bg-slate-500/5 transition duration-150">
                <span className="text-indigo-600 dark:text-indigo-500 font-bold shrink-0 text-base">•</span>
                <p className="text-[var(--color-text)] text-xs leading-normal">
                  {line.replace(/^[*\-] /, "").replace(/\*\*/g, "")}
                </p>
              </div>
            );
          }
          // Numbered list
          if (/^\d+\./.test(line)) {
            return (
              <div key={i} className="flex gap-3 pl-2 mt-2 bg-[var(--color-panel-bg)] border border-[var(--color-panel-border)] rounded-xl p-3 hover:bg-slate-500/5 transition duration-150">
                <span className="text-indigo-600 dark:text-indigo-400 font-black shrink-0 text-xs mt-0.5">
                  {line.match(/^\d+/)[0]}.
                </span>
                <p className="text-[var(--color-text)] text-xs leading-normal">
                  {line.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "")}
                </p>
              </div>
            );
          }
          // Divider
          if (line.startsWith("---")) {
            return <hr key={i} className="my-6 border-[var(--color-border)]" />;
          }
          // Normal paragraph
          return (
            <p key={i} className="text-[var(--color-text)] text-xs leading-relaxed mt-2 text-justify">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        })}
      </div>
    </div>
  );
}

