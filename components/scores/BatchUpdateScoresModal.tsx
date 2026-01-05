'use client';

import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import type { ScoreWithStudent, ScoreField } from '@/types';

interface BatchUpdateScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: Array<{ f_student_uuid: string; update_field: ScoreField; score_value: string }>) => Promise<void>;
  scores: ScoreWithStudent[];
  field: ScoreField;
}

export function BatchUpdateScoresModal({
  isOpen,
  onClose,
  onSubmit,
  scores,
  field,
}: BatchUpdateScoresModalProps) {
  const [scoreValues, setScoreValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fieldLabels: Record<ScoreField, string> = {
    score_quiz1: '第一次小考',
    score_midterm: '期中考',
    score_quiz2: '第二次小考',
    score_finalexam: '期末考',
  };

  const handleScoreChange = (scoreUuid: string, value: string) => {
    setScoreValues((prev) => ({
      ...prev,
      [scoreUuid]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all scores
    const updates: Array<{ f_student_uuid: string; update_field: ScoreField; score_value: string }> = [];
    
    for (const score of scores) {
      const value = scoreValues[score.score_uuid];
      
      if (value && value.trim() !== '') {
        const numValue = parseFloat(value);
        
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          setError(`學號 ${score.student_number} 的分數必須在 0-100 之間`);
          return;
        }

        updates.push({
          f_student_uuid: score.f_student_uuid,
          update_field: field,
          score_value: value,
        });
      }
    }

    if (updates.length === 0) {
      setError('請至少輸入一位學生的成績');
      return;
    }

    if (!confirm(`確定要更新 ${updates.length} 位學生的${fieldLabels[field]}成績嗎？`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(updates);
      setScoreValues({});
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setScoreValues({});
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`批量更新 - ${fieldLabels[field]}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-600 mb-4">
          <p>請輸入每位學生的成績（0-100），留空表示不更新該學生。</p>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3">
          {scores.map((score) => (
            <div
              key={score.score_uuid}
              className="flex items-center gap-4 p-3 border rounded-md"
            >
              <div className="flex-1">
                <div className="font-medium">
                  {score.student_number} - {score.student_name}
                </div>
                <div className="text-sm text-gray-500">
                  當前成績: {score[field] || '未輸入'}
                </div>
              </div>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="分數"
                value={scoreValues[score.score_uuid] || ''}
                onChange={(e) =>
                  handleScoreChange(score.score_uuid, e.target.value)
                }
                className="w-24"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '更新中...' : '確定更新'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
