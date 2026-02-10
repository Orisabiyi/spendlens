import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";
    const currency = searchParams.get("currency") || null;

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "all":
        startDate = new Date(2000, 0, 1);
        break;
      case "month":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Fetch all expenses in range
    const expenses = await prisma.expense.findMany({
      where: {
        date: { gte: startDate },
        ...(currency ? { currency } : {}),
      },
      include: { items: true },
      orderBy: { date: "asc" },
    });

    // Get all unique currencies across ALL expenses (not just filtered)
    const allExpenses = await prisma.expense.findMany({
      where: { date: { gte: startDate } },
      select: { currency: true },
    });
    const currencies = [...new Set(allExpenses.map((e) => e.currency))].sort();

    // If no currency filter and multiple currencies exist, use the most common one
    const activeCurrency =
      currency ||
      (currencies.length > 0
        ? (() => {
          const counts = new Map<string, number>();
          allExpenses.forEach((e) => {
            counts.set(e.currency, (counts.get(e.currency) || 0) + 1);
          });
          return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
        })()
        : "NGN");

    // Filter to active currency for aggregations
    const filtered = expenses.filter((e) => e.currency === activeCurrency);

    // Summary calculations
    const totals = filtered.map((e) => Number(e.total));
    const totalSpent = totals.reduce((sum, t) => sum + t, 0);
    const receiptCount = filtered.length;
    const averageExpense = receiptCount > 0 ? totalSpent / receiptCount : 0;
    const biggestExpense = totals.length > 0 ? Math.max(...totals) : 0;

    // Currency breakdown (all currencies, not just active)
    const currencyTotals = new Map<string, { total: number; count: number }>();
    expenses.forEach((e) => {
      const current = currencyTotals.get(e.currency) || {
        total: 0,
        count: 0,
      };
      currencyTotals.set(e.currency, {
        total: current.total + Number(e.total),
        count: current.count + 1,
      });
    });
    const currencyBreakdown = Array.from(currencyTotals.entries())
      .map(([cur, data]) => ({
        currency: cur,
        total: Math.round(data.total * 100) / 100,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count);

    // Category breakdown (active currency only)
    const categoryMap = new Map<string, number>();
    filtered.forEach((e) => {
      const current = categoryMap.get(e.category) || 0;
      categoryMap.set(e.category, current + Number(e.total));
    });
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, total]) => ({
        category,
        total: Math.round(total * 100) / 100,
      }))
      .sort((a, b) => b.total - a.total);

    // Daily spending trend (active currency only)
    const dailyMap = new Map<string, number>();
    filtered.forEach((e) => {
      const day = e.date.toISOString().split("T")[0];
      const current = dailyMap.get(day) || 0;
      dailyMap.set(day, current + Number(e.total));
    });
    const dailyTrend = Array.from(dailyMap.entries())
      .map(([date, total]) => ({
        date,
        total: Math.round(total * 100) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top merchants (active currency only)
    const merchantMap = new Map<string, { total: number; count: number }>();
    filtered.forEach((e) => {
      const current = merchantMap.get(e.merchant) || { total: 0, count: 0 };
      merchantMap.set(e.merchant, {
        total: current.total + Number(e.total),
        count: current.count + 1,
      });
    });
    const topMerchants = Array.from(merchantMap.entries())
      .map(([merchant, data]) => ({
        merchant,
        total: Math.round(data.total * 100) / 100,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);

    // Recent expenses (all currencies)
    const recentExpenses = expenses
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        merchant: e.merchant,
        total: Number(e.total),
        currency: e.currency,
        category: e.category,
        date: e.date.toISOString(),
      }));

    return NextResponse.json({
      summary: {
        totalSpent: Math.round(totalSpent * 100) / 100,
        receiptCount,
        averageExpense: Math.round(averageExpense * 100) / 100,
        biggestExpense: Math.round(biggestExpense * 100) / 100,
      },
      currencies,
      activeCurrency,
      currencyBreakdown,
      categoryBreakdown,
      dailyTrend,
      topMerchants,
      recentExpenses,
      period,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}