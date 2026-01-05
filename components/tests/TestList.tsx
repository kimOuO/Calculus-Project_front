'use client';

import React from 'react';
import { Table } from '../Table';
import { TestStateBadge } from '../TestStateBadge';
import type { Test } from '@/types';

interface TestListProps {
  tests: Test[];
  onTestClick?: (test: Test) => void;
}

export function TestList({ tests, onTestClick }: TestListProps) {
  return (
    <Table
      columns={[
        { key: 'test_name', label: '考試名稱' },
        {
          key: 'test_date',
          label: '考試日期',
          render: (test) =>
            new Date(test.test_date).toLocaleDateString('zh-TW'),
        },
        { key: 'test_range', label: '考試範圍' },
        {
          key: 'test_weight',
          label: '權重',
          render: (test) => (test.test_weight ? `${(parseFloat(test.test_weight) * 100).toFixed(0)}%` : '-'),
        },
        {
          key: 'test_states',
          label: '狀態',
          render: (test) => <TestStateBadge state={test.test_states} />,
        },
      ]}
      data={tests}
      keyExtractor={(test) => test.test_uuid}
      onRowClick={onTestClick}
      emptyMessage="尚無考試資料"
    />
  );
}
