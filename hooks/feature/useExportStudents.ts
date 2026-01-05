import { useState } from 'react';
import { exportStudentsScoresExcel } from '@/services/api/studentApi';
import type { ExportStudentsExcelRequest } from '@/types';

export function useExportStudents() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const exportExcel = async (data: ExportStudentsExcelRequest): Promise<void> => {
    setStatus('loading');
    setError(null);

    try {
      const blob = await exportStudentsScoresExcel(data);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `students_scores_${data.student_semester}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setStatus('success');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to export students';
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
    exportExcel,
    reset,
    status,
    error,
  };
}
