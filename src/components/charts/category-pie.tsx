"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getCategoryColor, formatCurrency } from "@/lib/utils";

interface CategoryPieProps {
  data: { category: string; total: number }[];
  currency?: string;
}

export default function CategoryPie({ data, currency = "NGN" }: CategoryPieProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-300">No data yet</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="h-48 w-48 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="total"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={getCategoryColor(entry.category)}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const percent = ((item.total / total) * 100).toFixed(1);
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                      <p className="font-medium text-slate-900">
                        {item.category}
                      </p>
                      <p className="text-slate-500">
                        {formatCurrency(item.total, currency)} ({percent}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {data.map((item) => {
          const percent = ((item.total / total) * 100).toFixed(1);
          return (
            <div key={item.category} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: getCategoryColor(item.category) }}
                />
                <span className="text-xs text-slate-600">{item.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-900">
                  {formatCurrency(item.total, currency)}
                </span>
                <span className="text-[10px] text-slate-400">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}