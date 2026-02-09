"use client";

import { useState } from "react";
import {
  Calendar,
  Tag,
  Trash2,
  CreditCard,
  Loader2,
  Eye,
  Pencil,
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
import ExpenseDetailModal from "./expense-detail-modal";
import ExpenseEditModal from "./expense-edit-modal";

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
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
    <>
      <div className="rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-sm">
        <div className="flex items-center gap-4 p-4">
          {/* Category dot */}
          <div
            className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full sm:flex"
            style={{
              backgroundColor: getCategoryColor(expense.category) + "15",
            }}
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
              {expense.items && expense.items.length > 0 && (
                <span className="text-slate-300">
                  {expense.items.length} item
                  {expense.items.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(Number(expense.total), expense.currency)}
            </p>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-0.5">
            {/* View */}
            <button
              type="button"
              onClick={() => setShowDetail(true)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() => setShowEdit(true)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600"
              title="Edit expense"
            >
              <Pencil className="h-4 w-4" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              onBlur={() => setConfirmDelete(false)}
              disabled={deleteMutation.isPending}
              className={`rounded-lg p-2 transition-colors ${confirmDelete
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "text-slate-400 hover:bg-slate-100 hover:text-red-600"
                }`}
              title={confirmDelete ? "Click again to confirm" : "Delete"}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetail && (
        <ExpenseDetailModal
          expense={expense}
          onClose={() => setShowDetail(false)}
        />
      )}
      {showEdit && (
        <ExpenseEditModal
          expense={expense}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}