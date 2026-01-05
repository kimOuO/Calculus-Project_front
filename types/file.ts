// File asset type
export type AssetType = 'paper' | 'test_pic' | 'histogram' | 'test_pic_histogram';

// Upload file request
export interface UploadFileRequest {
  test_uuid: string;
  asset_type: AssetType;
  files: File[];
}

// Upload file response
export interface UploadFileResponse {
  file_uuid: string;
  asset_type: AssetType;
  file_count: number;
  mongodb_id: string;
  test_states?: string; // Optional: updated test status (if changed by backend)
}

// Download file request
export interface DownloadFileRequest {
  test_pic_uuid: string;
  asset_type: AssetType;
}

// Update file request
export interface UpdateFileRequest {
  uid: string;
  asset_type: AssetType;
  file: File;
}

// Delete file request
export interface DeleteFileRequest {
  uid: string;
  asset_type: AssetType;
}
