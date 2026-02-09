"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import ExpenseList from "@/components/expense-list";
import ExpenseFiltersBar from "@/components/expense-filters";
import Pagination from "@/components/pagination";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseFilters } from "@/types/expense";

export default function ExpensesPage() {
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useExpenses(filters);
  const expenses = data?.expenses || [];
  const pagination = data?.pagination || { page: 1, total: 0, pages: 1 };

  return (
    <>
      <Navbar />
      <main className="bg-white/80 h-screen px-4 py-8">
        <section className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all your scanned expenses
            </p>
          </div>

          <div className="space-y-4">
            <ExpenseFiltersBar
              filters={filters}
              onFiltersChange={setFilters}
              totalResults={pagination.total}
            />

            <ExpenseList expenses={expenses} isLoading={isLoading} />

            <Pagination
              page={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        </section>
      </main>
    </>
  );
}