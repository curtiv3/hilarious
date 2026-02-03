const exposures = [
  { label: "Treatment", count: 520 },
  { label: "Control", count: 488 }
];

export default function ExperimentDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Pricing test Q2</h1>
        <p className="text-sm text-slate-400">Primary metric: MRR · Status: Running</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {exposures.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">{item.label} sample size</p>
            <p className="text-2xl font-semibold text-white">{item.count}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Results</h2>
          <button className="rounded-md bg-indigo-500 px-3 py-1 text-xs text-white">Recompute</button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-400">Uplift</p>
            <p className="text-xl font-semibold text-emerald-400">+12.4%</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-400">Confidence</p>
            <p className="text-xl font-semibold text-white">95%</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-400">CI band</p>
            <p className="text-xl font-semibold text-white">[+6.2%, +18.1%]</p>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-dashed border-slate-700 bg-slate-950 p-6 text-sm text-slate-400">
          Chart placeholder: pre vs post revenue for control/treatment.
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">Exposures import</h2>
        <p className="text-sm text-slate-400">Upload CSV with subject_id, group, exposed_at.</p>
        <button className="mt-3 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200">Upload CSV</button>
      </div>
      <button className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200">Export PDF</button>
    </div>
  );
}
