'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TestListWithActions,
  CreateTestModal,
  SetWeightsModal,
  UploadTestFileModal,
  Button,
  LoadingSpinner,
  SemesterSelect,
} from '@/components';
import { useTests, useCreateTest, useSetTestWeights, useUploadFile } from '@/hooks';
import type { CreateTestRequest, Test, AssetType } from '@/types';

export default function TestsPage() {
  const [semester, setSemester] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const { tests, isLoading, isError, error, refetch } = useTests(semester);
  const { create: createTest } = useCreateTest();
  const { setWeights } = useSetTestWeights();
  const { upload: uploadFile } = useUploadFile();

  const handleCreateTest = async (data: CreateTestRequest) => {
    await createTest(data);
    refetch();
  };

  const handleSetWeights = async (weights: Record<string, string>) => {
    if (!semester) {
      alert('請先選擇學期');
      return;
    }

    console.log('Setting weights:', { test_semester: semester, weights });
    
    try {
      const result = await setWeights({
        test_semester: semester,
        weights,
      });
      console.log('Set weights result:', result);
      refetch();
    } catch (err) {
      console.error('Set weights error:', err);
      throw err;
    }
  };

  const handleUploadClick = (test: Test) => {
    setSelectedTest(test);
    setIsUploadModalOpen(true);
  };

  const handleUploadFile = async (assetType: AssetType, files: File[]) => {
    if (!selectedTest) return;
    
    try {
      await uploadFile({
        test_uuid: selectedTest.test_uuid,
        asset_type: assetType,
        files: files,
      });
      
      setIsUploadModalOpen(false);
      setSelectedTest(null);
      refetch();
    } catch (error) {
      throw error; // Let modal handle the error display
    }
  };

  const filteredTests = semester
    ? tests.filter((test) => test.test_semester === semester)
    : tests;

  const testNames = filteredTests.map((test) => test.test_name);

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
              <h1 className="text-3xl font-bold text-gray-900">考試管理</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsWeightsModalOpen(true)}
                disabled={!semester || filteredTests.length === 0}
              >
                設定權重
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                新增考試
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-xs">
              <SemesterSelect
                value={semester}
                onChange={setSemester}
              />
            </div>
            <Button variant="secondary" onClick={() => setSemester('')}>
              清除篩選
            </Button>
          </div>
        </div>

        {/* Test List */}
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
                  共 {filteredTests.length} 場考試
                </p>
              </div>
              <TestListWithActions 
                tests={filteredTests} 
                onUpload={handleUploadClick}
              />
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <CreateTestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTest}
      />

      {/* Set Weights Modal */}
      <SetWeightsModal
        isOpen={isWeightsModalOpen}
        onClose={() => setIsWeightsModalOpen(false)}
        onSubmit={handleSetWeights}
        semester={semester}
        testNames={testNames}
      />

      {/* Upload Test File Modal */}
      {selectedTest && (
        <UploadTestFileModal
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            setSelectedTest(null);
          }}
          onSubmit={handleUploadFile}
          test={selectedTest}
        />
      )}
    </div>
  );
}
