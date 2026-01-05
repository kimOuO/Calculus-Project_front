import { useState } from 'react';
import { updateStudentStatus } from '@/services/api/studentApi';
import type { StudentStatus } from '@/types';

export function useUpdateStudentStatus() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const update = async (studentUuid: string, studentStatus: StudentStatus): Promise<void> => {
    setStatus('loading');
    setError(null);

    try {
      await updateStudentStatus({
        student_uuid: studentUuid,
        student_status: studentStatus,
      });
      setStatus('success');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to update student status';
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  };

  const reset = () => {
    setStatus('idle');
    setError(null);
  };

  return {
    update,
    reset,
    status,
    error,
  };
}
