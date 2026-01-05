'use client';

import React from 'react';
import { Table } from '../Table';
import { StatusBadge } from '../StatusBadge';
import type { ScoreWithStudent, StudentStatus } from '@/types';

interface AllScoresTableProps {
  scores: ScoreWithStudent[];
  onStudentClick?: (studentNumber: string) => void;
}

export function AllScoresTable({
  scores,
  onStudentClick,
}: AllScoresTableProps) {
  const getScoreDisplay = (value: string) => {
    return value && value.trim() !== '' ? value : '-';
  };

  const getScoreClass = (value: string) => {
    if (!value || value.trim() === '') return '';
    const numValue = parseFloat(value);
    if (numValue >= 80) return 'text-green-600 font-semibold';
    if (numValue >= 60) return 'text-blue-600';
    return 'text-red-600 font-semibold';
  };

  return (
    <Table
      columns={[
        { key: 'student_number', label: '學號' },
        { key: 'student_name', label: '姓名' },
        { key: 'student_semester', label: '學期' },
        {
          key: 'student_status',
          label: '狀態',
          render: (score) => <StatusBadge status={score.student_status as StudentStatus} />,
        },
        {
          key: 'score_quiz1',
          label: '小考1',
          render: (score) => (
            <span className={getScoreClass(score.score_quiz1)}>
              {getScoreDisplay(score.score_quiz1)}
            </span>
          ),
        },
        {
          key: 'score_midterm',
          label: '期中考',
          render: (score) => (
            <span className={getScoreClass(score.score_midterm)}>
              {getScoreDisplay(score.score_midterm)}
            </span>
          ),
        },
        {
          key: 'score_quiz2',
          label: '小考2',
          render: (score) => (
            <span className={getScoreClass(score.score_quiz2)}>
              {getScoreDisplay(score.score_quiz2)}
            </span>
          ),
        },
        {
          key: 'score_finalexam',
          label: '期末考',
          render: (score) => (
            <span className={getScoreClass(score.score_finalexam)}>
              {getScoreDisplay(score.score_finalexam)}
            </span>
          ),
        },
        {
          key: 'score_total',
          label: '總分',
          render: (score) => (
            <span className={`font-bold ${getScoreClass(score.score_total)}`}>
              {getScoreDisplay(score.score_total)}
            </span>
          ),
        },
      ]}
      data={scores}
      keyExtractor={(score) => score.score_uuid}
      onRowClick={
        onStudentClick
          ? (score) => onStudentClick(score.student_number)
          : undefined
      }
      emptyMessage="尚無成績資料"
    />
  );
}
