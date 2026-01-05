// Test model
export interface Test {
  test_uuid: string;
  test_name: string;
  test_date: string;
  test_range: string;
  test_semester: string;
  test_weight: string;
  test_states: TestState;
  pt_opt_score_uuid: string;
  test_created_at: string;
  test_updated_at: string;
}

// Test state enum
export type TestState = '尚未出考卷' | '考卷完成' | '考卷成績結算';

// Create test request
export interface CreateTestRequest {
  test_name: string;
  test_date: string;
  test_range: string;
  test_semester: string;
  test_weight?: string;
}

// Update test request
export interface UpdateTestRequest {
  test_uuid: string;
  test_name?: string;
  test_date?: string;
  test_range?: string;
  test_weight?: string;
}

// Test filters
export interface TestFilters {
  test_uuid?: string;
  test_semester?: string;
}

// Update test status request
export interface UpdateTestStatusRequest {
  test_uuid: string;
  test_states: TestState;
}

// Set test weights request
export interface SetTestWeightsRequest {
  test_semester: string;
  weights: Record<string, string>;
}

// Set test weights response
export interface SetTestWeightsResponse {
  updated_count: number;
}

// Test name to score field mapping
export const TEST_NAME_TO_FIELD: Record<string, string> = {
  '第一次小考': 'score_quiz1',
  '期中考': 'score_midterm',
  '第二次小考': 'score_quiz2',
  '期末考': 'score_finalexam',
};
