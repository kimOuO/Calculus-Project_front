'use client';

import { useState, useCallback, useMemo } from 'react';

export function useFilter<T>(
  items: T[],
  filterFn: (item: T, filters: Record<string, unknown>) => boolean
) {
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // Filter items
  const filteredItems = useMemo(() => {
    if (Object.keys(filters).length === 0) return items;
    return items.filter((item) => filterFn(item, filters));
  }, [items, filters, filterFn]);

  // Set filter
  const setFilter = useCallback((key: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Remove filter
  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    items: filteredItems,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    isFiltered: Object.keys(filters).length > 0,
  };
}
