"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  Wallet,
  Receipt,
  TrendingUp,
  CreditCard,
  Loader2,
  BarChart3,
  Coins,
} from "lucide-react";
import Navbar from "@/components/navbar";
import CategoryPie from "@/components/charts/category-pie";
import TrendLine from "@/components/charts/trend-line";
import MerchantBar from "@/components/charts/merchant-bar";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency, formatDate, getCategoryColor } from "@/lib/utils";

const periods = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const period = searchParams.get("period") || "all";
  const selectedCurrency = searchParams.get("currency") || null;

  const { data, isLoading } = useAnalytics(period, selectedCurrency);

  const summary = data?.summary || {
    totalSpent: 0,
    receiptCount: 0,
    averageExpense: 0,
    biggestExpense: 0,
  };

  const currencies: string[] = data?.currencies || [];
  const activeCurrency: string =
    selectedCurrency || data?.activeCurrency || "NGN";
  const currencyBreakdown: {
    currency: string;
    total: number;
    count: number;
  }[] = data?.currencyBreakdown || [];
  const hasMultipleCurrencies = currencies.length > 1;

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/analytics?${params.toString()}`);
  };

  return (
    <main className="px-4 py-8 bg-white/80 h-screen overflow-scroll">
      <section className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="mt-1 text-sm text-slate-500">
              Spending insights and trends
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency selector */}
            {hasMultipleCurrencies && (
              <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                {currencies.map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => updateParams({ currency: cur })}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activeCurrency === cur
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            )}

            {/* Period selector */}
            <div className="flex rounded-xl border border-slate-200 bg-white p-1">
              {periods.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => updateParams({ period: p.value })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${period === p.value
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-3 text-sm text-slate-400">
              Crunching numbers...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Multi-Currency Banner */}
            {hasMultipleCurrencies && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="h-4 w-4 text-slate-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Spending by Currency
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currencyBreakdown.map((cb) => (
                    <button
                      key={cb.currency}
                      type="button"
                      onClick={() =>
                        updateParams({ currency: cb.currency })
                      }
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${activeCurrency === cb.currency
                          ? "border-blue-200 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                    >
                      <div>
                        <p
                          className={`text-lg font-bold ${activeCurrency === cb.currency
                              ? "text-blue-700"
                              : "text-slate-900"
                            }`}
                        >
                          {formatCurrency(cb.total, cb.currency)}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {cb.count} receipt{cb.count !== 1 ? "s" : ""} in{" "}
                          {cb.currency}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<Wallet className="h-5 w-5" />}
                label="Total Spent"
                value={formatCurrency(summary.totalSpent, activeCurrency)}
                color="blue"
              />
              <SummaryCard
                icon={<Receipt className="h-5 w-5" />}
                label="Receipts"
                value={String(summary.receiptCount)}
                color="green"
                subtitle={activeCurrency}
              />
              <SummaryCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Average"
                value={formatCurrency(
                  summary.averageExpense,
                  activeCurrency
                )}
                color="purple"
              />
              <SummaryCard
                icon={<CreditCard className="h-5 w-5" />}
                label="Biggest"
                value={formatCurrency(
                  summary.biggestExpense,
                  activeCurrency
                )}
                color="orange"
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Spending by Category
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({activeCurrency})
                  </span>
                </h3>
                <CategoryPie
                  data={data?.categoryBreakdown || []}
                  currency={activeCurrency}
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Daily Spending Trend
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({activeCurrency})
                  </span>
                </h3>
                <div className="h-56">
                  <TrendLine
                    data={data?.dailyTrend || []}
                    currency={activeCurrency}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Top Merchants
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({activeCurrency})
                  </span>
                </h3>
                <div className="h-64">
                  <MerchantBar
                    data={data?.topMerchants || []}
                    currency={activeCurrency}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Recent Activity
                </h3>
                {data?.recentExpenses && data.recentExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {data.recentExpenses.map(
                      (expense: {
                        id: string;
                        merchant: string;
                        total: number;
                        currency: string;
                        category: string;
                        date: string;
                      }) => (
                        <div
                          key={expense.id}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor:
                                getCategoryColor(expense.category) + "15",
                            }}
                          >
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: getCategoryColor(
                                  expense.category
                                ),
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {expense.merchant}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {formatDate(expense.date)} • {expense.category}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(expense.total, expense.currency)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                      <p className="text-sm text-slate-300">
                        No activity yet
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function AnalyticsPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="px-4 py-8 bg-white/80 h-screen">
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-3 text-sm text-slate-400">Loading...</p>
            </div>
          </main>
        }
      >
        <AnalyticsContent />
      </Suspense>
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "green" | "purple" | "orange";
  subtitle?: string;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-lg font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="text-[10px] text-slate-300">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}