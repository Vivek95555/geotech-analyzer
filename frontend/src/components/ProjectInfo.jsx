export default function ProjectInfo({ project, siteConditions }) {
  const fields = [
    { label: "Project Name", value: project?.name, icon: "🏗️" },
    { label: "Client", value: project?.client, icon: "🏢" },
    { label: "Location", value: project?.location, icon: "📍" },
    { label: "Date", value: project?.date, icon: "📅" },
    { label: "Executed By", value: project?.executed_by, icon: "👷" },
    { label: "Soil Profile Type", value: siteConditions?.soil_type_general, icon: "🌍" },
    { label: "Water Table Depth", value: siteConditions?.groundwater_table_m != null ? `${siteConditions.groundwater_table_m} m` : null, icon: "💧" },
  ];

  return (
    <div className="glass-card flex flex-col h-full justify-between">
      <div>
        <p className="section-title text-indigo-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Project Details & Site conditions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map(({ label, value, icon }) =>
            value ? (
              <div key={label} className="glass-panel border-[var(--color-panel-border)] flex items-start gap-3 hover:bg-slate-500/5 transition duration-300">
                <span className="text-lg mt-0.5">{icon}</span>
                <div>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-[var(--color-text-title)] mt-1">{value}</p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

