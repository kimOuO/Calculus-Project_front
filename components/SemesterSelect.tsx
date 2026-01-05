'use client';

import React from 'react';
import { Select } from './Select';
import { useSemesters } from '@/hooks';

interface SemesterSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  includeAll?: boolean;
  allLabel?: string;
  disabled?: boolean;
}

/**
 * 共用的學期選擇器組件
 * 自動獲取所有可用的學期選項
 */
export function SemesterSelect({
  value,
  onChange,
  label = '學年學期',
  includeAll = true,
  allLabel = '全部學期',
  disabled = false,
}: SemesterSelectProps) {
  const { semesters, isLoading } = useSemesters();

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
