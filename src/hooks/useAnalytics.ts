"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchAnalytics(period: string, currency: string | null) {
  const params = new URLSearchParams({ period });
  if (currency) params.set("currency", currency);
  const res = await fetch(`/api/analytics?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export function useAnalytics(period: string, currency: string | null = null) {
  return useQuery({
    queryKey: ["analytics", period, currency],
    queryFn: () => fetchAnalytics(period, currency),
  });
}