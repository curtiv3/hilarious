const quickLinks = [
  { href: "/app/experiments", label: "View experiments" },
  { href: "/app/data", label: "Manage data" },
  { href: "/app/settings", label: "Team settings" }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400">Monitor revenue-impacting experiments across your tenant.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">MRR</p>
          <p className="text-2xl font-semibold text-white">$1.2M</p>
          <p className="text-xs text-emerald-400">+6.4%</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Experiments running</p>
          <p className="text-2xl font-semibold text-white">4</p>
          <p className="text-xs text-slate-400">Last updated 2h ago</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Confidence</p>
          <p className="text-2xl font-semibold text-white">92%</p>
          <p className="text-xs text-slate-400">Across active tests</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
