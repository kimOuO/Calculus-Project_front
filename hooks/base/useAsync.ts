'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AsyncState, AsyncStatus, ApiError } from '@/types';

export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: 'idle' as AsyncStatus,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, status: 'loading', error: null });
      
      try {
        const data = await asyncFunction(...args);
        setState({ data, status: 'success', error: null });
        return data;
      } catch (error) {
        const apiError = error as ApiError;
        setState({ data: null, status: 'error', error: apiError });
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, status: 'idle', error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
  };
}

// Hook for auto-executing async functions
export function useAsyncEffect<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: 'idle' as AsyncStatus,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, status: 'loading', error: null });
    
    try {
      const data = await asyncFunction();
      setState({ data, status: 'success', error: null });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setState({ data: null, status: 'error', error: apiError });
      // Don't rethrow in useEffect context
      return null;
    }
  }, [asyncFunction]);

  useEffect(() => {
    refetch().catch((error) => {
      // Catch any unhandled promise rejections
      console.error('Async effect error:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...state,
    refetch,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
  };
}
