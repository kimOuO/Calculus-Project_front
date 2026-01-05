'use client';

import { useCallback } from 'react';
import { useAsyncEffect, useAsync } from '@/hooks/base';
import {
  listScores,
  upsertScore,
  deleteScore,
  calculateFinalScores,
  getTestStatistics,
} from '@/services';
import type {
  Score,
  UpsertScoreRequest,
  CalculateFinalScoresRequest,
  CalculateFinalScoresResponse,
  TestStatisticsRequest,
  TestStatistics,
} from '@/types';

// Hook for fetching scores list
export function useScores(studentUuid?: string) {
  const { data, status, error, refetch } = useAsyncEffect<Score[]>(
    () => listScores(studentUuid ? { f_student_uuid: studentUuid } : {}),
    [studentUuid]
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

// Hook for upserting a score
export function useUpsertScore() {
  const { execute, status, error } = useAsync<Score, [UpsertScoreRequest]>(
    upsertScore
  );

  const upsert = useCallback(
    async (data: UpsertScoreRequest) => {
      return await execute(data);
    },
    [execute]
  );

  return {
    upsert,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for updating a score (alias for upsertScore)
export function useUpdateScore() {
  const { execute, status, error } = useAsync<Score, [UpsertScoreRequest]>(
    upsertScore
  );

  const update = useCallback(
    async (data: UpsertScoreRequest) => {
      return await execute(data);
    },
    [execute]
  );

  return {
    update,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for deleting a score
export function useDeleteScore() {
  const { execute, status, error } = useAsync<void, [string]>(deleteScore);

  const remove = useCallback(
    async (scoreUuid: string) => {
      return await execute(scoreUuid);
    },
    [execute]
  );

  return {
    remove,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for calculating final scores
export function useCalculateFinalScores() {
  const { execute, status, error } = useAsync<
    CalculateFinalScoresResponse,
    [CalculateFinalScoresRequest]
  >(calculateFinalScores);

  const calculate = useCallback(
    async (data: CalculateFinalScoresRequest) => {
      return await execute(data);
    },
    [execute]
  );

  return {
    calculate,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for fetching test statistics
export function useTestStatistics(
  semester: string,
  scoreField: TestStatisticsRequest['score_field']
) {
  const { data, status, error, refetch } = useAsyncEffect<TestStatistics>(
    () =>
      getTestStatistics({
        score_semester: semester,
        score_field: scoreField,
        exclude_empty: true,
      }),
    [semester, scoreField]
  );

  return {
    statistics: data,
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for fetching test statistics on demand
export function useTestStatisticsLazy() {
  const { execute, status, error } = useAsync<
    TestStatistics,
    [TestStatisticsRequest]
  >(getTestStatistics);

  const getStats = async (request: TestStatisticsRequest) => {
    return await execute(request);
  };

  return {
    getStats,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
