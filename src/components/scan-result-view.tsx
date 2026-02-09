"use client";

import { useState } from "react";
import {
  Store,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  ShieldCheck,
  ShoppingCart,
  Loader2,
  Save,
  RotateCcw,
  ChevronDown,
  Pencil,
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
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!data.merchant || !data.date || data.total <= 0) {
      toast.error("Please fill in merchant, date, and total");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save");
      }

      onSaved();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save expense"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with confidence badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Scan Results</h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getConfidenceColor(data.confidence)}`}
        >
          {data.confidence} confidence
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        {/* Main details */}
        <div className="space-y-4">
          {/* Merchant & Category */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="space-y-3">
              <EditableField
                icon={<Store className="h-4 w-4 text-slate-400" />}
                label="Merchant"
                value={data.merchant}
                editing={editingField === "merchant"}
                onEdit={() => setEditingField("merchant")}
                onSave={(val) => {
                  updateField("merchant", val);
                  setEditingField(null);
                }}
                onCancel={() => setEditingField(null)}
              />

              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <label className="text-xs text-slate-400">Category</label>
                  <div className="relative">
                    <select
                      value={data.category}
                      onChange={(e) =>
                        updateField("category", e.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div
                  className="mt-4 h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: getCategoryColor(data.category),
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <EditableField
                  icon={<Calendar className="h-4 w-4 text-slate-400" />}
                  label="Date"
                  value={data.date}
                  type="date"
                  editing={editingField === "date"}
                  onEdit={() => setEditingField("date")}
                  onSave={(val) => {
                    updateField("date", val);
                    setEditingField(null);
                  }}
                  onCancel={() => setEditingField(null)}
                />
                <EditableField
                  icon={<Clock className="h-4 w-4 text-slate-400" />}
                  label="Time"
                  value={data.time || "N/A"}
                  type="time"
                  editing={editingField === "time"}
                  onEdit={() => setEditingField("time")}
                  onSave={(val) => {
                    updateField("time", val);
                    setEditingField(null);
                  }}
                  onCancel={() => setEditingField(null)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <EditableField
                  icon={<CreditCard className="h-4 w-4 text-slate-400" />}
                  label="Payment"
                  value={data.paymentMethod || "N/A"}
                  editing={editingField === "payment"}
                  onEdit={() => setEditingField("payment")}
                  onSave={(val) => {
                    updateField("paymentMethod", val);
                    setEditingField(null);
                  }}
                  onCancel={() => setEditingField(null)}
                />
                <EditableField
                  icon={<ShieldCheck className="h-4 w-4 text-slate-400" />}
                  label="Currency"
                  value={data.currency}
                  editing={editingField === "currency"}
                  onEdit={() => setEditingField("currency")}
                  onSave={(val) => {
                    updateField("currency", val);
                    setEditingField(null);
                  }}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          {data.items.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Items ({data.items.length})
                </span>
              </div>
              <div className="space-y-2">
                {data.items.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                  >
                    <div className="flex-1">
                      <input
                        value={item.name}
                        onChange={(e) =>
                          updateItem(index, "name", e.target.value)
                        }
                        className="w-full bg-transparent text-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">×{item.quantity}</span>
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
                        className="w-20 bg-transparent text-right font-medium text-slate-900 focus:outline-none"
                        step="0.01"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-slate-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total + Tax */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="space-y-2">
              {data.taxAmount != null && data.taxAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Tax</span>
                  <span>{formatCurrency(data.taxAmount, data.currency)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Total
                </span>
                <input
                  type="number"
                  value={data.total}
                  onChange={(e) =>
                    updateField("total", parseFloat(e.target.value) || 0)
                  }
                  className="w-40 bg-transparent text-right text-xl font-bold text-slate-900 focus:outline-none"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <label className="mb-1.5 block text-xs text-slate-400">
              Notes
            </label>
            <textarea
              value={data.notes || ""}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Add any notes..."
              rows={2}
              className="w-full resize-none bg-transparent text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Receipt preview sidebar */}
        {imagePreview && (
          <div className="hidden md:block">
            <div className="sticky top-20 overflow-hidden rounded-xl border border-slate-200">
              <Image
                width={500}
                height={500}
                src={imagePreview}
                alt="Receipt"
                className="w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Scan Another
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
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

/* Editable field sub-component */
function EditableField({
  icon,
  label,
  value,
  type = "text",
  editing,
  onEdit,
  onSave,
  onCancel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  type?: string;
  editing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
}) {
  const [tempValue, setTempValue] = useState(value);

  if (editing) {
    return (
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex-1">
          <label className="text-xs text-slate-400">{label}</label>
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
            className="w-full rounded border border-blue-300 bg-blue-50 px-2 py-1 text-sm text-slate-900 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="group flex cursor-pointer items-center gap-3"
      onClick={onEdit}
    >
      {icon}
      <div className="flex-1">
        <label className="text-xs text-slate-400">{label}</label>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
      <Pencil className="h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}