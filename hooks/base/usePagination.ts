'use client';

import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/config';
import type { PaginationState } from '@/types';

export function usePagination<T>(
  items: T[],
  initialPageSize: number = DEFAULT_PAGE_SIZE
) {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize,
    total: items.length,
  });

  // Update total when items change
  const paginationState = useMemo(
    () => ({
      ...pagination,
      total: items.length,
    }),
    [pagination, items.length]
  );

  // Get paginated items
  const paginatedItems = useMemo(() => {
    const start = (paginationState.page - 1) * paginationState.pageSize;
    const end = start + paginationState.pageSize;
    return items.slice(start, end);
  }, [items, paginationState.page, paginationState.pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(paginationState.total / paginationState.pageSize);

  // Go to page
  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(page, totalPages)),
    }));
  }, [totalPages]);

  // Next page
  const nextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, totalPages),
    }));
  }, [totalPages]);

  // Previous page
  const previousPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  // Change page size
  const setPageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      page: 1, // Reset to first page
    }));
  }, []);

  // Reset pagination
  const reset = useCallback(() => {
    setPagination({
      page: 1,
      pageSize: initialPageSize,
      total: items.length,
    });
  }, [initialPageSize, items.length]);

  return {
    items: paginatedItems,
    pagination: paginationState,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    reset,
    hasNextPage: paginationState.page < totalPages,
    hasPreviousPage: paginationState.page > 1,
  };
}
