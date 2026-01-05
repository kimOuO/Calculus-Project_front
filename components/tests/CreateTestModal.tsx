'use client';

import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import type { CreateTestRequest } from '@/types';

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTestRequest) => Promise<void>;
}

export function CreateTestModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTestModalProps) {
  const [formData, setFormData] = useState<CreateTestRequest>({
    test_name: '',
    test_date: '',
    test_range: '',
    test_semester: '',
    test_weight: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof CreateTestRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!formData.test_name || !formData.test_date || !formData.test_range || !formData.test_semester) {
      setError('請填寫所有必填欄位');
      return;
    }

    // Validate weight if provided
    if (formData.test_weight) {
      const weight = parseFloat(formData.test_weight);
      if (isNaN(weight) || weight < 0 || weight > 1) {
        setError('權重必須在 0-1 之間');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      // Reset form
      setFormData({
        test_name: '',
        test_date: '',
        test_range: '',
        test_semester: '',
        test_weight: '',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '創建失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      test_name: '',
      test_date: '',
      test_range: '',
      test_semester: '',
      test_weight: '',
    });
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="新增考試">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="考試名稱 *"
          value={formData.test_name}
          onChange={(e) => handleChange('test_name', e.target.value)}
          placeholder="例: 第一次小考"
          required
        />

        <Input
          label="考試日期 *"
          type="date"
          value={formData.test_date}
          onChange={(e) => handleChange('test_date', e.target.value)}
          required
        />

        <Input
          label="考試範圍 *"
          value={formData.test_range}
          onChange={(e) => handleChange('test_range', e.target.value)}
          placeholder="例: Chapter 1-3"
          required
        />

        <Input
          label="學年學期 *"
          value={formData.test_semester}
          onChange={(e) => handleChange('test_semester', e.target.value)}
          placeholder="例: 1141"
          required
        />

        <Input
          label="權重 (選填)"
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={formData.test_weight}
          onChange={(e) => handleChange('test_weight', e.target.value)}
          placeholder="例: 0.2 (代表 20%)"
        />

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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '創建中...' : '創建'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
