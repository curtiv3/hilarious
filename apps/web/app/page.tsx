const navLinks = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/admin/tenants", label: "Admin" }
];

const features = [
  {
    title: "Revenue-true experiments",
    description: "Run A/B tests tied to MRR, ARR, and pipeline, with CFO-grade attribution."
  },
  {
    title: "Explainable uplift",
    description: "Difference-in-differences + bootstrap confidence you can audit and trust."
  },
  {
    title: "Lifecycle orchestration",
    description: "Connect data sources and activate learnings across CRM, email, and product."
  }
];

const steps = [
  {
    title: "Connect",
    description: "Sync Stripe, CSVs, and product data in minutes."
  },
  {
    title: "Experiment",
    description: "Define segments, exposures, and hypotheses with guardrails."
  },
  {
    title: "Prove impact",
    description: "Ship reports with uplift, confidence, and audit trails."
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-lg font-semibold">Hilarious</div>
        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="/login"
          className="rounded-md border border-slate-700 px-4 py-2 text-xs font-semibold text-white"
        >
          Sign in
        </a>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="grid gap-12 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-400">Revenue experimentation</p>
            <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
              Hilarious — A/B testing + Revenue insights for SaaS
            </h1>
            <p className="mt-4 text-base text-slate-300">
              Prove what actually drives revenue. Launch experiments, measure uplift, and share CFO-grade reports
              without juggling a dozen tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/login"
                className="rounded-md bg-indigo-500 px-6 py-3 text-sm font-semibold text-white"
              >
                Get Started
              </a>
              <a
                href="/app/dashboard"
                className="rounded-md border border-slate-700 px-6 py-3 text-sm font-semibold text-white"
              >
                View Demo
              </a>
            </div>
            <div className="mt-8 flex gap-6 text-xs text-slate-400">
              <span>Trusted by growth teams</span>
              <span>Audit-ready analytics</span>
              <span>Multi-tenant by default</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Experiment summary</span>
              <span>Confidence 92%</span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-300">Pricing test Q3</p>
                <p className="text-2xl font-semibold text-emerald-400">+11.8% uplift</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-400">Treatment</p>
                  <p className="text-lg font-semibold text-white">$1.24M</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-400">Control</p>
                  <p className="text-lg font-semibold text-white">$1.11M</p>
                </div>
              </div>
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4 text-xs text-slate-400">
                Export-ready PDF report with assumptions and audit trails.
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-2xl font-semibold text-white">Features</h2>
          <p className="mt-2 text-sm text-slate-400">Everything you need to move from hypothesis to revenue impact.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-2xl font-semibold text-white">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-widest text-indigo-400">Step {index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-2xl font-semibold text-white">Security & privacy</h2>
            <p className="mt-3 text-sm text-slate-400">
              SOC2-ready controls, encrypted data sources, and audit trails on every change. Multi-tenant isolation is
              enforced at every layer so your data stays yours.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 md:flex-row">
          <span>© 2024 Hilarious, Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="/login" className="hover:text-white">
              Get Started
            </a>
            <a href="/app/dashboard" className="hover:text-white">
              Demo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
