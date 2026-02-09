import { z } from "zod";
import { EXPENSE_CATEGORIES } from "@/types/expense";

export const expenseItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.string().default("1"),
  price: z.coerce.number().min(0, "Price must be positive"),
});

export const expenseSchema = z.object({
  merchant: z.string().min(1, "Merchant name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().nullable().optional(),
  total: z.coerce.number().min(0, "Total must be positive"),
  currency: z.string().default("NGN"),
  category: z.enum(EXPENSE_CATEGORIES as [string, ...string[]]),
  paymentMethod: z.string().nullable().optional(),
  taxAmount: z.coerce.number().nullable().optional(),
  confidence: z.enum(["high", "medium", "low"]).default("medium"),
  imageUrl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  items: z.array(expenseItemSchema).default([]),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
