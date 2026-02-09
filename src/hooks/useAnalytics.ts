"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchAnalytics(period: string) {
  const res = await fetch(`/api/analytics?period=${period}`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export function useAnalytics(period: string) {
  return useQuery({
    queryKey: ["analytics", period],
    queryFn: () => fetchAnalytics(period),
  });
}