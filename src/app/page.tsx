import { ScanLine, BarChart3, Receipt } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <ScanLine className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            SpendLens
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            AI-powered receipt scanning &amp; expense tracking
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ScanLine className="mb-3 h-6 w-6 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Scan Receipts</h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a receipt photo and let AI extract all the details instantly.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <Receipt className="mb-3 h-6 w-6 text-green-600" />
            <h2 className="font-semibold text-slate-900">Track Expenses</h2>
            <p className="mt-1 text-sm text-slate-500">
              All your expenses organized, searchable, and categorized automatically.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <BarChart3 className="mb-3 h-6 w-6 text-purple-600" />
            <h2 className="font-semibold text-slate-900">Analytics</h2>
            <p className="mt-1 text-sm text-slate-500">
              Beautiful charts and insights to understand your spending patterns.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400">
            🚧 Under construction — building step by step
          </p>
        </div>
      </div>
    </main>
  );
}
