"use client";

import { useState } from "react";
import {
  Calendar,
  Tag,
  Trash2,
  CreditCard,
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
import DeleteConfirmModal from "./delete-confirm-modal";

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const deleteMutation = useDeleteExpense();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(expense.id);
      setShowDelete(false);
      toast.success("Expense deleted");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-sm">
        {/* Mobile layout */}
        <div className="flex flex-col gap-3 p-3 sm:hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: getCategoryColor(expense.category) + "15",
                }}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: getCategoryColor(expense.category),
                  }}
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {expense.merchant}
                </h3>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{formatDate(expense.date)}</span>
                  <span>•</span>
                  <span>{expense.category}</span>
                </div>
              </div>
            </div>
            <p className="flex-shrink-0 text-base font-bold text-slate-900">
              {formatCurrency(Number(expense.total), expense.currency)}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${getConfidenceColor(expense.confidence)}`}
              >
                {expense.confidence}
              </span>
              {expense.paymentMethod && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <CreditCard className="h-3 w-3" />
                  {expense.paymentMethod}
                </span>
              )}
              {expense.items && expense.items.length > 0 && (
                <span className="text-[11px] text-slate-300">
                  {expense.items.length} item
                  {expense.items.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setShowDetail(true)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowEdit(true)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden items-center gap-4 p-4 sm:flex">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: getCategoryColor(expense.category) + "15",
            }}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getCategoryColor(expense.category) }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-slate-900">
                {expense.merchant}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${getConfidenceColor(expense.confidence)}`}
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

          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(Number(expense.total), expense.currency)}
            </p>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setShowDetail(true)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowEdit(true)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600"
              title="Edit expense"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600"
              title="Delete expense"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

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
      {showDelete && (
        <DeleteConfirmModal
          merchantName={expense.merchant}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}