'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Input } from '@/components/Input';
import type { ScoreField, DiagramFormat } from '@/types';

interface GenerateDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  semester: string;
  onGenerate: (data: {
    test_semester: string;
    score_field: ScoreField;
    bins?: { type: 'fixed_width'; width: number };
    title?: string;
    format?: DiagramFormat;
  }) => Promise<string>;
  isGenerating: boolean;
  error: string | null;
  imageUrl: string | null;
  onDownload: (filename: string) => void;
}

const SCORE_FIELD_OPTIONS: { value: ScoreField; label: string }[] = [
  { value: 'score_quiz1', label: '第一次小考' },
  { value: 'score_midterm', label: '期中考' },
  { value: 'score_quiz2', label: '第二次小考' },
  { value: 'score_finalexam', label: '期末考' },
];

const FORMAT_OPTIONS: { value: DiagramFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
];

export function GenerateDiagramModal({
  isOpen,
  onClose,
  semester,
  onGenerate,
  isGenerating,
  error,
  imageUrl,
  onDownload,
}: GenerateDiagramModalProps) {
  const [scoreField, setScoreField] = useState<ScoreField>('score_midterm');
  const [binWidth, setBinWidth] = useState<number>(10);
  const [title, setTitle] = useState<string>('');
  const [format, setFormat] = useState<DiagramFormat>('png');

  useEffect(() => {
    if (isOpen && semester) {
      const fieldLabel = SCORE_FIELD_OPTIONS.find(opt => opt.value === scoreField)?.label || '';
      setTitle(`${semester} ${fieldLabel} 分数分布`);
    }
  }, [isOpen, semester, scoreField]);

  const handleGenerate = async () => {
    if (!semester) {
      alert('请先选择学期');
      return;
    }

    await onGenerate({
      test_semester: semester,
      score_field: scoreField,
      bins: {
        type: 'fixed_width',
        width: binWidth,
      },
      title: title || undefined,
      format,
    });
  };

  const handleDownload = () => {
    const fieldLabel = SCORE_FIELD_OPTIONS.find(opt => opt.value === scoreField)?.label || scoreField;
    const filename = `${semester}_${fieldLabel}_分布图.${format}`;
    onDownload(filename);
  };

  const handleClose = () => {
    setScoreField('score_midterm');
    setBinWidth(10);
    setTitle('');
    setFormat('png');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="生成成绩分布图"
      size="lg"
    >
      <div className="space-y-4">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium mb-1">
                学期：{semester || '未选择'}
              </p>
              <p className="text-sm text-blue-700">
                生成的分布图将自动上传并关联到对应考试
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        {!imageUrl && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                考试类型 <span className="text-red-500">*</span>
              </label>
              <Select
                value={scoreField}
                onChange={(e) => setScoreField(e.target.value as ScoreField)}
                options={SCORE_FIELD_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                级距宽度
              </label>
              <Input
                type="number"
                value={binWidth}
                onChange={(e) => setBinWidth(Number(e.target.value))}
                min={1}
                max={50}
                placeholder="默认 10"
              />
              <p className="text-sm text-gray-500 mt-1">
                分数区间的宽度，例如：10 表示 0-10, 10-20, ...
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图表标题
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="自动生成标题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片格式
              </label>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value as DiagramFormat)}
                options={FORMAT_OPTIONS}
              />
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <img
                src={imageUrl}
                alt="Score Distribution"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={handleDownload}
              >
                📥 下载图片
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setScoreField('score_midterm');
                  setBinWidth(10);
                  setTitle('');
                  setFormat('png');
                }}
              >
                重新生成
              </Button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isGenerating}
          >
            {imageUrl ? '关闭' : '取消'}
          </Button>
          {!imageUrl && (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !semester}
            >
              {isGenerating ? '生成中...' : '生成分布图'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
