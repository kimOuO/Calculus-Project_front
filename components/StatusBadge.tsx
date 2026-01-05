'use client';

import React from 'react';
import { Badge } from './Badge';
import type { StudentStatus } from '@/types';
import { STUDENT_STATUS_CONFIG } from '@/config';

interface StatusBadgeProps {
  status: StudentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STUDENT_STATUS_CONFIG[status];
  
  return (
    <Badge color={config.color as 'blue' | 'green' | 'red' | 'gray'}>
      {config.label}
    </Badge>
  );
}
