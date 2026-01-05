'use client';

import React from 'react';
import Link from 'next/link';
import { Table } from '../Table';
import { StatusBadge } from '../StatusBadge';
import { Button } from '../Button';
import type { Student } from '@/types';

interface StudentListWithActionsProps {
  students: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  onStatusUpdate?: (student: Student) => void;
  showScoresLink?: boolean;
}

export function StudentListWithActions({
  students,
  onEdit,
  onDelete,
  onStatusUpdate,
  showScoresLink = true,
}: StudentListWithActionsProps) {
  return (
    <Table
      columns={[
        { key: 'student_number', label: '學號' },
        { key: 'student_name', label: '姓名' },
        { key: 'student_semester', label: '學年學期' },
        {
          key: 'student_status',
          label: '狀態',
          render: (student) => (
            <StatusBadge status={student.student_status} />
          ),
        },
        {
          key: 'actions',
          label: '操作',
          render: (student) => (
            <div className="flex items-center gap-2">
              {showScoresLink && (
                <Link
                  href={`/students/${student.student_number}/scores`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  成績
                </Link>
              )}
              {onStatusUpdate && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(student);
                  }}
                >
                  狀態
                </Button>
              )}
              {onEdit && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(student);
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
                    onDelete(student);
                  }}
                >
                  刪除
                </Button>
              )}
            </div>
          ),
        },
      ]}
      data={students}
      keyExtractor={(student) => student.student_uuid}
      emptyMessage="尚無學生資料"
    />
  );
}
