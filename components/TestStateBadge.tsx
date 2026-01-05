'use client';

import React from 'react';
import { Badge } from './Badge';
import type { TestState } from '@/types';
import { TEST_STATE_CONFIG } from '@/config';

interface TestStateBadgeProps {
  state: TestState;
}

export function TestStateBadge({ state }: TestStateBadgeProps) {
  const config = TEST_STATE_CONFIG[state];
  
  return (
    <Badge color={config.color as 'blue' | 'green' | 'gray'}>
      {config.label}
    </Badge>
  );
}
