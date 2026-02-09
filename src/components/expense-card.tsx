"use client";

import { useState } from "react";
import {
  Calendar,
  Tag,
  Trash2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Expense } from "@/types/expense";
import {
  formatCurrency,
  formatDate,
  getConfidenceColor,
  getCategoryColor,
} from "@/lib/utils";
import { useDeleteExpense } from "@/hooks/useExpenses";

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteMutation = useDeleteExpense();

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      await deleteMutation.mutateAsync(expense.id);
      toast.success("Expense deleted");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-sm">
      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        {/* Category dot */}
        <div
          className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full sm:flex"
          style={{ backgroundColor: getCategoryColor(expense.category) + "15" }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: getCategoryColor(expense.category) }}
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-slate-900">
              {expense.merchant}
            </h3>
            <span
              className={`hidden rounded-full px-2 py-0.5 text-[10px] font-medium capitalize sm:inline ${getConfidenceColor(expense.confidence)}`}
            >
              {expense.confidence}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(expense.date)}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {expense.category}
            </span>
            {expense.paymentMethod && (
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                {expense.paymentMethod}
              </span>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">
            {formatCurrency(Number(expense.total), expense.currency)}
          </p>
          {expense.items && expense.items.length > 0 && (
            <p className="text-xs text-slate-400">
              {expense.items.length} item{expense.items.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {expense.items && expense.items.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
            disabled={deleteMutation.isPending}
            className={`rounded-lg p-2 transition-colors ${confirmDelete
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}
            title={confirmDelete ? "Click again to confirm" : "Delete expense"}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded items */}
      {expanded && expense.items && expense.items.length > 0 && (
        <div className="border-t border-slate-100 px-4 py-3">
          <div className="space-y-1.5">
            {expense.items.map((item, i) => (
              <div
                key={item.id || i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-600">
                  {item.name}
                  {item.quantity !== "1" && (
                    <span className="ml-1 text-slate-400">
                      ×{item.quantity}
                    </span>
                  )}
                </span>
                <span className="font-medium text-slate-700">
                  {formatCurrency(Number(item.price), expense.currency)}
                </span>
              </div>
            ))}
          </div>
          {expense.taxAmount && Number(expense.taxAmount) > 0 && (
            <div className="mt-2 flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-sm">
              <span className="text-slate-400">Tax</span>
              <span className="text-slate-500">
                {formatCurrency(Number(expense.taxAmount), expense.currency)}
              </span>
            </div>
          )}
          {expense.notes && (
            <p className="mt-2 border-t border-dashed border-slate-200 pt-2 text-xs text-slate-400">
              {expense.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}