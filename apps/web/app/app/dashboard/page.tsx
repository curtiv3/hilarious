const metrics = [
  { label: "MRR", value: "$1.2M", change: "+6.4%" },
  { label: "Revenue", value: "$4.8M", change: "+3.1%" },
  { label: "Experiments", value: "12", change: "+2 running" }
];

const snapshots = [
  { name: "Pricing test Q2", uplift: "+12.4%", confidence: "95%" },
  { name: "Lifecycle winback", uplift: "+4.1%", confidence: "80%" },
  { name: "Onboarding revamp", uplift: "-1.2%", confidence: "50%" }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Revenue Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">Monitor experiments, revenue impact, and confidence at a glance.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="text-2xl font-semibold text-white">{metric.value}</p>
            <p className="text-xs text-emerald-400">{metric.change}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent snapshots</h2>
          <button className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300">View all</button>
        </div>
        <div className="mt-4 space-y-3">
          {snapshots.map((snapshot) => (
            <div key={snapshot.name} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">
              <div>
                <p className="text-sm text-white">{snapshot.name}</p>
                <p className="text-xs text-slate-400">Confidence {snapshot.confidence}</p>
              </div>
              <span className="text-sm font-semibold text-emerald-400">{snapshot.uplift}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
