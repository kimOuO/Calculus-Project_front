import { useState } from 'react';
import { uploadStudentsExcel } from '@/services/api/studentApi';
import type { UploadStudentsExcelResponse } from '@/types';

export function useUploadStudents() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UploadStudentsExcelResponse | null>(null);

  const upload = async (file: File): Promise<UploadStudentsExcelResponse> => {
    setStatus('loading');
    setError(null);

    try {
      const result = await uploadStudentsExcel(file);
      setData(result);
      setStatus('success');
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to upload students';
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  };

  const reset = () => {
    setStatus('idle');
    setError(null);
    setData(null);
  };

  return {
    upload,
    reset,
    status,
    error,
    data,
  };
}
