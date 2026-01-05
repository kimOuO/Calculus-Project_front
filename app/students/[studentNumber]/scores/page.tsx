'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  StudentScoreCard,
  UpdateScoreModal,
  Button,
  LoadingSpinner,
} from '@/components';
import { useStudentScores, useUpdateStudentScore } from '@/hooks';
import { getStudentByNumber } from '@/services/api';
import type { ScoreField } from '@/types';

export default function StudentScoresPage() {
  const params = useParams();
  const studentNumber = params.studentNumber as string;

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');

  const { score, isLoading, isError, error, refetch } = useStudentScores(
    studentNumber
  );

  const { updateScore } = useUpdateStudentScore(() => {
    refetch();
  });

  // Fetch student info
  React.useEffect(() => {
    getStudentByNumber(studentNumber).then((student) => {
      setStudentName(student.student_name);
    });
  }, [studentNumber]);

  const handleUpdateScore = async (field: ScoreField, value: string) => {
    if (!score) return;

    await updateScore({
      f_student_uuid: score.f_student_uuid,
      update_field: field,
      score_value: value,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">載入失敗</h2>
          <p className="text-gray-600 mb-4">{error?.message || '未知錯誤'}</p>
          <Button onClick={() => refetch()}>重試</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/students"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← 返回學生列表
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              學生成績 - {studentName || studentNumber}
            </h1>
            <Button onClick={() => setIsUpdateModalOpen(true)}>
              更新成績
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StudentScoreCard
          score={score}
          studentName={studentName}
          studentNumber={studentNumber}
        />
      </div>

      {/* Update Modal */}
      <UpdateScoreModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateScore}
        currentScores={score}
        studentName={studentName}
      />
    </div>
  );
}
