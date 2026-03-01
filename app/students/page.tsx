'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  StudentListWithActions,
  CreateStudentModal,
  EditStudentModal,
  Button,
  LoadingSpinner,
  SemesterSelect,
} from '@/components';
import { UploadStudentsModal } from '@/components/students/UploadStudentsModal';
import { UpdateStatusModal } from '@/components/students/UpdateStatusModal';
import {
  useStudents,
  useDeleteStudent,
  useCreateStudent,
  useUpdateStudent,
  useUploadStudents,
  useExportStudents,
  useUpdateStudentStatus,
} from '@/hooks';
import type { Student, CreateStudentRequest, UpdateStudentRequest } from '@/types';

export default function StudentsPage() {
  const [semester, setSemester] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const { students, isLoading, isError, error, refetch } = useStudents(semester);
  const { remove: deleteStudent } = useDeleteStudent();
  const { create: createStudent, isLoading: isCreating, error: createError } = useCreateStudent();
  const { update: updateStudent, isLoading: isUpdating, error: updateError } = useUpdateStudent();
  const { upload: uploadStudents, status: uploadStatus, error: uploadError } = useUploadStudents();
  const { exportExcel, status: exportStatus } = useExportStudents();
  const { update: updateStatus, status: updateStatusState, error: updateStatusError } = useUpdateStudentStatus();

  const handleCreateSubmit = async (data: CreateStudentRequest) => {
    await createStudent(data);
    refetch();
    setIsCreateModalOpen(false);
  };

  const handleUpdateSubmit = async (data: UpdateStudentRequest) => {
    await updateStudent(data);
    refetch();
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`確定要刪除學生 ${student.student_name} (${student.student_number}) 嗎？\n\n此操作將同時刪除該學生的所有成績記錄。`)) {
      return;
    }

    try {
      await deleteStudent(student.student_uuid);
      refetch();
    } catch (err) {
      alert('刪除失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  const handleUploadSubmit = async (file: File, uploadSemester: string) => {
    const result = await uploadStudents(file, uploadSemester);
    refetch();
    return result;
  };

  const handleExport = async () => {
    if (!semester) {
      alert('請先選擇學期');
      return;
    }

    try {
      await exportExcel({ student_semester: semester });
    } catch (err) {
      alert('導出失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  const handleStatusUpdate = (student: Student) => {
    setSelectedStudent(student);
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = async (studentUuid: string, status: string) => {
    await updateStatus(studentUuid, status as any);
    refetch();
    setIsStatusModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
              >
                ← 返回首頁
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">學生管理</h1>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              新增學生
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 max-w-xs">
              <SemesterSelect
                value={semester}
                onChange={setSemester}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setSemester('')}>
                清除篩選
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsUploadModalOpen(true)}
              >
                📤 批量上傳
              </Button>
              <Button
                variant="secondary"
                onClick={handleExport}
                disabled={!semester || exportStatus === 'loading'}
              >
                {exportStatus === 'loading' ? '導出中...' : '📥 導出報表'}
              </Button>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <div className="p-6 text-center">
              <p className="text-red-600">{error?.message || '載入失敗'}</p>
              <Button className="mt-4" onClick={() => refetch()}>
                重試
              </Button>
            </div>
          ) : (
            <>
              <div className="p-4 border-b bg-gray-50">
                <p className="text-sm text-gray-600">
                  共 {students.length} 位學生
                </p>
              </div>
              <StudentListWithActions
                students={students}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
                showScoresLink={true}
              />
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={isCreating}
        error={createError?.message}
      />

      {/* Edit Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleUpdateSubmit}
        isSubmitting={isUpdating}
        error={updateError?.message}
        student={selectedStudent}
      />

      {/* Upload Modal */}
      <UploadStudentsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        isSubmitting={uploadStatus === 'loading'}
        error={uploadError}
        defaultSemester={semester}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onSubmit={handleStatusSubmit}
        isSubmitting={updateStatusState === 'loading'}
        error={updateStatusError}
      />
    </div>
  );
}
