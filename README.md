# 微積分成績管理系統 - 前端

基於 Next.js 14 開發的現代化微積分成績管理系統前端應用程式，提供完整的學生、成績、考試管理功能。

## 📋 專案介紹

這是一個專為教育機構設計的成績管理系統前端，主要用於微積分課程的學生成績追蹤和管理。系統採用現代化的 Web 技術棧，提供直觀的使用者介面和完整的管理功能。

### 🎯 使用場景 (Use Cases)

#### 教師端功能
- **學生管理**: 新增、編輯、刪除學生資料，支援 Excel 批量匯入
- **成績管理**: 錄入各項考試成績（小考、期中考、期末考）
- **自動計算**: 根據設定的權重自動計算期末總成績
- **統計分析**: 查看班級成績統計（平均分、中位數等）
- **報表匯出**: 匯出學生成績為 Excel 格式

#### 管理功能
- **考試管理**: 創建考試、設定考試權重、管理考試狀態
- **成績總覽**: 查看全班成績概況，一目了然
- **學生狀態**: 自動更新學生修業狀態（修業中/修業完畢/被當/二退）

#### 具體應用情境
1. **學期初**: 批量匯入學生名單，創建各項考試
2. **考試後**: 快速錄入成績，系統自動統計分析
3. **期中檢視**: 查看學生學習進度和成績趨勢
4. **期末結算**: 設定權重，自動計算總成績，更新學生狀態
5. **成績公布**: 匯出成績單，提供給學生或行政單位

## 💻 系統需求

### 必備軟體
- **Docker** (推薦): 版本 20.10 以上
- **Node.js**: 版本 18 以上 (僅本地開發需要)
- **npm**: 版本 9 以上

### 後端依賴
- 後端 API 服務必須運行在 `localhost:8000`
- 確保後端 API 端點可正常訪問

## ⚙️ 環境變數配置

創建 `.env` 檔案並設定以下變數：

```bash
# 後端 API 基礎網址 (必填)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata

# Node.js 環境設定 (可選)
NODE_ENV=production
```

### 環境變數說明
- `NEXT_PUBLIC_API_BASE_URL`: 後端 API 的完整基礎網址，前端所有 API 請求都會使用此網址
- `NODE_ENV`: 運行環境，生產環境設為 `production`，開發環境設為 `development`

## 🚀 啟動方式

### 方式一：Docker 部署 (推薦)
```bash
# 1. 確保後端服務已啟動
docker ps | grep calculus

# 2. 一鍵建構並啟動前端
./docker-run.sh build-run

# 3. 健康檢查確認服務狀態
./health-check.sh

# 4. 訪問應用程式
# 前端: http://localhost:3000
# 後端: http://localhost:8000
```

### 方式二：本地開發
```bash
# 1. 安裝依賴
npm install

# 2. 確保 .env 檔案已配置
cp .env.example .env

# 3. 啟動開發伺服器
npm run dev

# 4. 瀏覽器訪問 http://localhost:3000
```

### 方式三：生產環境建構
```bash
# 建構生產版本
npm run build

# 啟動生產伺服器
npm start
```

## 🏗️ 專案架構

```
├── app/           # Next.js 頁面路由
├── components/    # React UI 組件
├── hooks/         # 自定義 React Hooks
├── services/      # API 服務層
├── types/         # TypeScript 類型定義
├── config/        # 配置檔案
├── prompt/        # API 文檔和架構規範
└── public/        # 靜態資源
```

## 🛠️ 技術棧
- **前端框架**: Next.js 14 (App Router)
- **開發語言**: TypeScript (strict mode)
- **UI 框架**: React 18
- **樣式**: Tailwind CSS
- **HTTP 客戶端**: Axios
- **容器化**: Docker
- **包管理**: npm

## 📖 相關文檔
- [快速啟動指南](./QUICK_START.md)
- [Docker 部署指南](./DOCKER_DEPLOYMENT.md)
- [API 對接規範](./prompt/FRONTEND_to_backend_API_RULES.md)

## 🔗 訪問地址
- **前端應用**: http://localhost:3000
- **後端 API**: http://localhost:8000

---

**開發版本**: v0.1.0 | **技術支援**: Docker + Next.js 14
