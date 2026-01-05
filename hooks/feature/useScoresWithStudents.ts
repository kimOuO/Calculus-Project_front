'use client';

import { useAsyncEffect } from '@/hooks/base';
import { getScoresWithStudentInfo } from '@/services/workflows';
import type { ScoreWithStudent } from '@/types';

// Hook for fetching all scores with student information
export function useScoresWithStudents(semester?: string) {
  const { data, status, error, refetch } = useAsyncEffect<ScoreWithStudent[]>(
    () => getScoresWithStudentInfo(semester),
    [semester]
  );

  return {
    scores: data || [],
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
