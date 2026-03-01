'use client';

import { useState, useRef } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import type { UploadStudentsExcelResponse } from '@/types';

interface UploadStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, semester: string) => Promise<UploadStudentsExcelResponse>;
  isSubmitting: boolean;
  error: string | null;
  defaultSemester?: string;
}

export function UploadStudentsModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  defaultSemester = '',
}: UploadStudentsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [semester, setSemester] = useState<string>(defaultSemester);
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
      alert('請選擇文件');
      return;
    }
    if (!semester.trim()) {
      alert('請輸入學期');
      return;
    }

    try {
      const result = await onSubmit(selectedFile, semester.trim());
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
    setSemester(defaultSemester);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const downloadTemplate = () => {
    // Template matching the expected Excel format:
    // Col A: 名字, Col B: 姓氏(skip), Col C: 學號, Col D: 電子郵件信箱, Col E: 科系(skip), Col F: 分組(skip)
    const templateData = [
      ['名字', '姓氏', '學號', '電子郵件信箱', '科系', '分組'],
      ['王小明', 'B11402001@', 'B11402001', 'B11402001@mail.ntust.edu.tw', '大學部', ''],
      ['李小花', 'B11402002@', 'B11402002', 'B11402002@mail.ntust.edu.tw', '大學部', ''],
    ];

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
                請使用模板格式上傳學生資訊（欄位：名字、姓氏、學號、電子郵件）
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

        {/* Semester Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            學期 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="例如: 1131"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Excel 中的所有學生將被設定為此學期</p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選擇 Excel 文件 <span className="text-red-500">*</span>
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
            <h4 className="font-medium text-green-800 mb-2">上傳完成</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>✅ 成功建立 {uploadResult.created_count} 位學生</p>
              {uploadResult.error_count > 0 && (
                <>
                  <p className="text-red-600">
                    ❌ 失敗 {uploadResult.error_count} 筆記錄
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
