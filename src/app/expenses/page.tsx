"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import Navbar from "@/components/navbar";
import ExpenseList from "@/components/expense-list";
import ExpenseFiltersBar from "@/components/expense-filters";
import Pagination from "@/components/pagination";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseFilters } from "@/types/expense";
import Link from "next/link";

export default function ExpensesPage() {
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useExpenses(filters);
  const expenses = data?.expenses || [];
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white/80 px-4 py-6 sm:py-8">
        <section className="mx-auto max-w-5xl">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Expenses
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                View and manage all your scanned expenses
              </p>
            </div>
            <Link
              href="/"
              className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] sm:px-5 sm:py-2.5"
            >
              <Receipt className="h-4 w-4" />
              Scan Receipt
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <ExpenseFiltersBar
              filters={filters}
              onFiltersChange={setFilters}
              totalResults={pagination.total}
            />

            <ExpenseList expenses={expenses} isLoading={isLoading} />

            {pagination.totalPages > 1 && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) =>
                  setFilters((prev) => ({ ...prev, page }))
                }
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
}