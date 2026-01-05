// Application constants
export const APP_NAME = 'Calculus OOM';
export const APP_VERSION = '0.1.0';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Score field display names
export const SCORE_FIELD_NAMES: Record<string, string> = {
  score_quiz1: '第一次小考',
  score_midterm: '期中考',
  score_quiz2: '第二次小考',
  score_finalexam: '期末考',
  score_total: '總分',
};

// Student status display config
export const STUDENT_STATUS_CONFIG = {
  修業中: { label: '修業中', color: 'blue' },
  修業完畢: { label: '修業完畢', color: 'green' },
  被當: { label: '被當', color: 'red' },
  二退: { label: '二退', color: 'gray' },
} as const;

// Test state display config
export const TEST_STATE_CONFIG = {
  尚未出考卷: { label: '尚未出考卷', color: 'gray' },
  考卷完成: { label: '考卷完成', color: 'blue' },
  考卷成績結算: { label: '考卷成績結算', color: 'green' },
} as const;

// Validation rules
export const VALIDATION = {
  score: {
    min: 0,
    max: 100,
  },
  weight: {
    min: 0,
    max: 1,
    sum: 1,
  },
  studentNumber: {
    pattern: /^\d{9}$/,
    message: '學號必須為9位數字',
  },
  semester: {
    pattern: /^\d{4}$/,
    message: '學期格式為4位數字 (如: 1141)',
  },
} as const;
