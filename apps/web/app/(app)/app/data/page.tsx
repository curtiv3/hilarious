export default function DataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Revenue data</h1>
        <p className="text-sm text-slate-400">Ingest Stripe data or upload CSVs.</p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">CSV import</h2>
        <p className="text-sm text-slate-400">Upload revenue CSV with required columns.</p>
        <button className="mt-3 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200">Upload CSV</button>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">Stripe status</h2>
        <p className="text-sm text-slate-400">Connected: No</p>
      </div>
    </div>
  );
}
