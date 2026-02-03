export default function TenantDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">DemoCo</h1>
        <p className="text-sm text-slate-400">Plan: starter · Status: trial</p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">Usage (last 30 days)</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>Revenue events: 12,430</li>
          <li>Exposures: 1,008</li>
          <li>Experiments: 4</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">Plan management</h2>
        <button className="mt-3 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200">Set plan/status</button>
      </div>
    </div>
  );
}
