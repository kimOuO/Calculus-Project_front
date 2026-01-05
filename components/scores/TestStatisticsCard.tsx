'use client';

import { useEffect } from 'react';
import type { TestStatistics, ScoreField } from '@/types';

interface TestStatisticsCardProps {
  semester: string;
  scoreField: ScoreField | 'score_total';
  excludeEmpty?: boolean;
  onFetch: (data: {
    score_semester: string;
    score_field: ScoreField | 'score_total';
    exclude_empty?: boolean;
  }) => Promise<TestStatistics>;
  statistics: TestStatistics | null;
  isLoading: boolean;
  error: string | null;
}

const FIELD_LABELS: Record<ScoreField | 'score_total', string> = {
  score_quiz1: '第一次小考',
  score_midterm: '期中考',
  score_quiz2: '第二次小考',
  score_finalexam: '期末考',
  score_total: '总分',
};

export function TestStatisticsCard({
  semester,
  scoreField,
  excludeEmpty = true,
  onFetch,
  statistics,
  isLoading,
  error,
}: TestStatisticsCardProps) {
  useEffect(() => {
    if (semester && scoreField) {
      onFetch({
        score_semester: semester,
        score_field: scoreField,
        exclude_empty: excludeEmpty,
      });
    }
  }, [semester, scoreField, excludeEmpty]);

  if (!semester) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">请选择学期查看统计</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">
          {FIELD_LABELS[scoreField]} 统计
        </h3>
        <p className="text-sm text-blue-100 mt-1">
          学期：{semester}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Count */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">参与人数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.total_count}
                </p>
              </div>
            </div>
          </div>

          {/* Average */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">平均分</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.average.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Median */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">中位数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.median.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {excludeEmpty && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              ℹ️ 统计数据已排除未填写成绩的学生
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
