'use client';

import React from 'react';
import { Table } from '../Table';
import { SCORE_FIELD_NAMES } from '@/config';
import type { Score } from '@/types';

interface ScoreListProps {
  scores: Score[];
}

export function ScoreList({ scores }: ScoreListProps) {
  const formatScore = (value: string) => {
    return value === '' || value === null ? '-' : value;
  };

  return (
    <Table
      columns={[
        {
          key: 'score_quiz1',
          label: SCORE_FIELD_NAMES.score_quiz1,
          render: (score) => formatScore(score.score_quiz1),
        },
        {
          key: 'score_midterm',
          label: SCORE_FIELD_NAMES.score_midterm,
          render: (score) => formatScore(score.score_midterm),
        },
        {
          key: 'score_quiz2',
          label: SCORE_FIELD_NAMES.score_quiz2,
          render: (score) => formatScore(score.score_quiz2),
        },
        {
          key: 'score_finalexam',
          label: SCORE_FIELD_NAMES.score_finalexam,
          render: (score) => formatScore(score.score_finalexam),
        },
        {
          key: 'score_total',
          label: SCORE_FIELD_NAMES.score_total,
          render: (score) => (
            <span className="font-semibold">
              {formatScore(score.score_total)}
            </span>
          ),
        },
      ]}
      data={scores}
      keyExtractor={(score) => score.score_uuid}
      emptyMessage="尚無成績資料"
    />
  );
}
