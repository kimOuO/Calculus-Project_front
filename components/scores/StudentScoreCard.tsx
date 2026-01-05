'use client';

import React from 'react';
import type { Score } from '@/types';

interface StudentScoreCardProps {
  score: Score | null;
  studentName: string;
  studentNumber: string;
}

export function StudentScoreCard({
  score,
  studentName,
  studentNumber,
}: StudentScoreCardProps) {
  const scoreFields = [
    { label: '第一次小考', key: 'score_quiz1' as const },
    { label: '期中考', key: 'score_midterm' as const },
    { label: '第二次小考', key: 'score_quiz2' as const },
    { label: '期末考', key: 'score_finalexam' as const },
    { label: '總成績', key: 'score_total' as const },
  ];

  const getScoreDisplay = (value: string) => {
    return value && value.trim() !== '' ? value : '-';
  };

  const getScoreColor = (value: string) => {
    if (!value || value.trim() === '') return 'text-gray-400';
    const numValue = parseFloat(value);
    if (numValue >= 80) return 'text-green-600 font-semibold';
    if (numValue >= 60) return 'text-blue-600';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{studentName}</h2>
        <p className="text-gray-600">學號：{studentNumber}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {scoreFields.map((field) => (
          <div
            key={field.key}
            className="border rounded-lg p-4 flex flex-col items-center justify-center"
          >
            <div className="text-sm text-gray-600 mb-2">{field.label}</div>
            <div
              className={`text-3xl font-bold ${
                score ? getScoreColor(score[field.key]) : 'text-gray-400'
              }`}
            >
              {score ? getScoreDisplay(score[field.key]) : '-'}
            </div>
          </div>
        ))}
      </div>

      {!score && (
        <p className="text-center text-gray-500 mt-6">尚無成績資料</p>
      )}

      {score && score.score_updated_at && (
        <p className="text-sm text-gray-500 mt-6 text-right">
          最後更新：
          {new Date(score.score_updated_at).toLocaleString('zh-TW')}
        </p>
      )}
    </div>
  );
}
