"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface MerchantBarProps {
  data: { merchant: string; total: number; count: number }[];
  currency?: string;
}

export default function MerchantBar({ data, currency = "NGN" }: MerchantBarProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-300">No data yet</p>
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    shortName:
      d.merchant.length > 12 ? d.merchant.slice(0, 12) + "…" : d.merchant,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={formatted}
        layout="vertical"
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          tick={{ fontSize: 10, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          width={85}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const item = payload[0].payload;
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-medium text-slate-900">{item.merchant}</p>
                  <p className="text-slate-500">
                    {formatCurrency(item.total, currency)} • {item.count} receipt
                    {item.count > 1 ? "s" : ""}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="total"
          fill="#3b82f6"
          radius={[0, 6, 6, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}