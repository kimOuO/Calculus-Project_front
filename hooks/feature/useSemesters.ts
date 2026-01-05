'use client';

import { useAsyncEffect } from '@/hooks/base';
import { getSemesters } from '@/services';

/**
 * Hook for fetching available semesters
 * Returns semesters sorted in descending order (most recent first)
 */
export function useSemesters() {
  const { data, status, error, refetch } = useAsyncEffect<string[]>(
    getSemesters,
    []
  );

  return {
    semesters: data || [],
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
