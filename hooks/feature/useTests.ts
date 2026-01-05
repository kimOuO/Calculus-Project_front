'use client';

import { useCallback } from 'react';
import { useAsyncEffect, useAsync } from '@/hooks/base';
import {
  listTests,
  createTest,
  updateTest,
  deleteTest,
  updateTestStatus,
  setTestWeights,
} from '@/services';
import type {
  Test,
  CreateTestRequest,
  UpdateTestRequest,
  UpdateTestStatusRequest,
  SetTestWeightsRequest,
  SetTestWeightsResponse,
} from '@/types';

// Hook for fetching tests list
export function useTests(semester?: string) {
  const { data, status, error, refetch } = useAsyncEffect<Test[]>(
    () => listTests(semester ? { test_semester: semester } : {}),
    [semester]
  );

  return {
    tests: data || [],
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for creating a test
export function useCreateTest() {
  const { execute, status, error } = useAsync<Test, [CreateTestRequest]>(
    createTest
  );

  const create = useCallback(
    async (data: CreateTestRequest) => {
      return await execute(data);
    },
    [execute]
  );

  return {
    create,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for updating a test
export function useUpdateTest() {
  const { execute, status, error } = useAsync<Test, [UpdateTestRequest]>(
    updateTest
  );

  const update = useCallback(
    async (data: UpdateTestRequest) => {
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

// Hook for deleting a test
export function useDeleteTest() {
  const { execute, status, error } = useAsync<void, [string]>(deleteTest);

  const remove = useCallback(
    async (testUuid: string) => {
      return await execute(testUuid);
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

// Hook for updating test status
export function useUpdateTestStatus() {
  const { execute, status, error } = useAsync<Test, [UpdateTestStatusRequest]>(
    updateTestStatus
  );

  const updateStatus = useCallback(
    async (data: UpdateTestStatusRequest) => {
      return await execute(data);
    },
    [execute]
  );

  return {
    updateStatus,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for setting test weights
export function useSetTestWeights() {
  const { execute, status, error } = useAsync<
    SetTestWeightsResponse,
    [SetTestWeightsRequest]
  >(setTestWeights);

  const setWeights = useCallback(
    async (data: SetTestWeightsRequest) => {
      return await execute(data);
    },
    [execute]
  );

  return {
    setWeights,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
