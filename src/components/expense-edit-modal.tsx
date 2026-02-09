"use client";

import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Expense, EXPENSE_CATEGORIES, ExpenseItem } from "@/types/expense";
import { useUpdateExpense } from "@/hooks/useExpenses";

interface ExpenseEditModalProps {
  expense: Expense;
  onClose: () => void;
}

export default function ExpenseEditModal({
  expense,
  onClose,
}: ExpenseEditModalProps) {
  const updateMutation = useUpdateExpense();

  const [form, setForm] = useState({
    merchant: expense.merchant,
    date: expense.date.split("T")[0],
    time: expense.time || "",
    total: Number(expense.total),
    currency: expense.currency,
    category: expense.category,
    paymentMethod: expense.paymentMethod || "",
    taxAmount: expense.taxAmount ? Number(expense.taxAmount) : 0,
    notes: expense.notes || "",
    items: expense.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price),
    })),
  });

  const updateField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: keyof ExpenseItem, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: "1", price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!form.merchant || !form.date || form.total <= 0) {
      toast.error("Merchant, date, and total are required");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: expense.id,
        data: {
          ...form,
          taxAmount: form.taxAmount || null,
          paymentMethod: form.paymentMethod || null,
          notes: form.notes || null,
          time: form.time || null,
        },
      });
      toast.success("Expense updated");
      onClose();
    } catch {
      toast.error("Failed to update expense");
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Edit Expense
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 p-5">
          {/* Merchant */}
          <FormField label="Merchant">
            <input
              type="text"
              value={form.merchant}
              onChange={(e) => updateField("merchant", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </FormField>

          {/* Category */}
          <FormField label="Category">
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date">
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </FormField>
            <FormField label="Time">
              <input
                type="time"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Total">
              <input
                type="number"
                value={form.total}
                onChange={(e) =>
                  updateField("total", parseFloat(e.target.value) || 0)
                }
                step="0.01"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </FormField>
            <FormField label="Currency">
              <input
                type="text"
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </FormField>
            <FormField label="Tax">
              <input
                type="number"
                value={form.taxAmount}
                onChange={(e) =>
                  updateField("taxAmount", parseFloat(e.target.value) || 0)
                }
                step="0.01"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </FormField>
          </div>

          <FormField label="Payment Method">
            <input
              type="text"
              value={form.paymentMethod}
              onChange={(e) => updateField("paymentMethod", e.target.value)}
              placeholder="Cash, Card, Transfer, POS..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:border-blue-500 focus:outline-none"
            />
          </FormField>

          {/* Items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-500">
                Items ({form.items.length})
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-3 w-3" />
                Add Item
              </button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 p-2"
                >
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="Item name"
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    className="w-12 bg-transparent text-center text-sm text-slate-500 focus:outline-none"
                    placeholder="Qty"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    step="0.01"
                    className="w-20 bg-transparent text-right text-sm font-medium text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <FormField label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Add any notes..."
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:border-blue-500 focus:outline-none"
            />
          </FormField>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 border-t border-slate-100 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}