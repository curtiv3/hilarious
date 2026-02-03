export default function NewExperimentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Create experiment</h1>
        <p className="text-sm text-slate-400">Define hypothesis, segments, and metrics.</p>
      </div>
      <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <input className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white" placeholder="Experiment name" />
        <textarea className="min-h-[120px] rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white" placeholder="Hypothesis" />
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white" placeholder="Start date" />
          <input className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white" placeholder="End date" />
        </div>
        <button className="w-fit rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">Save experiment</button>
      </div>
    </div>
  );
}
