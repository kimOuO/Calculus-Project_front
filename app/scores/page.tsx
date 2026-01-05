'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AllScoresTable,
  BatchUpdateScoresModal,
  Button,
  LoadingSpinner,
  Input,
  Select,
  SemesterSelect,
} from '@/components';
import { GenerateDiagramModal } from '@/components/scores/GenerateDiagramModal';
import { TestStatisticsCard } from '@/components/scores/TestStatisticsCard';
import {
  useScoresWithStudents,
  useCalculateFinalScores,
  useTestStatisticsLazy,
  useUpdateScore,
  useGenerateScoreDiagram,
} from '@/hooks';
import type { ScoreField } from '@/types';

export default function ScoresPage() {
  const router = useRouter();
  const [semester, setSemester] = useState('');
  const [passingScore, setPassingScore] = useState('60');
  const [selectedTest, setSelectedTest] = useState<ScoreField | ''>('');
  const [isBatchUpdateModalOpen, setIsBatchUpdateModalOpen] = useState(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);
  const [batchUpdateField, setBatchUpdateField] = useState<ScoreField>('score_quiz1');
  const [statsData, setStatsData] = useState<any>(null);

  const { scores, isLoading, isError, error, refetch } =
    useScoresWithStudents(semester);

  const { calculate: calculateFinal, isLoading: isCalculating } =
    useCalculateFinalScores();

  const { getStats, status: statsStatus, error: statsError } = useTestStatisticsLazy();
  const { update: updateScore } = useUpdateScore();
  const { 
    generate: generateDiagram, 
    download: downloadDiagram,
    reset: resetDiagram,
    status: diagramStatus, 
    error: diagramError, 
    imageUrl: diagramUrl 
  } = useGenerateScoreDiagram();

  const handleFetchStats = async (data: any) => {
    const result = await getStats(data);
    setStatsData(result);
    return result;
  };

  const handleCalculateFinal = async () => {
    if (!semester) {
      alert('請先輸入學年學期');
      return;
    }

    const score = parseInt(passingScore);
    if (isNaN(score) || score < 0 || score > 100) {
      alert('及格分數必須在 0-100 之間');
      return;
    }

    if (!confirm(`確定要計算 ${semester} 學期的期末總成績嗎？\n及格分數: ${score}`)) {
      return;
    }

    try {
      const result = await calculateFinal({
        test_semester: semester,
        passing_score: score,
      });
      alert(`成功計算 ${result.updated_count} 位學生的總成績`);
      refetch();
    } catch (err) {
      alert('計算失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  const handleGenerateDiagram = () => {
    if (!semester) {
      alert('請先選擇學期');
      return;
    }
    setIsDiagramModalOpen(true);
  };

  const handleCloseDiagramModal = () => {
    setIsDiagramModalOpen(false);
    resetDiagram();
  };

  const handleStudentClick = (studentNumber: string) => {
    router.push(`/students/${studentNumber}/scores`);
  };

  const handleBatchUpdate = async (updates: Array<{ f_student_uuid: string; update_field: ScoreField; score_value: string }>) => {
    try {
      // Update scores one by one
      for (const update of updates) {
        await updateScore(update);
      }
      alert(`成功更新 ${updates.length} 位學生的成績`);
      refetch();
    } catch (err) {
      throw new Error('批量更新失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  const handleOpenBatchUpdate = (field: ScoreField) => {
    if (!semester) {
      alert('請先選擇學期');
      return;
    }
    if (scores.length === 0) {
      alert('沒有可更新的成績記錄');
      return;
    }
    setBatchUpdateField(field);
    setIsBatchUpdateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← 返回首頁
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">成績總覽</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Test Statistics */}
        {semester && selectedTest && statsData && (
          <TestStatisticsCard
            semester={semester}
            scoreField={selectedTest as ScoreField}
            excludeEmpty={true}
            onFetch={handleFetchStats}
            statistics={statsData}
            isLoading={statsStatus === 'loading'}
            error={statsError?.message || null}
          />
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Filter */}
            <div>
              <h2 className="text-lg font-semibold mb-4">篩選條件</h2>
              <div className="space-y-4">
                <SemesterSelect
                  value={semester}
                  onChange={setSemester}
                />
                <Button
                  variant="secondary"
                  onClick={() => setSemester('')}
                  className="w-full"
                >
                  清除篩選
                </Button>
              </div>
            </div>

            {/* Right: Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-4">操作</h2>
              <div className="space-y-4">
                {/* Calculate Final */}
                <div className="flex gap-2">
                  <Input
                    label="及格分數"
                    type="number"
                    min="0"
                    max="100"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-end">
                    <Button
                      onClick={handleCalculateFinal}
                      disabled={isCalculating || !semester}
                    >
                      {isCalculating ? '計算中...' : '計算期末總成績'}
                    </Button>
                  </div>
                </div>

                {/* View Statistics */}
                <div className="flex gap-2">
                  <Select
                    label="考試項目"
                    value={selectedTest}
                    onChange={(e) =>
                      setSelectedTest(e.target.value as ScoreField | '')
                    }
                    options={[
                      { value: '', label: '請選擇' },
                      { value: 'score_quiz1', label: '第一次小考' },
                      { value: 'score_midterm', label: '期中考' },
                      { value: 'score_quiz2', label: '第二次小考' },
                      { value: 'score_finalexam', label: '期末考' },
                    ]}
                    className="flex-1"
                  />
                  <div className="flex items-end">
                    <Button
                      variant="secondary"
                      onClick={handleGenerateDiagram}
                      disabled={!semester}
                    >
                      生成分布圖
                    </Button>
                  </div>
                </div>

                {/* Batch Update Scores */}
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-2">批量更新成績</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenBatchUpdate('score_quiz1')}
                      disabled={!semester || scores.length === 0}
                    >
                      第一次小考
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenBatchUpdate('score_midterm')}
                      disabled={!semester || scores.length === 0}
                    >
                      期中考
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenBatchUpdate('score_quiz2')}
                      disabled={!semester || scores.length === 0}
                    >
                      第二次小考
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenBatchUpdate('score_finalexam')}
                      disabled={!semester || scores.length === 0}
                    >
                      期末考
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scores Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-12">
              <LoadingSpinner />
            </div>
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
                <p className="text-sm text-gray-600">共 {scores.length} 筆成績記錄</p>
              </div>
              <AllScoresTable
                scores={scores}
                onStudentClick={handleStudentClick}
              />
            </>
          )}
        </div>
      </div>

      {/* Batch Update Modal */}
      <BatchUpdateScoresModal
        isOpen={isBatchUpdateModalOpen}
        onClose={() => setIsBatchUpdateModalOpen(false)}
        onSubmit={handleBatchUpdate}
        scores={scores}
        field={batchUpdateField}
      />

      {/* Generate Diagram Modal */}
      <GenerateDiagramModal
        isOpen={isDiagramModalOpen}
        onClose={handleCloseDiagramModal}
        semester={semester}
        onGenerate={generateDiagram}
        isGenerating={diagramStatus === 'loading'}
        error={diagramError}
        imageUrl={diagramUrl}
        onDownload={downloadDiagram}
      />
    </div>
  );
}
