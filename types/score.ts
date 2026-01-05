// Score model
export interface Score {
  score_uuid: string;
  f_student_uuid: string;
  score_quiz1: string;
  score_midterm: string;
  score_quiz2: string;
  score_finalexam: string;
  score_total: string;
  score_created_at: string;
  score_updated_at: string;
}

// Enriched score with student info
export interface ScoreWithStudent extends Score {
  student_name: string;
  student_number: string;
  student_semester: string;
  student_status: StudentStatus;
}

import type { StudentStatus } from './student';

// Score field type
export type ScoreField =
  | 'score_quiz1'
  | 'score_midterm'
  | 'score_quiz2'
  | 'score_finalexam';

// Create/Update score request
export interface UpsertScoreRequest {
  f_student_uuid: string;
  update_field: ScoreField;
  score_value: string | number;
}

// Score filters
export interface ScoreFilters {
  score_uuid?: string;
  f_student_uuid?: string;
}

// Calculate final scores request
export interface CalculateFinalScoresRequest {
  test_semester: string;
  passing_score: number;
}

// Calculate final scores response
export interface CalculateFinalScoresResponse {
  updated_count: number;
}

// Test statistics request
export interface TestStatisticsRequest {
  score_semester: string;
  score_field: ScoreField | 'score_total';
  exclude_empty?: boolean;
}

// Test statistics response
export interface TestStatistics {
  semester: string;
  score_field: string;
  total_count: number;
  average: number;
  median: number;
}

// Generate score diagram request
export interface GenerateScoreDiagramRequest {
  test_semester: string;
  score_field: ScoreField;
  bins?: {
    type: 'fixed_width';
    width: number;
  };
  title?: string;
  format?: 'png' | 'jpg';
}

// Diagram format type
export type DiagramFormat = 'png' | 'jpg';
