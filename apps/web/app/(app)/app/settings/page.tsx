export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-slate-400">Manage users, data sources, and audit logs.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-sm text-slate-400">Invite admins and analysts.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Sources</h2>
          <p className="text-sm text-slate-400">Configure Stripe, CSV, or warehouse sources.</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">Audit logs</h2>
        <p className="text-sm text-slate-400">Track every mutation and export for compliance.</p>
      </div>
    </div>
  );
}
