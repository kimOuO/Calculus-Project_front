'use client';

import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import type { ScoreField } from '@/types';

interface UpdateScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (field: ScoreField, value: string) => Promise<void>;
  currentScores: {
    score_quiz1: string;
    score_midterm: string;
    score_quiz2: string;
    score_finalexam: string;
  } | null;
  studentName: string;
}

export function UpdateScoreModal({
  isOpen,
  onClose,
  onSubmit,
  currentScores,
  studentName,
}: UpdateScoreModalProps) {
  const [selectedField, setSelectedField] = useState<ScoreField>('score_quiz1');
  const [scoreValue, setScoreValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const scoreFields: { value: ScoreField; label: string }[] = [
    { value: 'score_quiz1', label: '第一次小考' },
    { value: 'score_midterm', label: '期中考' },
    { value: 'score_quiz2', label: '第二次小考' },
    { value: 'score_finalexam', label: '期末考' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate score
    if (scoreValue.trim() === '') {
      setError('請輸入分數');
      return;
    }

    const numValue = parseFloat(scoreValue);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      setError('分數必須在 0-100 之間');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(selectedField, scoreValue);
      setScoreValue('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setScoreValue('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`更新成績 - ${studentName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            考試項目
          </label>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value as ScoreField)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {scoreFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
                {currentScores && currentScores[field.value]
                  ? ` (目前: ${currentScores[field.value]})`
                  : ' (未輸入)'}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="分數"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={scoreValue}
          onChange={(e) => setScoreValue(e.target.value)}
          placeholder="請輸入 0-100 之間的分數"
          required
        />

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

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
            {isSubmitting ? '更新中...' : '更新'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
