"use client";

import { Loader2, Receipt } from "lucide-react";
import { Expense } from "@/types/expense";
import ExpenseCard from "./expense-card";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
}

export default function ExpenseList({ expenses, isLoading }: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-3 text-sm text-slate-400">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Receipt className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No expenses found</p>
        <p className="mt-1 text-xs text-slate-400">
          Scan a receipt to get started, or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
}