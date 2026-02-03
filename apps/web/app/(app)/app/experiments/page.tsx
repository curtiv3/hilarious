const experiments = [
  { id: "exp-1", name: "Pricing test Q2", status: "running", metric: "MRR" },
  { id: "exp-2", name: "Lifecycle winback", status: "ended", metric: "Revenue" }
];

export default function ExperimentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Experiments</h1>
          <p className="text-sm text-slate-400">Create and track revenue experiments.</p>
        </div>
        <a href="/app/experiments/new" className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
          New experiment
        </a>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Primary metric</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950">
            {experiments.map((experiment) => (
              <tr key={experiment.id}>
                <td className="px-4 py-3 text-white">{experiment.name}</td>
                <td className="px-4 py-3 text-slate-300">{experiment.status}</td>
                <td className="px-4 py-3 text-slate-300">{experiment.metric}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
