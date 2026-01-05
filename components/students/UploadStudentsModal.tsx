'use client';

import { useState, useRef } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import type { UploadStudentsExcelResponse } from '@/types';

interface UploadStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<UploadStudentsExcelResponse>;
  isSubmitting: boolean;
  error: string | null;
}

export function UploadStudentsModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: UploadStudentsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadStudentsExcelResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('请选择 Excel 文件 (.xlsx 或 .xls)');
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('请选择文件');
      return;
    }

    try {
      const result = await onSubmit(selectedFile);
      setUploadResult(result);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      // Error handled by parent
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const downloadTemplate = () => {
    // Create template data
    const templateData = [
      ['姓名', '学号', '学期'],
      ['张三', 'B11001001', '1141'],
      ['李四', 'B11001002', '1141'],
    ];

    // Convert to CSV format
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="批量上传学生"
    >
      <div className="space-y-4">
        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium mb-2">
                请使用模板格式上传学生信息
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={downloadTemplate}
              >
                📥 下载 Excel 模板
              </Button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择 Excel 文件
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              已选择: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">上传完成</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>✅ 成功创建 {uploadResult.created_count} 位学生</p>
              {uploadResult.error_count > 0 && (
                <>
                  <p className="text-red-600">
                    ❌ 失败 {uploadResult.error_count} 条记录
                  </p>
                  {uploadResult.errors.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      <p className="font-medium mb-1">错误详情：</p>
                      <ul className="list-disc list-inside space-y-1">
                        {uploadResult.errors.map((error, index) => (
                          <li key={index} className="text-red-600 text-xs">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {uploadResult ? '关闭' : '取消'}
          </Button>
          {!uploadResult && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedFile}
            >
              {isSubmitting ? '上传中...' : '上传'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
