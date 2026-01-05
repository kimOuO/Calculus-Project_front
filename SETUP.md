# 前端專案設置指南

## 前置要求

在開始之前，請確保已安裝：

- **Node.js** >= 18.x (推薦使用最新的 LTS 版本)
- **npm** >= 9.x (通常隨 Node.js 一起安裝)

### 安裝 Node.js 和 npm (Ubuntu/Debian)

```bash
# 使用 NodeSource 安裝最新 LTS 版本
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 驗證安裝
node --version
npm --version
```

## 快速開始

### 1. 進入專案目錄

```bash
cd /home/mitlab/project/front
```

### 2. 安裝依賴套件

```bash
npm install
```

這將安裝 `package.json` 中定義的所有依賴項，包括：
- Next.js 14 (React 框架)
- React 18
- TypeScript
- Axios (HTTP 客戶端)
- Tailwind CSS (樣式框架)
- ESLint & Prettier (程式碼品質工具)

### 3. 環境變數設定

已經創建了 `.env` 檔案，預設配置為：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata
```

**注意**: 如果您的後端 API 運行在不同的位址或端口，請修改此值。

### 4. 啟動開發伺服器

```bash
npm run dev
```

開發伺服器將在 http://localhost:3000 啟動

### 5. 開啟瀏覽器

訪問 http://localhost:3000 查看應用程式

## 可用的 npm 指令

```bash
# 開發模式 (熱重載)
npm run dev

# 生產環境構建
npm run build

# 啟動生產伺服器 (需先執行 build)
npm start

# 執行 ESLint 檢查
npm run lint

# TypeScript 類型檢查
npm run type-check
```

## 專案結構

```
front/
├── app/                    # Next.js App Router (路由與頁面)
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首頁
│   ├── globals.css        # 全域樣式
│   ├── students/          # 學生管理頁面
│   ├── scores/            # 成績管理頁面
│   └── tests/             # 考試管理頁面
├── components/            # UI 元件
│   ├── Button.tsx         # 按鈕元件
│   ├── Input.tsx          # 輸入框元件
│   ├── Table.tsx          # 表格元件
│   ├── Modal.tsx          # 對話框元件
│   └── ...                # 其他元件
├── hooks/                 # React Hooks
│   ├── base/              # 基礎 hooks
│   │   ├── useAsync.ts
│   │   ├── usePagination.ts
│   │   └── ...
│   └── feature/           # 功能 hooks
│       ├── useStudents.ts
│       ├── useScores.ts
│       └── ...
├── services/              # API 服務層
│   ├── clients/           # HTTP 客戶端
│   ├── api/               # API 適配器
│   │   ├── studentApi.ts
│   │   ├── scoreApi.ts
│   │   └── ...
│   └── workflows/         # 業務流程
├── types/                 # TypeScript 類型定義
│   ├── common.ts
│   ├── student.ts
│   ├── score.ts
│   └── ...
├── config/                # 配置文件
│   ├── api.ts            # API 配置
│   └── constants.ts      # 常數定義
├── package.json          # 專案依賴
├── tsconfig.json         # TypeScript 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── next.config.mjs       # Next.js 配置
```

## 功能頁面

### 首頁 (/)
- 系統歡迎頁面
- 導航至各功能模組

### 學生管理 (/students)
- 查看學生列表
- 新增學生
- 按學期篩選

### 成績管理 (/scores)
- 查看成績記錄
- 按學生篩選

### 考試管理 (/tests)
- 查看考試列表
- 按學期篩選

## 開發指南

### 添加新頁面

1. 在 `app/` 目錄下創建新資料夾和 `page.tsx`
2. Next.js 會自動將其識別為路由

### 添加新 API

1. 在 `types/` 中定義 TypeScript 類型
2. 在 `services/api/` 中創建 API 函數
3. 在 `hooks/feature/` 中創建自訂 hook
4. 在元件中使用 hook

### 程式碼風格

- 使用 ESLint 進行程式碼檢查
- 使用 Prettier 進行程式碼格式化
- TypeScript strict 模式已啟用

## 疑難排解

### 端口已被佔用

如果 3000 端口被佔用，可以指定其他端口：

```bash
PORT=3001 npm run dev
```

### 安裝依賴失敗

清除快取並重新安裝：

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript 錯誤

執行類型檢查：

```bash
npm run type-check
```

## 生產部署

### 1. 構建生產版本

```bash
npm run build
```

### 2. 啟動生產伺服器

```bash
npm start
```

生產伺服器將在 http://localhost:3000 啟動

### 環境變數

確保在生產環境中正確設置 `.env` 或環境變數：

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api/v0.1/Calculus_oom/Calculus_metadata
```

## 架構規範

本專案嚴格遵循 `frontend_architecture_prompt.md` 中定義的架構規範：

- **分層架構**: app → components → hooks → services
- **單向依賴**: 下層不能引用上層
- **Server/Client 組件**: 適當使用 "use client" 指令
- **類型安全**: 完整的 TypeScript 類型定義

## 技術棧

- **框架**: Next.js 14 (App Router)
- **UI 庫**: React 18
- **語言**: TypeScript (strict mode)
- **樣式**: Tailwind CSS
- **HTTP 客戶端**: Axios
- **程式碼品質**: ESLint + Prettier

## 後端整合

前端與後端 API 的整合遵循 `FRONTEND_to_backend_API_RULES.md` 文檔：

- 所有 API 使用 POST 方法
- 統一的回應格式
- 完整的錯誤處理

## 支援

如有問題，請參考：
- Next.js 文檔: https://nextjs.org/docs
- React 文檔: https://react.dev
- TypeScript 文檔: https://www.typescriptlang.org/docs

## License

MIT
