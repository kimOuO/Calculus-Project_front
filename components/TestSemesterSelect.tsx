'use client';

import React from 'react';
import { Select } from './Select';
import { useTestSemesters } from '@/hooks';

interface TestSemesterSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  includeAll?: boolean;
  allLabel?: string;
  disabled?: boolean;
}

/**
 * 考試專用的學期選擇器組件
 * 從考試資料獲取學期選項
 */
export function TestSemesterSelect({
  value,
  onChange,
  label = '學年學期',
  includeAll = true,
  allLabel = '全部學期',
  disabled = false,
}: TestSemesterSelectProps) {
  const { semesters, isLoading } = useTestSemesters();

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