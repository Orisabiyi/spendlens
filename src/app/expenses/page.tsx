import Navbar from "@/components/navbar";

export default function ExpensesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all your scanned expenses
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-400">
            Coming next — expense list, search, and filters
          </p>
        </div>
      </main>
    </>
  );
}