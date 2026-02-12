"use client";

import { useEffect } from "react";
import {
  X,
  Store,
  Calendar,
  Clock,
  Tag,
  CreditCard,
  ShoppingCart,
  FileText,
  Coins,
} from "lucide-react";
import { Expense } from "@/types/expense";
import {
  formatCurrency,
  formatDate,
  getConfidenceColor,
  getCategoryColor,
} from "@/lib/utils";
import Image from "next/image";

interface ExpenseDetailModalProps {
  expense: Expense;
  onClose: () => void;
}

export default function ExpenseDetailModal({
  expense,
  onClose,
}: ExpenseDetailModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: getCategoryColor(expense.category) + "15",
              }}
            >
              <Store
                className="h-4 w-4"
                style={{ color: getCategoryColor(expense.category) }}
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {expense.merchant}
              </h2>
              <span
                className={`text-[10px] font-medium capitalize ${getConfidenceColor(expense.confidence)}`}
              >
                {expense.confidence} confidence
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {/* Total */}
          <div className="mb-5 rounded-xl bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-400">Total Amount</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {formatCurrency(Number(expense.total), expense.currency)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4">
            <DetailItem
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Date"
              value={formatDate(expense.date)}
            />
            <DetailItem
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Time"
              value={expense.time || "—"}
            />
            <DetailItem
              icon={<Tag className="h-3.5 w-3.5" />}
              label="Category"
              value={expense.category}
            />
            <DetailItem
              icon={<CreditCard className="h-3.5 w-3.5" />}
              label="Payment"
              value={expense.paymentMethod || "—"}
            />
            <DetailItem
              icon={<Coins className="h-3.5 w-3.5" />}
              label="Currency"
              value={expense.currency}
            />
            {expense.taxAmount && (
              <DetailItem
                icon={<FileText className="h-3.5 w-3.5" />}
                label="Tax"
                value={formatCurrency(
                  Number(expense.taxAmount),
                  expense.currency
                )}
              />
            )}
          </div>

          {/* Items */}
          {expense.items && expense.items.length > 0 && (
            <div className="mb-5">
              <div className="mb-2.5 flex items-center gap-1.5 text-slate-400">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Items ({expense.items.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {expense.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-700">{item.name}</span>
                      <span className="ml-2 text-xs text-slate-400">
                        ×{item.quantity}
                      </span>
                    </div>
                    <span className="flex-shrink-0 font-medium text-slate-900">
                      {formatCurrency(
                        Number(item.price),
                        expense.currency
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {expense.notes && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Notes
              </span>
              <p className="mt-1 text-sm text-slate-600">{expense.notes}</p>
            </div>
          )}

          {/* Receipt image */}
          {expense.imageUrl && (
            <div className="mt-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Receipt
              </span>
              <Image
                width={500}
                height={500}
                src={expense.imageUrl}
                alt="Receipt"
                className="mt-2 w-full rounded-xl border border-slate-200"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
      <div className="mb-0.5 flex items-center gap-1 text-slate-400">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}