'use client';

import React from 'react';
import { Table } from '../Table';
import { StatusBadge } from '../StatusBadge';
import type { Student } from '@/types';

interface StudentListProps {
  students: Student[];
  onStudentClick?: (student: Student) => void;
}

export function StudentList({ students, onStudentClick }: StudentListProps) {
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
          key: 'student_created_at',
          label: '建立時間',
          render: (student) =>
            new Date(student.student_created_at).toLocaleDateString('zh-TW'),
        },
      ]}
      data={students}
      keyExtractor={(student) => student.student_uuid}
      onRowClick={onStudentClick}
      emptyMessage="尚無學生資料"
    />
  );
}
