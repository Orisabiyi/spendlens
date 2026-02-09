import Navbar from "@/components/navbar";

export default function ExpensesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/80 h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="mb-6 w-1/2">
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all your scanned expenses
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center w-1/2">
          <p className="text-sm text-slate-400">
            Coming next — expense list, search, and filters
          </p>
        </div>
      </main>
    </>
  );
}