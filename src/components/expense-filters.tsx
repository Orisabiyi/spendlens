"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import { ExpenseFilters } from "@/types/expense";

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || "")) {
        onFiltersChange({ ...filters, search: searchInput || undefined, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const hasActiveFilters =
    filters.category || filters.startDate || filters.endDate;

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({ page: 1, limit: 10 });
  };

  return (
    <div className="space-y-3">
      {/* Search + Filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by merchant..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${hasActiveFilters
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
              {[filters.category, filters.startDate || filters.endDate].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Category */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Category
              </label>
              <select
                value={filters.category || "all"}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    category:
                      e.target.value === "all" ? undefined : (e.target.value as ExpenseFilters["category"]),
                    page: 1,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
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
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
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
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
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