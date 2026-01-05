'use client';

import React from 'react';
import Link from 'next/link';
import { Table } from '../Table';
import { TestStateBadge } from '../TestStateBadge';
import { Button } from '../Button';
import type { Test } from '@/types';

interface TestListWithActionsProps {
  tests: Test[];
  onUpload?: (test: Test) => void;
  onEdit?: (test: Test) => void;
  onDelete?: (test: Test) => void;
}

export function TestListWithActions({
  tests,
  onUpload,
  onEdit,
  onDelete,
}: TestListWithActionsProps) {
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
          render: (test) =>
            test.test_weight
              ? `${(parseFloat(test.test_weight) * 100).toFixed(0)}%`
              : '-',
        },
        {
          key: 'test_states',
          label: '狀態',
          render: (test) => <TestStateBadge state={test.test_states} />,
        },
        {
          key: 'actions',
          label: '操作',
          render: (test) => (
            <div className="flex items-center gap-2">
              <Link
                href={`/tests/${test.test_uuid}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                查看
              </Link>
              {onUpload && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpload(test);
                  }}
                >
                  上傳
                </Button>
              )}
              {onEdit && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(test);
                  }}
                >
                  編輯
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(test);
                  }}
                >
                  刪除
                </Button>
              )}
            </div>
          ),
        },
      ]}
      data={tests}
      keyExtractor={(test) => test.test_uuid}
      emptyMessage="尚無考試資料"
    />
  );
}
