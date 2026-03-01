'use client';

import { useAsyncEffect } from '@/hooks/base';
import { getTestSemesters } from '@/services/api/testApi';

/**
 * Hook for fetching available semesters from test data
 * Returns semesters sorted in descending order (most recent first)
 * Used for test management filtering
 */
export function useTestSemesters() {
  const { data, status, error, refetch } = useAsyncEffect<string[]>(
    getTestSemesters,
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