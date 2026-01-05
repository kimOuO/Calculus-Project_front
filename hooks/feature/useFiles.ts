'use client';

import { useCallback } from 'react';
import { useAsync } from '@/hooks/base';
import { uploadFile, downloadFile, updateFile, deleteFile } from '@/services';
import type {
  UploadFileRequest,
  UploadFileResponse,
  DownloadFileRequest,
  UpdateFileRequest,
  DeleteFileRequest,
} from '@/types';

// Hook for uploading files
export function useUploadFile() {
  const { execute, status, error } = useAsync<
    UploadFileResponse,
    [UploadFileRequest]
  >(uploadFile);

  const upload = useCallback(
    async (data: UploadFileRequest) => {
      return await execute(data);
    },
    [execute]
  );

  return {
    upload,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for downloading files
export function useDownloadFile() {
  const { execute, status, error } = useAsync<Blob, [DownloadFileRequest]>(
    downloadFile
  );

  const download = useCallback(
    async (data: DownloadFileRequest) => {
      const blob = await execute(data);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.asset_type}_${data.test_pic_uuid}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return blob;
    },
    [execute]
  );

  return {
    download,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for getting file blob without triggering download
export function useGetFileBlob() {
  const { execute, status, error } = useAsync<Blob, [DownloadFileRequest]>(
    downloadFile
  );

  const getBlob = useCallback(
    async (data: DownloadFileRequest) => {
      return await execute(data);
    },
    [execute]
  );

  return {
    getBlob,
    status,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

// Hook for updating files
export function useUpdateFile() {
  const { execute, status, error } = useAsync<
    { file_uuid: string; asset_type: string },
    [UpdateFileRequest]
  >(updateFile);

  const update = useCallback(
    async (data: UpdateFileRequest) => {
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

// Hook for deleting files
export function useDeleteFile() {
  const { execute, status, error } = useAsync<void, [DeleteFileRequest]>(
    deleteFile
  );

  const remove = useCallback(
    async (data: DeleteFileRequest) => {
      return await execute(data);
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
