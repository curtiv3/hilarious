import type { ReactNode } from "react";

const navItems = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/experiments", label: "Experiments" },
  { href: "/app/data", label: "Data" },
  { href: "/app/settings", label: "Settings" }
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
          <div className="text-lg font-semibold">Hilarious</div>
          <nav className="mt-6 space-y-2 text-sm">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
