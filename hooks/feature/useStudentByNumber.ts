'use client';

import { useAsyncEffect } from '@/hooks/base';
import { getStudentByNumber } from '@/services/api';
import type { Student } from '@/types';

// Hook for fetching a single student by student number
export function useStudentByNumber(studentNumber: string) {
  const { data, status, error, refetch } = useAsyncEffect<Student>(
    () => getStudentByNumber(studentNumber),
    [studentNumber]
  );

  return {
    student: data || null,
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
