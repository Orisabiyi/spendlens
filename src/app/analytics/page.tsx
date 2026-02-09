import Navbar from "@/components/navbar";

export default function AnalyticsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/80 h-screen px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Spending insights and trends
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-400">
            Coming soon — charts, trends, and category breakdowns
          </p>
        </div>
      </main>
    </>
  );
}