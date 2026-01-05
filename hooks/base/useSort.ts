'use client';

import { useState, useCallback, useMemo } from 'react';
import type { SortConfig } from '@/types';

export function useSort<T, K extends keyof T>(
  items: T[],
  initialSort?: SortConfig<K>
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<K> | null>(
    initialSort || null
  );

  // Sort items
  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    const sorted = [...items].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortConfig]);

  // Toggle sort
  const toggleSort = useCallback((field: K) => {
    setSortConfig((prev) => {
      if (!prev || prev.field !== field) {
        return { field, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { field, direction: 'desc' };
      }
      return null; // Clear sort
    });
  }, []);

  // Set sort
  const setSort = useCallback((field: K, direction: 'asc' | 'desc') => {
    setSortConfig({ field, direction });
  }, []);

  // Clear sort
  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  return {
    items: sortedItems,
    sortConfig,
    toggleSort,
    setSort,
    clearSort,
    isSorted: sortConfig !== null,
  };
}
