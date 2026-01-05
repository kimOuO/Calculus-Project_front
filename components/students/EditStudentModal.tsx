'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import type { Student, StudentStatus, UpdateStudentRequest } from '@/types';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStudentRequest) => Promise<void>;
  isSubmitting?: boolean;
  error?: string;
  student: Student | null;
}

export function EditStudentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  error,
  student,
}: EditStudentModalProps) {
  const [formData, setFormData] = useState<Omit<UpdateStudentRequest, 'student_uuid'>>({
    student_name: '',
    student_number: '',
    student_semester: '',
    student_status: '修業中',
  });

  // Initialize form data when student changes
  useEffect(() => {
    if (student) {
      setFormData({
        student_name: student.student_name,
        student_number: student.student_number,
        student_semester: student.student_semester,
        student_status: student.student_status,
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) return;

    try {
      await onSubmit({
        student_uuid: student.student_uuid,
        ...formData,
      });
      handleClose();
    } catch (err) {
      // Error is handled by parent
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="編輯學生資料">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            學生 UUID: <span className="font-mono text-xs">{student.student_uuid}</span>
          </p>
        </div>

        <Input
          label="學生姓名"
          required
          value={formData.student_name}
          onChange={(e) =>
            setFormData({ ...formData, student_name: e.target.value })
          }
        />
        
        <Input
          label="學號"
          required
          pattern="[A-Z]\d{8}"
          placeholder="例: B11001234"
          value={formData.student_number}
          onChange={(e) =>
            setFormData({ ...formData, student_number: e.target.value })
          }
          helperText="請輸入大寫英文字母 + 8位數字"
        />
        
        <Input
          label="學年學期"
          required
          pattern="\d{4}"
          placeholder="例: 1141"
          value={formData.student_semester}
          onChange={(e) =>
            setFormData({ ...formData, student_semester: e.target.value })
          }
          helperText="格式為4位數字 (如: 1141)"
        />
        
        <Select
          label="學生狀態"
          value={formData.student_status}
          onChange={(e) =>
            setFormData({
              ...formData,
              student_status: e.target.value as StudentStatus,
            })
          }
          options={[
            { value: '修業中', label: '修業中' },
            { value: '二退', label: '二退' },
            { value: '被當', label: '被當' },
            { value: '修業完畢', label: '修業完畢' },
          ]}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            取消
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            更新
          </Button>
        </div>
      </form>
    </Modal>
  );
}
