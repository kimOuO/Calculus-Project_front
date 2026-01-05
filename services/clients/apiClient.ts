import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config';
import type { ApiError } from '@/types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or custom headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error
      const responseData = error.response.data;
      const apiError: ApiError = {
        message: responseData?.message || responseData?.detail || error.message || 'Unknown error',
        code: error.response.status || 500,
        details: responseData?.data,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response (timeout, network error)
      const apiError: ApiError = {
        message: error.message || 'Network error - unable to reach server',
        code: 500,
      };
      return Promise.reject(apiError);
    } else {
      // Something else happened
      const apiError: ApiError = {
        message: error.message || 'Unknown error',
        code: 500,
      };
      return Promise.reject(apiError);
    }
  }
);

// Generic request method
export async function request<T>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<any>(endpoint, data, config);
  
  // Handle actual backend response format
  // Backend returns: { detail: string, data: T } or { status: string, message: string, data: T, code: number }
  const responseData = response.data;
  
  // Check for error status
  if (responseData.status === 'error') {
    const apiError: ApiError = {
      message: responseData.message || responseData.detail || 'Unknown error',
      code: responseData.code || response.status,
      details: responseData.data as Record<string, string[]>,
    };
    throw apiError;
  }
  
  // Return data field from response
  return responseData.data as T;
}

// File upload request
export async function uploadRequest<T>(
  endpoint: string,
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<any>(endpoint, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  const responseData = response.data;
  
  if (responseData.status === 'error') {
    const apiError: ApiError = {
      message: responseData.message || responseData.detail || 'Upload failed',
      code: responseData.code || response.status,
    };
    throw apiError;
  }
  
  return responseData.data as T;
}

// File download request
export async function downloadRequest(
  endpoint: string,
  data: unknown
): Promise<Blob> {
  const response = await apiClient.post(endpoint, data, {
    responseType: 'blob',
  });
  return response.data;
}

export default apiClient;
