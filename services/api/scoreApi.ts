import { request } from '@/services/clients';
import { API_ENDPOINTS, API_CONFIG } from '@/config';
import type {
  Score,
  UpsertScoreRequest,
  ScoreFilters,
  CalculateFinalScoresRequest,
  CalculateFinalScoresResponse,
  TestStatisticsRequest,
  TestStatistics,
  GenerateScoreDiagramRequest,
} from '@/types';

// Create or update score
export async function upsertScore(data: UpsertScoreRequest): Promise<Score> {
  return request<Score>(API_ENDPOINTS.score.create, data);
}

// List scores with optional filters
export async function listScores(filters?: ScoreFilters): Promise<Score[]> {
  return request<Score[]>(API_ENDPOINTS.score.read, filters || {});
}

// Get score by UUID
export async function getScore(scoreUuid: string): Promise<Score> {
  const scores = await request<Score[]>(API_ENDPOINTS.score.read, {
    score_uuid: scoreUuid,
  });
  
  if (!scores || scores.length === 0) {
    throw {
      message: 'Score not found',
      code: 404,
    };
  }
  
  return scores[0];
}

// Get score by student UUID
export async function getScoreByStudent(studentUuid: string): Promise<Score> {
  const scores = await request<Score[]>(API_ENDPOINTS.score.read, {
    f_student_uuid: studentUuid,
  });
  
  if (!scores || scores.length === 0) {
    throw {
      message: 'Score not found for this student',
      code: 404,
    };
  }
  
  return scores[0];
}

// Update score (same as create for this API)
export async function updateScore(data: UpsertScoreRequest): Promise<Score> {
  return request<Score>(API_ENDPOINTS.score.update, data);
}

// Delete score
export async function deleteScore(scoreUuid: string): Promise<void> {
  await request(API_ENDPOINTS.score.delete, {
    score_uuid: scoreUuid,
  });
}

// Calculate final scores for a semester
export async function calculateFinalScores(
  data: CalculateFinalScoresRequest
): Promise<CalculateFinalScoresResponse> {
  return request<CalculateFinalScoresResponse>(
    API_ENDPOINTS.score.calculationFinal,
    data
  );
}

// Get test statistics
export async function getTestStatistics(
  data: TestStatisticsRequest
): Promise<TestStatistics> {
  return request<TestStatistics>(API_ENDPOINTS.score.testScore, data);
}

// Generate score distribution diagram
export async function generateScoreDiagram(
  data: GenerateScoreDiagramRequest
): Promise<Blob> {
  const response = await fetch(
    `${API_CONFIG.baseURL}${API_ENDPOINTS.score.stepDiagram}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw {
      message: error.detail || 'Failed to generate score diagram',
      code: response.status,
    };
  }

  return response.blob();
}
