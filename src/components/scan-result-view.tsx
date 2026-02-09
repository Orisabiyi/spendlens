"use client";

import { useState } from "react";
import {
  Store,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  Coins,
  ShoppingCart,
  Loader2,
  Save,
  RotateCcw,
  ChevronDown,
  Pencil,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  formatCurrency,
  getConfidenceColor,
  getCategoryColor,
} from "@/lib/utils";
import {
  ScanResult,
  ExpenseItem,
  EXPENSE_CATEGORIES,
} from "@/types/expense";
import { useCreateExpense } from "@/hooks/useExpenses";
import Image from "next/image";

interface ScanResultViewProps {
  result: ScanResult;
  imagePreview: string | null;
  onClear: () => void;
  onSaved: () => void;
}

export default function ScanResultView({
  result,
  imagePreview,
  onClear,
  onSaved,
}: ScanResultViewProps) {
  const [data, setData] = useState<ScanResult>(result);
  const [editingField, setEditingField] = useState<string | null>(null);
  const createMutation = useCreateExpense();

  const updateField = (field: keyof ScanResult, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (
    index: number,
    field: keyof ExpenseItem,
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: "1", price: 0 }],
    }));
  };

  const handleSave = async () => {
    if (!data.merchant || !data.date || data.total <= 0) {
      toast.error("Please fill in merchant, date, and total");
      return;
    }

    try {
      await createMutation.mutateAsync(data);
      onSaved();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save expense"
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        {/* Main content */}
        <div className="space-y-4">
          {/* Top card: Merchant + Total + Confidence */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: getCategoryColor(data.category) + "15",
                  }}
                >
                  <Store
                    className="h-5 w-5"
                    style={{ color: getCategoryColor(data.category) }}
                  />
                </div>
                <div>
                  <EditableField
                    value={data.merchant}
                    editing={editingField === "merchant"}
                    onEdit={() => setEditingField("merchant")}
                    onSave={(val) => {
                      updateField("merchant", val);
                      setEditingField(null);
                    }}
                    onCancel={() => setEditingField(null)}
                    className="text-lg font-semibold text-slate-900"
                  />
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${getConfidenceColor(data.confidence)}`}
                    >
                      {data.confidence} confidence
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total</p>
                <input
                  type="number"
                  value={data.total}
                  onChange={(e) =>
                    updateField("total", parseFloat(e.target.value) || 0)
                  }
                  className="w-36 bg-transparent text-right text-2xl font-bold text-slate-900 focus:outline-none"
                  step="0.01"
                />
                <p className="text-xs text-slate-400">{data.currency}</p>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Details
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailField
                icon={<Tag className="h-4 w-4" />}
                label="Category"
              >
                <div className="relative">
                  <select
                    value={data.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>
              </DetailField>

              <DetailField
                icon={<Calendar className="h-4 w-4" />}
                label="Date"
              >
                <EditableField
                  value={data.date}
                  type="date"
                  editing={editingField === "date"}
                  onEdit={() => setEditingField("date")}
                  onSave={(val) => {
                    updateField("date", val);
                    setEditingField(null);
                  }}
                  onCancel={() => setEditingField(null)}
                  className="text-sm font-medium text-slate-900"
                />
              </DetailField>

              <DetailField
                icon={<Clock className="h-4 w-4" />}
                label="Time"
              >
                <EditableField
                  value={data.time || "—"}
                  type="time"
                  editing={editingField === "time"}
                  onEdit={() => setEditingField("time")}
                  onSave={(val) => {
                    updateField("time", val);
                    setEditingField(null);
                  }}
                  onCancel={() => setEditingField(null)}
                  className="text-sm font-medium text-slate-900"
                />
              </DetailField>

              <DetailField
                icon={<CreditCard className="h-4 w-4" />}
                label="Payment"
              >
                <EditableField
                  value={data.paymentMethod || "—"}
                  editing={editingField === "payment"}
                  onEdit={() => setEditingField("payment")}
                  onSave={(val) => {
                    updateField("paymentMethod", val);
                    setEditingField(null);
                  }}
                  onCancel={() => setEditingField(null)}
                  className="text-sm font-medium text-slate-900"
                />
              </DetailField>

              <DetailField
                icon={<Coins className="h-4 w-4" />}
                label="Currency"
              >
                <EditableField
                  value={data.currency}
                  editing={editingField === "currency"}
                  onEdit={() => setEditingField("currency")}
                  onSave={(val) => {
                    updateField("currency", val);
                    setEditingField(null);
                  }}
                  onCancel={() => setEditingField(null)}
                  className="text-sm font-medium text-slate-900"
                />
              </DetailField>

              {data.taxAmount != null && data.taxAmount > 0 && (
                <DetailField
                  icon={<FileText className="h-4 w-4" />}
                  label="Tax"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {formatCurrency(data.taxAmount, data.currency)}
                  </p>
                </DetailField>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Items ({data.items.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>

            {data.items.length > 0 ? (
              <div className="space-y-1">
                {data.items.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-400">
                      {index + 1}
                    </span>
                    <input
                      value={item.name}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                      placeholder="Item name"
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
                    />
                    <span className="text-xs text-slate-300">
                      ×{item.quantity}
                    </span>
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
                      className="w-20 bg-transparent text-right text-sm font-semibold text-slate-900 focus:outline-none"
                      step="0.01"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-slate-300 hover:text-red-500" />
                    </button>
                  </div>
                ))}

                {/* Items total line */}
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-slate-200 px-3 pt-3">
                  <span className="text-xs text-slate-400">Items Total</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {formatCurrency(
                      data.items.reduce((sum, item) => sum + (item.price || 0), 0),
                      data.currency
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-slate-300">
                No items extracted
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notes
            </h3>
            <textarea
              value={data.notes || ""}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Add any notes about this expense..."
              rows={2}
              className="w-full resize-none bg-transparent text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Receipt preview sidebar */}
        {imagePreview && (
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Receipt
              </h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <Image
                  width={500}
                  height={500}
                  src={imagePreview}
                  alt="Receipt"
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="sticky bottom-4 flex gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Scan Another
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={createMutation.isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Expense
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function DetailField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function EditableField({
  value,
  type = "text",
  editing,
  onEdit,
  onSave,
  onCancel,
  className = "",
}: {
  value: string;
  type?: string;
  editing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  className?: string;
}) {
  const [tempValue, setTempValue] = useState(value);

  if (editing) {
    return (
      <input
        type={type}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(tempValue);
          if (e.key === "Escape") onCancel();
        }}
        onBlur={() => onSave(tempValue)}
        autoFocus
        className="w-full rounded-md border border-blue-300 bg-blue-50 px-2 py-0.5 text-sm text-slate-900 focus:outline-none"
      />
    );
  }

  return (
    <div
      className={`group inline-flex cursor-pointer items-center gap-1 ${className}`}
      onClick={onEdit}
    >
      <span>{value}</span>
      <Pencil className="h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}