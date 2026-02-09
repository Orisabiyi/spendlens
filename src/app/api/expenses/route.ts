import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/expenses - List expenses with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { merchant: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate)
        (where.date as Record<string, unknown>).gte = new Date(startDate);
      if (endDate)
        (where.date as Record<string, unknown>).lte = new Date(endDate);
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: { items: true },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const expense = await prisma.expense.create({
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
        imageUrl: body.imageUrl || null,
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

    return NextResponse.json({ success: true, expense }, { status: 201 });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json(
      { error: "Failed to save expense" },
      { status: 500 }
    );
  }
}