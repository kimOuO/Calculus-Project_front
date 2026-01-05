'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import type { Student, StudentStatus } from '@/types';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSubmit: (studentUuid: string, status: StudentStatus) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

const STATUS_OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: '修業中', label: '修業中' },
  { value: '修業完畢', label: '修業完畢' },
  { value: '被當', label: '被當' },
  { value: '二退', label: '二退' },
];

export function UpdateStatusModal({
  isOpen,
  onClose,
  student,
  onSubmit,
  isSubmitting,
  error,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<StudentStatus>(
    student?.student_status || '修業中'
  );

  const handleSubmit = async () => {
    if (!student) return;

    // Warning for "二退" status
    if (selectedStatus === '二退') {
      const confirmed = window.confirm(
        '⚠️ 警告：设置为"二退"状态将自动清空该学生的所有成绩记录。\n\n确定要继续吗？'
      );
      if (!confirmed) return;
    }

    await onSubmit(student.student_uuid, selectedStatus);
  };

  const handleClose = () => {
    setSelectedStatus(student?.student_status || '修業中');
    onClose();
  };

  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="更新学生状态"
    >
      <div className="space-y-4">
        {/* Student Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">姓名：</span>
              <span className="font-medium">{student.student_name}</span>
            </div>
            <div>
              <span className="text-gray-600">学号：</span>
              <span className="font-medium">{student.student_number}</span>
            </div>
            <div>
              <span className="text-gray-600">学期：</span>
              <span className="font-medium">{student.student_semester}</span>
            </div>
            <div>
              <span className="text-gray-600">当前状态：</span>
              <span className="font-medium">{student.student_status}</span>
            </div>
          </div>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新状态
          </label>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as StudentStatus)}
            options={STATUS_OPTIONS}
          />
        </div>

        {/* Warning for "二退" */}
        {selectedStatus === '二退' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-red-600 text-xl">⚠️</div>
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium mb-1">
                  重要提示
                </p>
                <p className="text-sm text-red-700">
                  设置为"二退"状态将自动清空该学生的所有成绩记录。此操作不可撤销！
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Note */}
        {(selectedStatus === '修業完畢' || selectedStatus === '被當') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              ℹ️ 注意：通常"修業完畢"和"被當"状态由系统在计算总成绩时自动设置。
            </p>
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
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedStatus === student.student_status}
          >
            {isSubmitting ? '更新中...' : '确认更新'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
