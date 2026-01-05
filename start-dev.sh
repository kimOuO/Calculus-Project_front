#!/bin/bash

# Calculus OOM Frontend - Quick Start Script

set -e

echo "=========================================="
echo "Calculus OOM Frontend - 快速啟動"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝"
    echo ""
    echo "請先安裝 Node.js (>= 18.x):"
    echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo ""
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安裝"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# Navigate to front directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 安裝依賴套件..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  創建環境變數檔案..."
    cp .env.example .env
    echo "✅ .env 已創建 (使用預設配置)"
    echo ""
fi

echo "=========================================="
echo "🚀 啟動開發伺服器..."
echo "=========================================="
echo ""
echo "應用程式將在 http://localhost:3000 啟動"
echo ""
echo "按 Ctrl+C 停止伺服器"
echo ""

# Start development server
npm run dev
