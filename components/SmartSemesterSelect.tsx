'use client';

import React from 'react';
import { Select } from '@/components/Select';
import { useStudentSemesters, useTestSemesters } from '@/hooks';

interface SemesterSelectProps {
  value: string;
  onChange: (semester: string) => void;
  label?: string;
  includeAll?: boolean;
  allLabel?: string;
  disabled?: boolean;
  /**
   * 資料源類型：
   * - 'student': 從學生資料獲取學期（用於學生、成績管理）
   * - 'test': 從考試資料獲取學期（用於考試管理）
   * - 'auto': 自動選擇（預設為 student）
   */
  dataSource?: 'student' | 'test' | 'auto';
}

/**
 * 智能學期選擇器組件
 * 根據 dataSource 自動選擇合適的資料源
 */
export function SmartSemesterSelect({
  value,
  onChange,
  label = '學年學期',
  includeAll = true,
  allLabel = '全部學期',
  disabled = false,
  dataSource = 'auto',
}: SemesterSelectProps) {
  // 根據 dataSource 選擇合適的 hook
  const shouldUseStudentData = dataSource === 'student' || dataSource === 'auto';
  const shouldUseTestData = dataSource === 'test';
  
  const { 
    semesters: studentSemesters, 
    isLoading: isLoadingStudents 
  } = useStudentSemesters();
  
  const { 
    semesters: testSemesters, 
    isLoading: isLoadingTests 
  } = useTestSemesters();

  // 選擇要使用的學期資料
  const semesters = shouldUseStudentData ? studentSemesters : testSemesters;
  const isLoading = shouldUseStudentData ? isLoadingStudents : isLoadingTests;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const options = [
    ...(includeAll ? [{ value: '', label: allLabel }] : []),
    ...semesters.map((sem) => ({ value: sem, label: sem })),
  ];

  return (
    <Select
      label={label}
      value={value}
      onChange={handleChange}
      options={options}
      disabled={disabled || isLoading}
    />
  );
}