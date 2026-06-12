export default function ProjectInfo({ project, siteConditions }) {
  const fields = [
    { label: "Project Name", value: project?.name },
    { label: "Client", value: project?.client },
    { label: "Location", value: project?.location },
    { label: "Date", value: project?.date },
    { label: "Executed By", value: project?.executed_by },
    { label: "Soil Type", value: siteConditions?.soil_type_general },
    { label: "Water Table Depth", value: siteConditions?.groundwater_table_m != null ? `${siteConditions.groundwater_table_m} m` : null },
  ];

  return (
    <div className="card">
      <p className="section-title">📋 Project Information</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ label, value }) =>
          value ? (
            <div key={label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
