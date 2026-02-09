"use client";

import { useEffect } from "react";
import {
  X,
  Store,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  ShieldCheck,
  ShoppingCart,
  FileText,
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
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: getCategoryColor(expense.category) + "15",
              }}
            >
              <Store
                className="h-5 w-5"
                style={{ color: getCategoryColor(expense.category) }}
              />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                {expense.merchant}
              </h2>
              <span className="text-xs text-slate-400">
                {formatDate(expense.date)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5">
          {/* Total */}
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-400">Total Amount</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {formatCurrency(Number(expense.total), expense.currency)}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${getConfidenceColor(expense.confidence)}`}
            >
              {expense.confidence} confidence
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailItem
              icon={<Calendar className="h-4 w-4" />}
              label="Date"
              value={formatDate(expense.date)}
            />
            <DetailItem
              icon={<Clock className="h-4 w-4" />}
              label="Time"
              value={expense.time || "—"}
            />
            <DetailItem
              icon={<Tag className="h-4 w-4" />}
              label="Category"
              value={expense.category}
              color={getCategoryColor(expense.category)}
            />
            <DetailItem
              icon={<CreditCard className="h-4 w-4" />}
              label="Payment"
              value={expense.paymentMethod || "—"}
            />
            <DetailItem
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Currency"
              value={expense.currency}
            />
            {expense.taxAmount && Number(expense.taxAmount) > 0 && (
              <DetailItem
                icon={<FileText className="h-4 w-4" />}
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
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Items ({expense.items.length})
                </span>
              </div>
              <div className="rounded-xl border border-slate-200">
                {expense.items.map((item, i) => (
                  <div
                    key={item.id || i}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm ${i !== expense.items.length - 1
                      ? "border-b border-slate-100"
                      : ""
                      }`}
                  >
                    <span className="text-slate-600">
                      {item.name}
                      {item.quantity !== "1" && (
                        <span className="ml-1 text-slate-400">
                          ×{item.quantity}
                        </span>
                      )}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(Number(item.price), expense.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {expense.notes && (
            <div>
              <p className="mb-1 text-xs font-medium text-slate-400">Notes</p>
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                {expense.notes}
              </p>
            </div>
          )}

          {/* Receipt image */}
          {expense.imageUrl && (
            <div>
              <p className="mb-1 text-xs font-medium text-slate-400">
                Receipt Image
              </p>
              <Image
                width={500}
                height={500}
                src={expense.imageUrl}
                alt="Receipt"
                className="w-full rounded-xl border border-slate-200 object-contain"
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
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-900" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}