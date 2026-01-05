import { useState } from 'react';
import { generateScoreDiagram } from '@/services/api/scoreApi';
import type { GenerateScoreDiagramRequest } from '@/types';

export function useGenerateScoreDiagram() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generate = async (data: GenerateScoreDiagramRequest): Promise<string> => {
    setStatus('loading');
    setError(null);

    try {
      const blob = await generateScoreDiagram(data);
      
      // Create object URL for preview
      const url = window.URL.createObjectURL(blob);
      setImageUrl(url);
      setStatus('success');
      
      return url;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to generate diagram';
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  };

  const download = (filename: string) => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    if (imageUrl) {
      window.URL.revokeObjectURL(imageUrl);
    }
    setStatus('idle');
    setError(null);
    setImageUrl(null);
  };

  return {
    generate,
    download,
    reset,
    status,
    error,
    imageUrl,
  };
}
