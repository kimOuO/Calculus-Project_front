'use client';

import { useAsyncEffect } from '@/hooks/base';
import { listStudents } from '@/services/api/studentApi';

/**
 * Hook for fetching available semesters from student data
 * Returns semesters sorted in descending order (most recent first)
 * Default semester hook - uses student data for better user experience
 * Updated: 2026-02-27 15:33 - Force new build hash
 */
export function useSemesters() {
  const { data, status, error, refetch } = useAsyncEffect<string[]>(
    async () => {
      console.log('🔍 useSemesters: Fetching semesters from STUDENT data directly');
      const students = await listStudents();
      console.log('👥 useSemesters: Found students:', students.length);
      const semesters = [...new Set(students.map(student => student.student_semester))];
      console.log('📅 useSemesters: Extracted semesters:', semesters);
      const result = semesters.sort().reverse(); // 最新學期在前
      console.log('✅ useSemesters: Returning semesters:', result);
      return result;
    },
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
