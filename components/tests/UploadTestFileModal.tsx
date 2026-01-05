'use client';

import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import type { Test, AssetType } from '@/types';

interface UploadTestFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assetType: AssetType, files: File[]) => Promise<void>;
  test: Test;
}

export function UploadTestFileModal({
  isOpen,
  onClose,
  onSubmit,
  test,
}: UploadTestFileModalProps) {
  const [assetType, setAssetType] = useState<AssetType>('paper');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const assetTypeOptions: { value: AssetType; label: string; description: string }[] = [
    { value: 'paper', label: '考卷', description: '上傳考試試卷 PDF/圖片' },
    { value: 'histogram', label: '直方圖', description: '上傳成績分布直方圖' },
    { value: 'test_pic', label: '考試圖片', description: '上傳考試相關圖片' },
    { value: 'test_pic_histogram', label: '考試圖片直方圖', description: '上傳考試圖片的直方圖' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (files.length === 0) {
      setError('請選擇至少一個文件');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('只支持 JPG, PNG, GIF, PDF 格式');
      return;
    }

    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError('文件大小不能超過 10MB');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(assetType, files);
      setFiles([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`上傳文件 - ${test.test_name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          <p><strong>考試:</strong> {test.test_name}</p>
          <p><strong>日期:</strong> {test.test_date}</p>
          <p><strong>學期:</strong> {test.test_semester}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文件類型 *
          </label>
          <div className="space-y-2">
            {assetTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={assetType === option.value}
                  onChange={(e) => setAssetType(e.target.value as AssetType)}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選擇文件 *
          </label>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
          {files.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              已選擇 {files.length} 個文件
              <ul className="mt-1 ml-4 list-disc">
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting || files.length === 0}>
            {isSubmitting ? '上傳中...' : '上傳'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
