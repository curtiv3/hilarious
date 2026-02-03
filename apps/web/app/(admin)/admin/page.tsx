export default function AdminLandingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Admin</h1>
        <p className="text-sm text-slate-400">Manage tenants, billing status, and platform settings.</p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Tenants</h2>
        <p className="mt-2 text-sm text-slate-400">Review onboarding, plans, and tenant lifecycle states.</p>
        <a href="/admin/tenants" className="mt-4 inline-flex rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
          View tenants
        </a>
      </div>
    </div>
  );
}
