const tenants = [
  { id: "t-1", name: "DemoCo", plan: "starter", status: "trial" },
  { id: "t-2", name: "ScaleUp", plan: "scale", status: "active" }
];

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Tenants</h1>
        <p className="text-sm text-slate-400">Manage tenant lifecycle and plans.</p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="space-y-3">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">
              <div>
                <p className="text-sm text-white">{tenant.name}</p>
                <p className="text-xs text-slate-400">{tenant.plan} · {tenant.status}</p>
              </div>
              <a href={`/admin/tenants/${tenant.id}`} className="text-xs text-indigo-400">Manage</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
