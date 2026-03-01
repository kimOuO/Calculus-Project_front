'use client';

import { useAsyncEffect } from '@/hooks/base';
import { getStudentSemesters } from '@/services/api/studentApi';

/**
 * Hook for fetching available semesters from student data
 * Returns semesters sorted in descending order (most recent first)
 * Used for student and score related filtering
 */
export function useStudentSemesters() {
  const { data, status, error, refetch } = useAsyncEffect<string[]>(
    getStudentSemesters,
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