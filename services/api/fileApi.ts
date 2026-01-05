import { uploadRequest, downloadRequest, request } from '@/services/clients';
import { API_ENDPOINTS } from '@/config';
import type {
  UploadFileRequest,
  UploadFileResponse,
  DownloadFileRequest,
  UpdateFileRequest,
  DeleteFileRequest,
} from '@/types';

// Upload file(s)
export async function uploadFile(
  data: UploadFileRequest
): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append('test_uuid', data.test_uuid);
  formData.append('asset_type', data.asset_type);
  
  data.files.forEach((file) => {
    formData.append('file', file);
  });
  
  return uploadRequest<UploadFileResponse>(
    API_ENDPOINTS.file.create,
    formData
  );
}

// Download file
export async function downloadFile(
  data: DownloadFileRequest
): Promise<Blob> {
  return await downloadRequest(API_ENDPOINTS.file.read, data);
}

// Update file
export async function updateFile(
  data: UpdateFileRequest
): Promise<{ file_uuid: string; asset_type: string }> {
  const formData = new FormData();
  formData.append('uid', data.uid);
  formData.append('asset_type', data.asset_type);
  formData.append('file', data.file);
  
  return uploadRequest<{ file_uuid: string; asset_type: string }>(
    API_ENDPOINTS.file.update,
    formData
  );
}

// Delete file
export async function deleteFile(data: DeleteFileRequest): Promise<void> {
  await request(API_ENDPOINTS.file.delete, data);
}
