"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ExpenseFilters, EXPENSE_CATEGORIES } from "@/types/expense";

interface ExpenseFiltersBarProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  totalResults: number;
}

export default function ExpenseFiltersBar({
  filters,
  onFiltersChange,
  totalResults,
}: ExpenseFiltersBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filters.category,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || "")) {
        onFiltersChange({
          ...filters,
          search: searchInput || undefined,
          page: 1,
        });
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({ page: 1, limit: 10 });
    setShowFilters(false);
  };

  return (
    <div className="space-y-3">
      {/* Search + Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search expenses..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none sm:h-10"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors sm:px-4 ${activeFilterCount > 0
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Category */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Category
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    category:
                      e.target.value === "all" ? undefined : (e.target.value as ExpenseFilters["category"]),
                    page: 1,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                From
              </label>
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    startDate: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                To
              </label>
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    endDate: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-xs font-medium text-red-500 hover:text-red-600"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-slate-400">
        {totalResults} expense{totalResults !== 1 ? "s" : ""} found
      </p>
    </div>
  );
}