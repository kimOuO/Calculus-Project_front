'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';

interface SetWeightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (weights: Record<string, string>) => Promise<void>;
  semester: string;
  testNames: string[];
}

export function SetWeightsModal({
  isOpen,
  onClose,
  onSubmit,
  semester,
  testNames,
}: SetWeightsModalProps) {
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize weights
    const initialWeights: Record<string, string> = {};
    testNames.forEach((name) => {
      initialWeights[name] = '';
    });
    setWeights(initialWeights);
  }, [testNames]);

  const handleWeightChange = (testName: string, value: string) => {
    setWeights((prev) => ({ ...prev, [testName]: value }));
  };

  const calculateTotal = () => {
    return Object.values(weights).reduce((sum, weight) => {
      const num = parseFloat(weight);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Modal handleSubmit called with weights:', weights);

    // Validate all weights are filled
    const emptyWeights = Object.entries(weights).filter(
      ([_, weight]) => !weight || weight.trim() === ''
    );
    if (emptyWeights.length > 0) {
      setError('請填寫所有考試的權重');
      return;
    }

    // Validate weights sum to 1.0
    const total = calculateTotal();
    if (Math.abs(total - 1.0) > 0.0001) {
      setError(`權重總和必須為 1.0，目前為 ${total.toFixed(4)}`);
      return;
    }

    // Validate each weight is between 0 and 1
    for (const [name, weight] of Object.entries(weights)) {
      const num = parseFloat(weight);
      if (isNaN(num) || num < 0 || num > 1) {
        setError(`${name} 的權重必須在 0-1 之間`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      console.log('Calling onSubmit with weights:', weights);
      await onSubmit(weights);
      console.log('onSubmit succeeded, closing modal');
      onClose();
    } catch (err) {
      console.error('onSubmit error:', err);
      setError(err instanceof Error ? err.message : '設定失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const total = calculateTotal();
  const totalColor =
    Math.abs(total - 1.0) < 0.0001
      ? 'text-green-600'
      : total > 1.0
      ? 'text-red-600'
      : 'text-yellow-600';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`設定考試權重 - ${semester}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          請為每場考試設定權重（0-1 之間），所有權重總和必須為 1.0
        </div>

        {testNames.map((testName) => (
          <Input
            key={testName}
            label={testName}
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={weights[testName] || ''}
            onChange={(e) => handleWeightChange(testName, e.target.value)}
            placeholder="例: 0.2"
            required
          />
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">權重總和:</span>
            <span className={`text-xl font-bold ${totalColor}`}>
              {total.toFixed(4)}
            </span>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '設定中...' : '設定權重'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
