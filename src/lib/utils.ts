import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case "high":
      return "text-green-600 bg-green-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "low":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Food & Dining": "#f97316",
    Transportation: "#3b82f6",
    Shopping: "#8b5cf6",
    Entertainment: "#ec4899",
    Healthcare: "#ef4444",
    Utilities: "#6b7280",
    Groceries: "#22c55e",
    Other: "#94a3b8",
  };
  return colors[category] || colors.Other;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
