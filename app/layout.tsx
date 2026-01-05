import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calculus OOM - 微積分成績管理系統',
  description: '微積分成績管理系統 - 學生、成績、考試管理平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
