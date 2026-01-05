import {
  listStudents,
  listScores,
  getScoreByStudent,
  getStudentByNumber,
} from '@/services/api';
import type { Student, Score, ScoreWithStudent, ScoreField } from '@/types';

// Student with score data
export interface StudentWithScore {
  student: Student;
  score: Score | null;
}

// Get students with their scores for a semester
export async function getStudentsWithScores(
  semester: string
): Promise<StudentWithScore[]> {
  // Fetch students for the semester
  const students = await listStudents({ student_semester: semester });
  
  // Fetch all scores
  const scores = await listScores();
  
  // Create a map of student UUID to score
  const scoreMap = new Map<string, Score>();
  scores.forEach((score) => {
    scoreMap.set(score.f_student_uuid, score);
  });
  
  // Combine students with their scores
  return students.map((student) => ({
    student,
    score: scoreMap.get(student.student_uuid) || null,
  }));
}

// Get all scores with student information enriched
export async function getScoresWithStudentInfo(
  semester?: string
): Promise<ScoreWithStudent[]> {
  // Fetch all students (optionally filtered by semester)
  const students = semester
    ? await listStudents({ student_semester: semester })
    : await listStudents();
  
  // Fetch all scores
  const scores = await listScores();
  
  // Create a map of student UUID to student
  const studentMap = new Map<string, Student>();
  students.forEach((student) => {
    studentMap.set(student.student_uuid, student);
  });
  
  // Enrich scores with student information
  return scores
    .map((score) => {
      const student = studentMap.get(score.f_student_uuid);
      if (!student) return null;
      
      return {
        ...score,
        student_name: student.student_name,
        student_number: student.student_number,
        student_semester: student.student_semester,
        student_status: student.student_status,
      };
    })
    .filter((item): item is ScoreWithStudent => item !== null);
}

// Get score by student number (resolves UUID internally)
export async function getScoreByStudentNumber(
  studentNumber: string
): Promise<Score> {
  const student = await getStudentByNumber(studentNumber);
  return getScoreByStudent(student.student_uuid);
}

// Batch update scores for multiple students
export interface BatchScoreUpdate {
  student_number: string;
  score_value: string | number;
}

export async function batchUpdateScores(
  updates: BatchScoreUpdate[],
  scoreField: ScoreField
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  
  const { upsertScore } = await import('@/services/api');
  
  for (const update of updates) {
    try {
      const student = await getStudentByNumber(update.student_number);
      await upsertScore({
        f_student_uuid: student.student_uuid,
        update_field: scoreField,
        score_value: update.score_value,
      });
      success++;
    } catch (error) {
      console.error(`Failed to update score for ${update.student_number}:`, error);
      failed++;
    }
  }
  
  return { success, failed };
}

// Validate test weights sum to 1.0
export function validateWeights(weights: Record<string, string>): boolean {
  const sum = Object.values(weights).reduce(
    (acc, weight) => acc + parseFloat(weight),
    0
  );
  return Math.abs(sum - 1.0) < 0.0001; // Allow small floating point errors
}
