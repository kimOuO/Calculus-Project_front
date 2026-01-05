// Student model
export interface Student {
  student_uuid: string;
  student_name: string;
  student_number: string;
  student_semester: string;
  student_status: StudentStatus;
  student_created_at: string;
  student_updated_at: string;
}

// Student status enum
export type StudentStatus = '修業中' | '二退' | '被當' | '修業完畢';

// Create student request
export interface CreateStudentRequest {
  student_name: string;
  student_number: string;
  student_semester: string;
  student_status?: StudentStatus;
}

// Update student request
export interface UpdateStudentRequest {
  student_uuid: string;
  student_name?: string;
  student_number?: string;
  student_semester?: string;
  student_status?: StudentStatus;
}

// Student filters
export interface StudentFilters {
  student_uuid?: string;
  student_number?: string;
  student_semester?: string;
  student_status?: StudentStatus;
  student_name?: string;
}

// Student status statistics
export interface StudentStatusStats {
  修業中: number;
  修業完畢: number;
  被當: number;
  二退: number;
}

// Update student status request
export interface UpdateStudentStatusRequest {
  student_uuid: string;
  student_status: StudentStatus;
}

// Upload students Excel response
export interface UploadStudentsExcelResponse {
  created_count: number;
  error_count: number;
  created_students: string[];
  errors: string[];
}

// Export students Excel request
export interface ExportStudentsExcelRequest {
  student_semester: string;
}
