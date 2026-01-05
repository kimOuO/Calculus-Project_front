import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          微積分成績管理系統
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Calculus Out-of-Memory (OOM) Management System
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/students"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-4xl mb-4">👨‍🎓</div>
            <h2 className="text-2xl font-semibold mb-2">學生管理</h2>
            <p className="text-gray-600">查看和管理學生資料</p>
          </Link>

          <Link
            href="/scores"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2">成績管理</h2>
            <p className="text-gray-600">錄入和查詢成績資料</p>
          </Link>

          <Link
            href="/tests"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold mb-2">考試管理</h2>
            <p className="text-gray-600">管理考試和權重設定</p>
          </Link>
        </div>

        <div className="mt-12 text-gray-500 text-sm">
          <p>Version 0.1.0</p>
        </div>
      </div>
    </div>
  );
}
