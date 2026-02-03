export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Access your revenue experiments dashboard.</p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white" type="email" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white" type="password" />
          </div>
          <button className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">Sign in</button>
        </form>
      </div>
    </main>
  );
}
