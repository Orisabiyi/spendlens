export interface ExpenseItem {
  id?: string;
  name: string;
  quantity: string;
  price: number;
}

export interface Expense {
  id: string;
  merchant: string;
  date: string;
  time: string | null;
  total: number;
  currency: string;
  category: ExpenseCategory;
  paymentMethod: string | null;
  taxAmount: number | null;
  confidence: "high" | "medium" | "low";
  imageUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: ExpenseItem[];
}

export type ExpenseCategory =
  | "Food & Dining"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Healthcare"
  | "Utilities"
  | "Groceries"
  | "Other";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Groceries",
  "Other",
];

export interface ScanResult {
  merchant: string;
  date: string;
  time: string | null;
  total: number;
  currency: string;
  category: ExpenseCategory;
  paymentMethod: string | null;
  taxAmount: number | null;
  confidence: "high" | "medium" | "low";
  items: ExpenseItem[];
  notes: string | null;
}

export interface AnalyticsSummary {
  totalSpent: number;
  receiptCount: number;
  averageExpense: number;
  biggestExpense: number;
  categoryBreakdown: { category: string; total: number }[];
  dailyTrend: { date: string; total: number }[];
  topMerchants: { merchant: string; total: number; count: number }[];
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory;
  merchant?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
}
