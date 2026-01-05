'use client';

import { useCallback } from 'react';
import { useAsyncEffect, useAsync } from '@/hooks/base';
import { getScoreByStudentNumber } from '@/services/workflows';
import { upsertScore } from '@/services/api';
import type { Score, UpsertScoreRequest } from '@/types';

// Hook for fetching a single student's scores by student number
export function useStudentScores(studentNumber: string) {
  const { data, status, error, refetch } = useAsyncEffect<Score>(
    () => getScoreByStudentNumber(studentNumber),
    [studentNumber]
  );

  return {
    score: data || null,
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for updating a student's individual score
export function useUpdateStudentScore(onSuccess?: () => void) {
  const { execute, status, error } = useAsync<Score, [UpsertScoreRequest]>(
    upsertScore
  );

  const updateScore = useCallback(
    async (data: UpsertScoreRequest) => {
      const result = await execute(data);
      if (result && onSuccess) {
        onSuccess();
      }
      return result;
    },
    [execute, onSuccess]
  );

  return {
    updateScore,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
