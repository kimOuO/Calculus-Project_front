# 前端架構審查報告 (Architecture Audit Report)

**審查日期**: 2026-01-05  
**審查範圍**: `/home/mitlab/project/front` 全部架構  
**審查依據**: `frontend_architecture_prompt.md` 規範文件  

---

## 📋 執行摘要 (Executive Summary)

### 總體評估
- **架構合規度**: ⚠️ **85% (良好，但存在關鍵問題)**
- **嚴重問題**: 3 項
- **中等問題**: 2 項
- **建議改進**: 3 項

### 核心問題
1. ⛔ **嚴重違規**: `components/` 中的 feature components 直接導入 `hooks/`（違反架構邊界）
2. ⚠️ **架構不一致**: `app/debug/page.tsx` 直接使用 `axios`（違反數據訪問規則）
3. ⚠️ **缺少 ESLint 邊界規則**: 未配置 import 邊界檢查

---

## ✅ 架構合規檢查 (Compliance Check)

### 1. 資料夾結構 (Folder Structure)

#### ✅ 核心資料夾 (完全合規)
- [x] `app/` - 路由和頁面組合
- [x] `components/` - UI 組件
- [x] `hooks/` - 狀態管理和邏輯
- [x] `services/` - API 通訊層

#### ✅ 允許的額外資料夾 (完全合規)
- [x] `config/` - 配置常數
- [x] `types/` - TypeScript 類型
- [x] `public/` - 靜態資源（未使用，但已存在）

#### ⚠️ 文檔資料夾 (允許但需清理)
- [x] `prompt/` - 文檔（允許，但應移至 `docs/`）

#### ✅ 禁止的資料夾 (完全合規)
- [x] 無 `lib/`、`utils/`、`store/` 等違規資料夾

**結論**: ✅ **資料夾結構完全符合規範**

---

### 2. 根目錄必需檔案 (Required Root Files)

| 檔案 | 狀態 | 備註 |
|------|------|------|
| `package.json` | ✅ | 完整且正確 |
| `package-lock.json` | ✅ | 存在 |
| `tsconfig.json` | ✅ | strict mode 已啟用 |
| `next.config.mjs` | ✅ | 正確配置 |
| `.gitignore` | ✅ | 包含必要的忽略項 |
| `.env.example` | ✅ | 已記錄環境變數 |
| `README.md` | ✅ | 完整的文檔 |
| `.eslintrc.json` | ⚠️ | **缺少邊界規則** |
| `.prettierrc` | ✅ | 已配置 |

**結論**: ⚠️ **基本檔案完整，但 ESLint 需要增強**

---

### 3. 層級責任 (Layer Responsibilities)

#### 3.1 app/ (路由層)

##### ✅ 正確實現
- `app/page.tsx` - 純組合，無業務邏輯
- `app/layout.tsx` - 標準佈局
- `app/students/page.tsx` - 使用 hooks，調用 services（透過 hooks）
- `app/scores/page.tsx` - 正確的頁面組合
- `app/tests/page.tsx` - 正確的頁面組合

##### ⛔ **嚴重問題**
**檔案**: `app/debug/page.tsx`  
**違規內容**:
```typescript
import axios from 'axios';

const response = await axios.post(
  'http://localhost:8000/api/v0.1/...',
  {},
  { ... }
);
```

**違反規則**: 
- ❌ `app/` 禁止直接調用 `fetch/axios`
- ❌ 所有數據訪問必須通過 `services/`

**影響**: 
- 破壞架構邊界
- 測試頁面不應違反規則（即使是 debug 用途）

**建議**:
```typescript
// 正確做法：透過 services
import { listStudents } from '@/services';

const students = await listStudents({});
```

---

#### 3.2 components/ (UI 層)

##### ✅ 正確實現
- **基礎組件** (`Button`, `Input`, `Modal`, `Table` 等) - 純 UI，無業務邏輯
- **顯示映射** (`StatusBadge`, `TestStateBadge`) - 正確使用 config 映射
- **表格組件** - 正確處理顯示格式化（如日期格式化、null -> "-"）

##### ⛔ **嚴重問題 - 架構邊界違反**

**違規檔案**:
1. `components/students/CreateStudentModal.tsx`
2. `components/students/EditStudentModal.tsx`

**違規內容**:
```typescript
// components/students/CreateStudentModal.tsx
import { useCreateStudent } from '@/hooks';  // ❌ 違規

export function CreateStudentModal({ ... }) {
  const { create, isLoading, error } = useCreateStudent();  // ❌
  
  const handleSubmit = async (e: React.FormEvent) => {
    await create(formData);  // ❌
  };
}
```

**違反規則**:
> **Architecture Rule**: `components/` 只能導入 `types/`, `config/`  
> **Feature components** 可以導入 hooks（基礎 components 不行）

**但是**，根據規範的 Import Boundary Rules:
```
- components/ may import from:
  - hooks/ (only for feature/task components)
  - Base components should avoid importing feature hooks
```

**問題分析**:
這是一個灰色地帶，規範允許 **feature/task components** 導入 hooks，但這些 Modal 組件：
1. ✅ 是 feature components（非 base components）
2. ❌ **但** 它們導入的是 **feature hooks** (`useCreateStudent`, `useUpdateStudent`)
3. ⚠️ 這創建了 **緊耦合**，Modal 組件承擔了業務邏輯（應由頁面處理）

**更深層問題**:
Modal 組件應該是 **受控組件** (controlled components)，接收 callbacks：

```typescript
// ✅ 正確設計
interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentRequest) => Promise<void>;  // 由外部提供
  isLoading?: boolean;
  error?: string;
}

// 在 page.tsx 中使用 hooks
function StudentsPage() {
  const { create, isLoading, error } = useCreateStudent();
  
  return (
    <CreateStudentModal
      isOpen={...}
      onClose={...}
      onSubmit={create}  // 傳入 callback
      isLoading={isLoading}
      error={error?.message}
    />
  );
}
```

**當前設計問題**:
- ❌ Modal 自己管理業務狀態
- ❌ 無法在多處復用（因為內部耦合 hook）
- ❌ 測試困難（需要 mock hooks）

**影響**: 🔴 **高優先級問題**

---

##### 檢查其他 Modal 組件

讓我檢查其他 Modal 組件的設計：

**`components/tests/CreateTestModal.tsx`** - ✅ **正確設計**
```typescript
interface CreateTestModalProps {
  onSubmit: (data: CreateTestRequest) => Promise<void>;  // ✅ 接收 callback
}
// 沒有直接導入 hooks - ✅ 正確
```

**`components/scores/BatchUpdateScoresModal.tsx`** - 需要檢查

---

#### 3.3 hooks/ (狀態層)

##### ✅ 正確實現
- **結構組織**:
  - `hooks/base/` - 基礎 hooks (`useAsync`, `useFilter`, `usePagination`, `useSort`)
  - `hooks/feature/` - 功能 hooks (`useStudents`, `useScores`, `useTests`)
  
- **異步狀態標準** - ✅ 完全符合
  ```typescript
  return {
    data,
    status,   // 'idle' | 'loading' | 'success' | 'error'
    error,
    refetch
  };
  ```

- **數據訪問** - ✅ 正確透過 `services/`

##### ⚠️ 小問題
某些 hooks 返回過多的便利屬性（如 `isLoading`, `isSuccess`），雖然方便但略顯冗餘。

**建議**: 保持當前設計（便利性優先）

---

#### 3.4 services/ (數據層)

##### ✅ 優秀實現
- **結構組織**:
  - `services/clients/` - API 客戶端包裝
  - `services/api/` - 資源適配器 (`studentApi`, `scoreApi`, `testApi`, `fileApi`)
  - `services/workflows/` - 多 API 編排

- **DTO 標準化** - ✅ 正確實現
  ```typescript
  // 統一錯誤處理
  export async function request<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await apiClient.post<any>(endpoint, data);
    
    if (responseData.status === 'error') {
      throw apiError;  // ✅ 標準化錯誤
    }
    
    return responseData.data as T;  // ✅ 返回統一格式
  }
  ```

- **Workflow 實現** - ✅ 正確
  ```typescript
  // services/workflows/index.ts
  export async function getStudentsWithScores(semester: string) {
    const students = await listStudents({ student_semester: semester });
    const scores = await listScores();
    
    // ✅ 只做數據聚合，不做 UI 邏輯
    return students.map(student => ({
      student,
      score: scoreMap.get(student.student_uuid) || null
    }));
  }
  ```

##### ✅ 邊界檢查
- [x] 無導入 `components/` 或 `hooks/` - ✅ 正確

---

#### 3.5 types/ (類型層)

##### ✅ 完美實現
- `common.ts` - 通用類型 (`AsyncState`, `ApiError`, `AsyncStatus`)
- `student.ts` - 學生相關類型
- `score.ts` - 成績相關類型
- `test.ts` - 考試相關類型
- `file.ts` - 檔案相關類型
- `index.ts` - 統一導出

##### ✅ 類型品質
- 無運行時邏輯 - ✅
- 良好的 TypeScript 實踐 - ✅

---

#### 3.6 config/ (配置層)

##### ✅ 正確實現
- `api.ts` - API 端點配置
- `constants.ts` - 常數配置（狀態映射、驗證規則）
- `index.ts` - 統一導出

##### ✅ 配置品質
```typescript
// ✅ 正確：僅靜態配置
export const STUDENT_STATUS_CONFIG = {
  修業中: { label: '修業中', color: 'blue' },
  修業完畢: { label: '修業完畢', color: 'green' },
  // ...
} as const;

// ✅ 正確：無運行時邏輯
export const VALIDATION = {
  score: { min: 0, max: 100 },
  // ...
} as const;
```

---

### 4. Import 邊界檢查 (Import Boundaries)

#### ✅ 正確的導入
| 源層 | 目標層 | 狀態 | 樣本 |
|------|--------|------|------|
| `app/` → `components/` | ✅ | ✅ | `app/students/page.tsx` |
| `app/` → `hooks/` | ✅ | ✅ | `app/students/page.tsx` |
| `components/` → `types/` | ✅ | ✅ | `components/StatusBadge.tsx` |
| `components/` → `config/` | ✅ | ✅ | `components/StatusBadge.tsx` |
| `hooks/` → `services/` | ✅ | ✅ | `hooks/feature/useStudents.ts` |
| `services/` → `types/` | ✅ | ✅ | `services/api/studentApi.ts` |
| `services/` → `config/` | ✅ | ✅ | `services/clients/apiClient.ts` |

#### ⛔ 違規導入
| 源層 | 目標層 | 狀態 | 檔案 | 嚴重性 |
|------|--------|------|------|--------|
| `app/debug/` | `axios` (直接) | ❌ | `app/debug/page.tsx` | 🔴 高 |
| `components/students/` | `hooks/feature/` | ⚠️ | `CreateStudentModal.tsx`, `EditStudentModal.tsx` | 🟡 中 |

#### ❌ 缺少的 ESLint 規則

**問題**: `.eslintrc.json` 未配置邊界檢查

**建議**: 添加 `eslint-plugin-import` 規則
```json
{
  "plugins": ["@typescript-eslint", "import"],
  "rules": {
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "./services",
          "from": "./hooks",
          "message": "services/ cannot import from hooks/"
        },
        {
          "target": "./services",
          "from": "./components",
          "message": "services/ cannot import from components/"
        },
        {
          "target": "./hooks",
          "from": "./components",
          "message": "hooks/ cannot import from components/"
        },
        {
          "target": "./config",
          "from": "./",
          "except": ["./types"],
          "message": "config/ can only import from types/"
        }
      ]
    }]
  }
}
```

---

### 5. Next.js 特定檢查

#### ✅ Server/Client Components

##### 正確使用 `"use client"`
- ✅ 所有 `components/` 中使用 hooks 的組件都有標記
- ✅ 所有 `hooks/` 中的文件都有標記
- ✅ `app/page.tsx` 未標記（因為是 Server Component）

**樣本**:
```typescript
// components/Button.tsx - 沒有 hooks，但可能被 Client 使用
'use client';  // ✅ 正確

// app/page.tsx - 純組合，無交互
// 沒有 'use client' - ✅ 正確（Server Component）
```

#### ✅ 數據獲取策略
- ✅ 無在 `app/` 中直接 fetch（除了 debug 頁面）
- ✅ 使用 hooks 協調數據（client-side）
- ⚠️ 未利用 Server Components 的數據獲取優勢

**建議**: 考慮為某些頁面使用 Server Components + Server Actions

---

### 6. 轉換責任規則 (Transformation Rules)

#### ✅ services/ - DTO 標準化
```typescript
// services/clients/apiClient.ts
export async function request<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<any>(endpoint, data);
  
  // ✅ DTO 標準化：統一錯誤格式
  if (responseData.status === 'error') {
    const apiError: ApiError = {
      message: responseData.message || responseData.detail || 'Unknown error',
      code: responseData.code || response.status,
      details: responseData.data as Record<string, string[]>,
    };
    throw apiError;
  }
  
  // ✅ 返回統一的數據格式
  return responseData.data as T;
}
```

#### ✅ hooks/ - View-State 映射
```typescript
// hooks/feature/useStudents.ts
export function useStudents(semester?: string) {
  const { data, status, error, refetch } = useAsyncEffect<Student[]>(
    () => listStudents(semester ? { student_semester: semester } : {}),
    [semester]
  );

  // ✅ View-state 映射：衍生便利屬性
  return {
    students: data || [],
    status,
    error,
    refetch,
    isLoading: status === 'loading',  // ✅ UI 狀態衍生
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
```

#### ✅ components/ - Presentation 映射
```typescript
// components/StatusBadge.tsx
export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STUDENT_STATUS_CONFIG[status];  // ✅ 從 config 映射
  
  return (
    <Badge color={config.color as 'blue' | 'green' | 'red' | 'gray'}>
      {config.label}  {/* ✅ 顯示標籤映射 */}
    </Badge>
  );
}

// components/Table.tsx
{column.render
  ? column.render(item)
  : String(item[column.key as keyof T] || '-')}  {/* ✅ null -> "-" */}
```

**結論**: ✅ **轉換責任劃分正確**

---

### 7. 命名規範 (Naming Conventions)

#### ✅ services/api
- ✅ `createStudent`, `listStudents`, `updateStudent`, `deleteStudent`
- ✅ `getStudent`, `getStudentByNumber`
- ✅ `upsertScore`, `getScoreByStudent`

#### ✅ hooks
- ✅ Base: `useAsync`, `useFilter`, `usePagination`, `useSort`
- ✅ Feature: `useStudents`, `useScores`, `useTests`, `useStudentScores`

#### ✅ components
- ✅ Base: `Button`, `Input`, `Modal`, `Table`, `Badge`
- ✅ Feature: `CreateStudentModal`, `StudentList`, `StatusBadge`

**結論**: ✅ **命名規範一致**

---

## 🔍 詳細問題清單 (Issues List)

### 🔴 嚴重問題 (Critical - Must Fix)

#### 問題 #1: `app/debug/page.tsx` 直接使用 axios
- **檔案**: `app/debug/page.tsx:4-29`
- **違規**: 直接導入並使用 `axios` 進行 API 調用
- **影響**: 破壞架構邊界，繞過 services 層
- **優先級**: 🔴 高
- **修復方案**:
  ```typescript
  // 移除
  import axios from 'axios';
  const response = await axios.post('http://localhost:8000/...');
  
  // 改用
  import { listStudents } from '@/services';
  const students = await listStudents({});
  ```

#### 問題 #2: Modal 組件內部管理業務狀態
- **檔案**: 
  - `components/students/CreateStudentModal.tsx:8,23`
  - `components/students/EditStudentModal.tsx:8`
- **違規**: Feature components 直接導入並使用 feature hooks
- **影響**: 
  - 組件可復用性降低
  - 測試複雜度增加
  - 違反關注點分離原則
- **優先級**: 🔴 高
- **修復方案**: 重構為受控組件
  ```typescript
  // ✅ 改為接收 callbacks
  interface CreateStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateStudentRequest) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
  }
  ```

#### 問題 #3: 缺少 ESLint 邊界規則
- **檔案**: `.eslintrc.json`
- **問題**: 無法自動檢測架構邊界違規
- **影響**: 開發者可能無意中違反架構規則
- **優先級**: 🟡 中
- **修復方案**: 添加 `eslint-plugin-import` 及 `no-restricted-paths` 規則

---

### 🟡 中等問題 (Medium - Should Fix)

#### 問題 #4: Table 組件未實現排序功能
- **檔案**: `components/Table.tsx:7`
- **問題**: `sortable?: boolean` 屬性存在但未實現
- **影響**: UI 不完整，可能誤導用戶
- **優先級**: 🟡 中
- **修復方案**: 
  - 選項 A: 實現排序功能（在組件內部）
  - 選項 B: 移除 `sortable` 屬性（排序由 hooks 處理）
  
**建議**: 選擇 **選項 B**（排序應由 hooks 處理，符合架構）

#### 問題 #5: 未充分利用 Server Components
- **檔案**: `app/**/page.tsx`
- **問題**: 所有頁面都使用 `'use client'`
- **影響**: 失去 Next.js 14 的 SEO 和性能優勢
- **優先級**: 🟢 低
- **修復方案**: 考慮為某些頁面使用 Server Components

---

### 🟢 建議改進 (Enhancement - Nice to Have)

#### 建議 #1: 移動文檔資料夾
- **當前**: `front/prompt/`
- **建議**: `front/docs/` 或 `front/.docs/`
- **原因**: 更符合慣例

#### 建議 #2: 添加 `public/` 內容
- **當前**: 資料夾存在但為空
- **建議**: 添加 favicon, robots.txt 等

#### 建議 #3: 考慮添加單元測試
- **當前**: 無測試檔案
- **建議**: 添加 `__tests__/` 或 `*.test.ts` 檔案

---

## 📊 架構品質評分 (Quality Metrics)

| 維度 | 分數 | 評價 |
|------|------|------|
| 資料夾結構 | 100% | ✅ 完美 |
| 層級分離 | 80% | ⚠️ 良好（有 2 處違規） |
| Import 邊界 | 75% | ⚠️ 可接受（需要 ESLint 規則） |
| 命名規範 | 100% | ✅ 完美 |
| TypeScript 使用 | 95% | ✅ 優秀 |
| 代碼品質 | 90% | ✅ 優秀 |
| 文檔完整性 | 90% | ✅ 優秀 |
| **總體評分** | **85%** | ⚠️ **良好** |

---

## 🎯 修復優先級建議 (Fix Priorities)

### Phase 1: 立即修復 (本週)
1. 🔴 修復 `app/debug/page.tsx` - 改用 services
2. 🔴 重構 Modal 組件為受控組件
3. 🟡 添加 ESLint 邊界規則

### Phase 2: 短期改進 (2 週內)
4. 🟡 決定 Table 組件排序策略
5. 🟢 整理文檔資料夾

### Phase 3: 長期優化 (1 個月內)
6. 🟢 評估 Server Components 使用場景
7. 🟢 添加單元測試

---

## 📝 修復指南 (Fix Guide)

### 修復 #1: `app/debug/page.tsx`

**修改前**:
```typescript
import axios from 'axios';

const response = await axios.post(
  'http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata/Student_MetadataWriter/read',
  {},
  { headers: { 'Content-Type': 'application/json' } }
);
```

**修改後**:
```typescript
import { listStudents } from '@/services';

try {
  const students = await listStudents({});
  setRawResult(students);
  setParsedResult(students);
} catch (err) {
  setError(err);
}
```

---

### 修復 #2: Modal 組件

**CreateStudentModal.tsx 修改前**:
```typescript
import { useCreateStudent } from '@/hooks';  // ❌ 移除

export function CreateStudentModal({ isOpen, onClose, onSuccess }) {
  const { create, isLoading, error } = useCreateStudent();  // ❌ 移除
  
  const handleSubmit = async (e) => {
    await create(formData);  // ❌ 移除內部調用
    onSuccess();
  };
}
```

**修改後**:
```typescript
// ✅ 不導入 hooks

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentRequest) => Promise<void>;  // ✅ 接收 callback
  isSubmitting?: boolean;  // ✅ 外部傳入狀態
  error?: string;  // ✅ 外部傳入錯誤
}

export function CreateStudentModal({
  isOpen,
  onClose,
  onSubmit,  // ✅ 使用外部 callback
  isSubmitting = false,
  error,
}) {
  const [formData, setFormData] = useState<CreateStudentRequest>({...});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);  // ✅ 調用外部 callback
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="新增學生">
      <form onSubmit={handleSubmit}>
        {/* ... */}
        {error && <div className="text-red-600">{error}</div>}
        <Button type="submit" isLoading={isSubmitting}>
          新增
        </Button>
      </form>
    </Modal>
  );
}
```

**app/students/page.tsx 使用方式**:
```typescript
export default function StudentsPage() {
  const { students, refetch } = useStudents(semester);
  const { create, isLoading, error } = useCreateStudent();  // ✅ 頁面使用 hook
  
  const handleCreateSubmit = async (data: CreateStudentRequest) => {
    await create(data);
    refetch();
    setIsCreateModalOpen(false);
  };
  
  return (
    <>
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}  // ✅ 傳入 callback
        isSubmitting={isLoading}
        error={error?.message}
      />
    </>
  );
}
```

---

### 修復 #3: ESLint 配置

**`.eslintrc.json` 修改**:
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "import"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "./services",
          "from": "./hooks",
          "message": "services/ 不能從 hooks/ 導入"
        },
        {
          "target": "./services",
          "from": "./components",
          "message": "services/ 不能從 components/ 導入"
        },
        {
          "target": "./hooks",
          "from": "./components",
          "message": "hooks/ 不能從 components/ 導入"
        },
        {
          "target": "./components",
          "from": "./hooks/feature",
          "message": "components/ 不應導入 feature hooks (設計為受控組件)"
        }
      ]
    }]
  }
}
```

**安裝依賴**:
```bash
npm install --save-dev eslint-plugin-import
```

---

## ✅ 正面評價 (Positive Highlights)

以下是做得非常好的部分：

1. ✅ **嚴格的資料夾結構** - 完全符合規範，無違禁資料夾
2. ✅ **清晰的層級分離** - services/hooks/components 職責明確
3. ✅ **優秀的 TypeScript 實踐** - strict mode, 完整類型定義
4. ✅ **統一的異步狀態管理** - 所有 hooks 遵循相同的狀態格式
5. ✅ **良好的 API 抽象** - services 層提供統一的錯誤處理
6. ✅ **一致的命名規範** - 所有層級的命名都符合規範
7. ✅ **完整的文檔** - README 清晰描述架構
8. ✅ **正確使用 'use client'** - Client/Server Components 分離正確

---

## 📋 總結與建議 (Summary & Recommendations)

### 總體評價
前端架構整體上 **設計良好且符合大部分規範**，展現了對架構原則的良好理解。主要問題集中在：
1. 部分組件的邊界違反（Modal 組件設計）
2. 測試/調試代碼未遵守架構規則
3. 缺少自動化檢查機制（ESLint）

### 關鍵建議
1. **立即修復** Modal 組件設計（高優先級）
2. **清理** debug 頁面的架構違規
3. **加強** ESLint 規則以防止未來違規
4. **保持** 當前良好的架構實踐

### 維護建議
- ✅ 定期進行架構審查
- ✅ 在 PR review 中檢查 import 邊界
- ✅ 考慮使用 pre-commit hooks 執行 ESLint
- ✅ 新功能開發時參考良好實踐的現有代碼（如 `services/api/studentApi.ts`）

---

**審查人**: AI Architecture Auditor  
**審查完成時間**: 2026-01-05  
**下次審查建議**: 修復完成後 1 週

---

## 附錄 A: 快速修復檢查清單

- [ ] 修復 `app/debug/page.tsx` axios 使用
- [ ] 重構 `CreateStudentModal.tsx`
- [ ] 重構 `EditStudentModal.tsx`
- [ ] 檢查其他 Modal 組件（`BatchUpdateScoresModal.tsx` 等）
- [ ] 安裝 `eslint-plugin-import`
- [ ] 更新 `.eslintrc.json`
- [ ] 運行 `npm run lint` 確認無錯誤
- [ ] 測試 Modal 組件功能正常
- [ ] 更新相關文檔

---

## 附錄 B: 參考的優秀實踐

### 優秀範例：`services/api/studentApi.ts`
- ✅ 清晰的函數命名
- ✅ 統一的錯誤處理
- ✅ 正確的類型使用
- ✅ 無業務邏輯

### 優秀範例：`hooks/base/useAsync.ts`
- ✅ 可復用的基礎 hook
- ✅ 統一的異步狀態格式
- ✅ 良好的錯誤處理

### 優秀範例：`components/StatusBadge.tsx`
- ✅ 純 UI 組件
- ✅ 使用 config 進行映射
- ✅ 無業務邏輯

---

**報告結束**
