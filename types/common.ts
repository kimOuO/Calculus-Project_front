// Async operation status
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

// Generic async state
export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: ApiError | null;
}

// API error structure
export interface ApiError {
  message: string;
  code: number;
  details?: Record<string, string[]>;
}

// Generic API response
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  code: number;
}

// Pagination state
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// Sort configuration
export interface SortConfig<T = string> {
  field: T;
  direction: 'asc' | 'desc';
}

// Filter configuration
export type FilterConfig<T = string> = Record<T, string | number | boolean>;
