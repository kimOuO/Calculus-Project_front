import { request } from '@/services/clients';
import { API_ENDPOINTS } from '@/config';
import type {
  Test,
  CreateTestRequest,
  UpdateTestRequest,
  TestFilters,
  UpdateTestStatusRequest,
  SetTestWeightsRequest,
  SetTestWeightsResponse,
} from '@/types';

// Create test
export async function createTest(data: CreateTestRequest): Promise<Test> {
  return request<Test>(API_ENDPOINTS.test.create, data);
}

// List tests with optional filters
export async function listTests(filters?: TestFilters): Promise<Test[]> {
  return request<Test[]>(API_ENDPOINTS.test.read, filters || {});
}

// Get test by UUID
export async function getTest(testUuid: string): Promise<Test> {
  const response = await request<Test[] | Test>(API_ENDPOINTS.test.read, {
    test_uuid: testUuid,
  });
  
  // Backend may return either an array or a single object
  const test = Array.isArray(response) ? response[0] : response;
  
  if (!test) {
    throw {
      message: 'Test not found',
      code: 404,
    };
  }
  
  return test;
}

// Update test
export async function updateTest(data: UpdateTestRequest): Promise<Test> {
  return request<Test>(API_ENDPOINTS.test.update, data);
}

// Delete test
export async function deleteTest(testUuid: string): Promise<void> {
  await request(API_ENDPOINTS.test.delete, {
    test_uuid: testUuid,
  });
}

// Update test status
export async function updateTestStatus(
  data: UpdateTestStatusRequest
): Promise<Test> {
  return request<Test>(API_ENDPOINTS.test.status, data);
}

// Set test weights for a semester
export async function setTestWeights(
  data: SetTestWeightsRequest
): Promise<SetTestWeightsResponse> {
  return request<SetTestWeightsResponse>(API_ENDPOINTS.test.setWeight, data);
}

// Get all unique semesters
export async function getSemesters(): Promise<string[]> {
  const tests = await listTests();
  const semesters = [...new Set(tests.map(test => test.test_semester))];
  return semesters.sort().reverse(); // 最新學期在前
}
