import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/get-session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const expense = await prisma.expense.findFirst({
      where: { id, userId },
      include: { items: true },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Fetch expense error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.expense.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Delete existing items
    await prisma.expenseItem.deleteMany({ where: { expenseId: id } });

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        merchant: body.merchant,
        date: new Date(body.date),
        time: body.time || null,
        total: body.total,
        currency: body.currency || "NGN",
        category: body.category || "Other",
        paymentMethod: body.paymentMethod || null,
        taxAmount: body.taxAmount || null,
        confidence: body.confidence || "medium",
        notes: body.notes || null,
        items: {
          create: (body.items || []).map(
            (item: { name: string; quantity: string | number; price: number }) => ({
              name: item.name,
              quantity: String(item.quantity || "1"),
              price: item.price,
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Update expense error:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.expense.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    await prisma.expense.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete expense error:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}