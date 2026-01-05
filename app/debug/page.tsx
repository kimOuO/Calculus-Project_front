'use client';

import { useState } from 'react';
import { listStudents } from '@/services';
import type { ApiError } from '@/types';

export default function DebugPage() {
  const [rawResult, setRawResult] = useState<any>(null);
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`]);
    console.log(message);
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    setRawResult(null);
    setParsedResult(null);
    setLogs([]);

    try {
      addLog('開始測試 API...');
      addLog('使用 services 層調用 listStudents()');
      addLog('API Endpoint: Student_MetadataWriter/read');
      
      // ✅ 正確：透過 services 層調用
      const students = await listStudents({});

      addLog(`✅ API 調用成功`);
      addLog(`回應類型: ${typeof students}`);
      addLog(`資料筆數: ${students.length}`);
      
      setRawResult({ data: students, count: students.length });
      setParsedResult(students);
      addLog('✅ 資料解析完成');
    } catch (err: any) {
      const apiError = err as ApiError;
      addLog(`❌ 錯誤: ${apiError.message}`);
      addLog(`錯誤代碼: ${apiError.code}`);
      if (apiError.details) {
        addLog(`錯誤詳情: ${JSON.stringify(apiError.details)}`);
      }
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔧 API 調試工具</h1>

        <div className="mb-6 space-x-4">
          <button
            onClick={testDirectAPI}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? '測試中...' : '🚀 測試直接 API 調用'}
          </button>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="mb-6 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm">
            <h2 className="text-lg font-semibold mb-2 text-white">📋 執行日誌</h2>
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-3">❌ 錯誤</h2>
            <div className="space-y-2">
              <p className="text-red-700">
                <strong>訊息:</strong> {error.message}
              </p>
              {error.code && (
                <p className="text-red-700">
                  <strong>代碼:</strong> {error.code}
                </p>
              )}
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-red-800 font-semibold">
                完整錯誤 (點擊展開)
              </summary>
              <pre className="mt-2 p-3 bg-red-100 rounded overflow-auto text-xs">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Parsed Result */}
        {parsedResult && (
          <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-3">
              ✅ 解析後的數據
            </h2>
            <div className="space-y-2 mb-4">
              <p className="text-green-700">
                <strong>資料類型:</strong> {Array.isArray(parsedResult) ? '學生列表' : '單一物件'}
              </p>
              <p className="text-green-700">
                <strong>資料筆數:</strong> {Array.isArray(parsedResult) ? parsedResult.length : 1}
              </p>
            </div>
            <details>
              <summary className="cursor-pointer text-green-800 font-semibold">
                完整數據 (點擊展開)
              </summary>
              <pre className="mt-2 p-3 bg-green-100 rounded overflow-auto text-xs max-h-96">
                {JSON.stringify(parsedResult, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Raw Response */}
        {rawResult && (
          <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              📦 資料摘要
            </h2>
            <div className="space-y-2 mb-4">
              <p className="text-blue-700">
                <strong>筆數:</strong> {rawResult.count}
              </p>
              <p className="text-blue-700">
                <strong>資料來源:</strong> services/api/studentApi
              </p>
            </div>
            <details>
              <summary className="cursor-pointer text-blue-800 font-semibold">
                完整摘要 (點擊展開)
              </summary>
              <pre className="mt-2 p-3 bg-blue-100 rounded overflow-auto text-xs">
                {JSON.stringify(rawResult, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h2 className="text-xl font-semibold text-yellow-800 mb-3">
            💡 使用說明
          </h2>
          <ul className="list-disc list-inside space-y-2 text-yellow-700">
            <li>點擊按鈕測試與後端的連接</li>
            <li>查看執行日誌了解調用過程</li>
            <li>如果成功，會顯示學生數據</li>
            <li>如果失敗，會顯示詳細的錯誤訊息</li>
            <li>
              確保後端運行在{' '}
              <code className="bg-yellow-100 px-2 py-1 rounded">
                http://localhost:8000
              </code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
