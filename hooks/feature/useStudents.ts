'use client';

import { useCallback } from 'react';
import { useAsyncEffect, useAsync } from '@/hooks/base';
import {
  listStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStatusStats,
} from '@/services';
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentStatusStats,
} from '@/types';

// Hook for fetching students list
export function useStudents(semester?: string) {
  const { data, status, error, refetch } = useAsyncEffect<Student[]>(
    () => listStudents(semester ? { student_semester: semester } : {}),
    [semester]
  );

  return {
    students: data || [],
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for creating a student
export function useCreateStudent() {
  const { execute, status, error } = useAsync<Student, [CreateStudentRequest]>(
    createStudent
  );

  const create = useCallback(
    async (data: CreateStudentRequest) => {
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

// Hook for updating a student
export function useUpdateStudent() {
  const { execute, status, error } = useAsync<Student, [UpdateStudentRequest]>(
    updateStudent
  );

  const update = useCallback(
    async (data: UpdateStudentRequest) => {
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

// Hook for deleting a student
export function useDeleteStudent() {
  const { execute, status, error } = useAsync<void, [string]>(deleteStudent);

  const remove = useCallback(
    async (studentUuid: string) => {
      return await execute(studentUuid);
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

// Hook for fetching student status statistics
export function useStudentStatusStats(semester: string) {
  const { data, status, error, refetch } = useAsyncEffect<StudentStatusStats>(
    () => getStudentStatusStats(semester),
    [semester]
  );

  return {
    stats: data,
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
