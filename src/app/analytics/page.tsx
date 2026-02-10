"use client";

import { useState } from "react";
import {
  Wallet,
  Receipt,
  TrendingUp,
  CreditCard,
  Loader2,
  BarChart3,
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("month");
  const { data, isLoading } = useAnalytics(period);

  const summary = data?.summary || {
    totalSpent: 0,
    receiptCount: 0,
    averageExpense: 0,
    biggestExpense: 0,
  };

  return (
    <>
      <Navbar />
      <main className="px-4 py-8 bg-white/80 h-screen overflow-scroll">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="mt-1 text-sm text-slate-500">
              Spending insights and trends
            </p>
          </div>

          {/* Period selector */}
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-3 text-sm text-slate-400">
              Crunching numbers...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<Wallet className="h-5 w-5" />}
                label="Total Spent"
                value={formatCurrency(summary.totalSpent)}
                color="blue"
              />
              <SummaryCard
                icon={<Receipt className="h-5 w-5" />}
                label="Receipts"
                value={String(summary.receiptCount)}
                color="green"
              />
              <SummaryCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Average"
                value={formatCurrency(summary.averageExpense)}
                color="purple"
              />
              <SummaryCard
                icon={<CreditCard className="h-5 w-5" />}
                label="Biggest"
                value={formatCurrency(summary.biggestExpense)}
                color="orange"
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category Breakdown */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Spending by Category
                </h3>
                <CategoryPie data={data?.categoryBreakdown || []} />
              </div>

              {/* Daily Trend */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Daily Spending Trend
                </h3>
                <div className="h-56">
                  <TrendLine data={data?.dailyTrend || []} />
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Merchants */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Top Merchants
                </h3>
                <div className="h-64">
                  <MerchantBar data={data?.topMerchants || []} />
                </div>
              </div>

              {/* Recent Activity */}
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
                      <p className="text-sm text-slate-300">No activity yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "green" | "purple" | "orange";
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
        </div>
      </div>
    </div>
  );
}