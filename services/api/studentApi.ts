import { request } from '@/services/clients';
import { API_ENDPOINTS, API_CONFIG } from '@/config';
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentFilters,
  StudentStatusStats,
  UpdateStudentStatusRequest,
  UploadStudentsExcelResponse,
  ExportStudentsExcelRequest,
} from '@/types';

// Create student
export async function createStudent(
  data: CreateStudentRequest
): Promise<Student> {
  return request<Student>(API_ENDPOINTS.student.create, data);
}

// List students with optional filters
export async function listStudents(
  filters?: StudentFilters
): Promise<Student[]> {
  return request<Student[]>(API_ENDPOINTS.student.read, filters || {});
}

// Get single student by UUID
export async function getStudent(studentUuid: string): Promise<Student> {
  const students = await request<Student[]>(API_ENDPOINTS.student.read, {
    student_uuid: studentUuid,
  });
  
  if (!students || students.length === 0) {
    throw {
      message: 'Student not found',
      code: 404,
    };
  }
  
  return students[0];
}

// Get single student by student number
export async function getStudentByNumber(studentNumber: string): Promise<Student> {
  const students = await request<Student[]>(API_ENDPOINTS.student.read, {
    student_number: studentNumber,
  });
  
  if (!students || students.length === 0) {
    throw {
      message: 'Student not found',
      code: 404,
    };
  }
  
  return students[0];
}

// Update student
export async function updateStudent(
  data: UpdateStudentRequest
): Promise<Student> {
  return request<Student>(API_ENDPOINTS.student.update, data);
}

// Delete student
export async function deleteStudent(studentUuid: string): Promise<void> {
  await request(API_ENDPOINTS.student.delete, {
    student_uuid: studentUuid,
  });
}

// Update student status
export async function updateStudentStatus(
  data: UpdateStudentStatusRequest
): Promise<Student> {
  return request<Student>(API_ENDPOINTS.student.status, data);
}

// Upload students from Excel file
export async function uploadStudentsExcel(
  file: File
): Promise<UploadStudentsExcelResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${API_CONFIG.baseURL}${API_ENDPOINTS.student.uploadExcel}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw {
      message: error.detail || 'Failed to upload Excel file',
      code: response.status,
    };
  }

  const result = await response.json();
  return result.data;
}

// Export students scores to Excel file
export async function exportStudentsScoresExcel(
  data: ExportStudentsExcelRequest
): Promise<Blob> {
  const response = await fetch(
    `${API_CONFIG.baseURL}${API_ENDPOINTS.student.exportExcel}`,
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
      message: error.detail || 'Failed to export Excel file',
      code: response.status,
    };
  }

  return response.blob();
}

// Get student status statistics
export async function getStudentStatusStats(
  semester: string
): Promise<StudentStatusStats> {
  const students = await listStudents({ student_semester: semester });
  
  const stats: StudentStatusStats = {
    修業中: 0,
    修業完畢: 0,
    被當: 0,
    二退: 0,
  };
  
  students.forEach((student) => {
    stats[student.student_status]++;
  });
  
  return stats;
}
