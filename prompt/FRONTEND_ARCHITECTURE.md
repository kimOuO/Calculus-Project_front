# Calculus_oom 前端架構完整指南

## 目錄

1. [架構概覽](#1-架構概覽)
2. [設計理念](#2-設計理念)
3. [目錄結構詳解](#3-目錄結構詳解)
4. [各層職責與實際範例](#4-各層職責與實際範例)
5. [導入邊界規則](#5-導入邊界規則)
6. [非同步資料模式](#6-非同步資料模式)
7. [API Proxy 機制](#7-api-proxy-機制)
8. [完整複雜案例：成績頁面端到端](#8-完整複雜案例成績頁面端到端)

---

## 1. 架構概覽

這是一個基於 **Next.js App Router** 的**嚴格分層架構**。

> **注意**：本專案全部頁面均為 `'use client'` Client Components，未使用 Next.js Server Components 的伺服器端資料獲取。所有資料獲取均在瀏覽器端透過 Hooks 完成。

### 核心特點

- **嚴格分層**：每層職責明確，不可跨界
- **全 POST**：後端 API 端點均為 POST（含 `services/` 層）
- **欄位名稱對齊後端**：前端 types 直接使用後端欄位名稱（`student_uuid`、`student_name` 等），不做 DTO 轉換
- **API Proxy**：`app/api/[...slug]/route.ts` 代理所有前端 API 請求，解決 CORS 和環境變數暴露問題

### 依賴方向（單向）

```
Browser
  ↓
app/ (路由 + 業務編排)
  ↓           ↓
components/  hooks/
（UI 渲染）   （狀態 + 互動）
              ↓
           services/
           ├── clients/   (HTTP 請求封裝)
           ├── api/       (各資源 CRUD)
           └── workflows/ (跨資源業務流程)
              ↓
           types/ + config/
           （類型定義 + 靜態配置）
```

---

## 2. 設計理念

### 職責分離（Separation of Concerns）

| 層級 | 職責 | 禁止事項 |
|------|------|---------|
| **app/** | 路由入口、UI 組合、業務編排（modal 狀態、事件處理） | 直接呼叫 API、包含複雜業務計算 |
| **components/** | 接收 props 渲染 UI；功能組件可呼叫 hooks | 直接呼叫 services、包含排序/過濾邏輯 |
| **hooks/** | 非同步狀態管理、業務邏輯、協調 services | 直接渲染 JSX、直接呼叫 apiClient |
| **services/api/** | API 呼叫、request 封裝；client-side 計算（無後端端點者） | 使用 React hooks、知道 UI 細節 |
| **services/workflows/** | 跨資源編排（多個 API 合併） | 使用 React hooks、做 UI 決策 |
| **types/** | TypeScript 類型、interface、union type | 包含業務邏輯 |
| **config/** | 靜態常量、API 端點、顯示配置 | 包含動態狀態 |

---

## 3. 目錄結構詳解

```
Calculus-Project_front/
├── app/
│   ├── api/[...slug]/route.ts        # API Proxy（轉發至 Django 後端）
│   ├── layout.tsx                    # 全局 Layout
│   ├── page.tsx                      # 首頁（三入口卡片）
│   ├── students/
│   │   ├── page.tsx                  # 學生管理頁
│   │   └── [studentNumber]/
│   │       └── scores/page.tsx       # 個人成績頁
│   ├── tests/
│   │   ├── page.tsx                  # 考試管理頁
│   │   └── [testUuid]/page.tsx       # 考試詳情頁
│   └── scores/page.tsx               # 全班成績頁
│
├── components/
│   ├── index.ts                      # 統一導出
│   ├── Button.tsx / Input.tsx / Table.tsx / Modal.tsx / ...  # 基礎組件
│   ├── StatusBadge.tsx / TestStateBadge.tsx / ...           # 業務展示組件
│   ├── students/                     # 學生功能組件
│   │   ├── StudentList.tsx
│   │   ├── StudentListWithActions.tsx
│   │   ├── CreateStudentModal.tsx
│   │   ├── EditStudentModal.tsx
│   │   ├── UpdateStatusModal.tsx
│   │   └── UploadStudentsModal.tsx
│   ├── scores/                       # 成績功能組件
│   │   ├── AllScoresTable.tsx
│   │   ├── BatchUpdateScoresModal.tsx
│   │   ├── GenerateDiagramModal.tsx
│   │   ├── StudentScoreCard.tsx
│   │   └── TestStatisticsCard.tsx
│   └── tests/                        # 考試功能組件
│       ├── TestListWithActions.tsx
│       ├── CreateTestModal.tsx
│       ├── SetWeightsModal.tsx
│       └── UploadTestFileModal.tsx
│
├── hooks/
│   ├── index.ts
│   ├── base/                         # 可跨業務復用的基礎 hooks
│   │   ├── useAsync.ts               # 手動執行版（useAsync + useAsyncEffect）
│   │   ├── usePagination.ts
│   │   ├── useSort.ts
│   │   └── useFilter.ts
│   └── feature/                      # 業務 hooks（每個操作獨立一個 hook）
│       ├── useStudents.ts            # useStudents / useCreateStudent / useUpdateStudent / useDeleteStudent
│       ├── useScores.ts
│       ├── useTests.ts
│       ├── useFiles.ts
│       ├── useScoresWithStudents.ts
│       ├── useUploadStudents.ts
│       ├── useExportStudents.ts
│       ├── useUpdateStudentStatus.ts
│       └── useGenerateScoreDiagram.ts
│
├── services/
│   ├── index.ts
│   ├── clients/
│   │   └── apiClient.ts              # Axios 實例 + request / uploadRequest / downloadRequest
│   ├── api/
│   │   ├── studentApi.ts
│   │   ├── scoreApi.ts
│   │   ├── testApi.ts
│   │   └── fileApi.ts
│   └── workflows/
│       └── index.ts                  # getStudentsWithScores / getScoresWithStudentInfo / batchUpdateScores / validateWeights
│
├── types/
│   ├── common.ts                     # AsyncState / AsyncStatus / ApiError / ApiResponse
│   ├── student.ts                    # Student / StudentStatus / CreateStudentRequest / ...
│   ├── score.ts                      # Score / ScoreField / UpsertScoreRequest / ...
│   ├── test.ts                       # Test / TestState / SetTestWeightsRequest / ...
│   └── file.ts                       # UploadFileRequest / AssetType / ...
│
└── config/
    ├── constants.ts                  # SCORE_FIELD_NAMES / STUDENT_STATUS_CONFIG / TEST_STATE_CONFIG / VALIDATION
    └── api.ts                        # API_CONFIG.baseURL / API_ENDPOINTS（全資源端點）
```

---

## 4. 各層職責與實際範例

### 4.1 types/ — 類型定義層

**職責**：定義所有 TypeScript 類型，欄位名稱與後端保持一致（不做轉換）。

**實際範例 — `types/student.ts`：**

```typescript
// 前端 Model 欄位名稱完全對齊後端 DB 欄位
export interface Student {
  student_uuid: string;         // pk
  student_name: string;
  student_number: string;
  student_semester: string;
  student_status: StudentStatus;
  student_created_at: string;
  student_updated_at: string;
}

// Union type 取代 enum（更符合 TypeScript 慣例）
export type StudentStatus = '修業中' | '退選' | '被當' | '修業完成';

// Request 類型：只包含 API 需要的欄位
export interface CreateStudentRequest {
  student_name: string;
  student_number: string;
  student_semester: string;
  student_status?: StudentStatus;
}

// Filters 類型：所有欄位可選
export interface StudentFilters {
  student_uuid?: string;
  student_number?: string;
  student_semester?: string;
  student_status?: StudentStatus;
}
```

> **注意**：與後端欄位名稱完全一致，不用 camelCase 轉換。

---

### 4.2 config/ — 配置層

**職責**：靜態常量、API 端點定義、UI 顯示配置。

**實際範例 — `config/constants.ts`：**

```typescript
// 成績欄位中文對應（UI 展示用）
export const SCORE_FIELD_NAMES: Record<string, string> = {
  score_quiz1: '第一次小考',
  score_midterm: '期中考',
  score_quiz2: '第二次小考',
  score_finalexam: '期末考',
  score_total: '總分',
};

// 狀態 → 顯示文字 + 顏色（集中管理，全專案統一）
export const STUDENT_STATUS_CONFIG = {
  修業中:   { label: '修業中',   color: 'blue'  },
  修業完成: { label: '修業完成', color: 'green' },
  被當:     { label: '被當',     color: 'red'   },
  退選:     { label: '退選',     color: 'gray'  },
} as const;

export const VALIDATION = {
  score:         { min: 0, max: 100 },
  weight:        { min: 0, max: 1, sum: 1 },
  studentNumber: { pattern: /^\d{9}$/, message: '學號必須為9位數字' },
  semester:      { pattern: /^\d{4}$/, message: '學期格式為4位數字 (如: 1141)' },
} as const;
```

---

### 4.3 services/clients/ — HTTP 客戶端層

**職責**：封裝 Axios，統一解析後端回應格式（`{ status, message, data, code }`），對外只暴露 `request / uploadRequest / downloadRequest`。

**實際範例 — `services/clients/apiClient.ts`：**

```typescript
// 後端統一回應格式：{ status: 'success'|'error', message: string, data: T, code: number }
export async function request<T>(
  endpoint: string,
  data?: unknown,
): Promise<T> {
  const response = await apiClient.post<any>(endpoint, data);
  const responseData = response.data;

  // 後端回傳 status=error 時拋出 ApiError
  if (responseData.status === 'error') {
    throw {
      message: responseData.message || 'Unknown error',
      code: responseData.code || response.status,
      details: responseData.data,
    } as ApiError;
  }

  // 只回傳 data 欄位（業務資料）
  return responseData.data as T;
}

// 二進位檔案下載（回傳 Blob）
export async function downloadRequest(endpoint: string, data: unknown): Promise<Blob> {
  const response = await apiClient.post(endpoint, data, { responseType: 'blob' });
  return response.data;
}
```

---

### 4.4 services/api/ — API 資源層

**職責**：每個資源一個檔案，對應後端 Actor 的 CRUD 端點；client-side 聚合計算也放這裡（無對應後端端點時）。

**實際範例 — `services/api/studentApi.ts`：**

```typescript
// 標準 POST CRUD
export async function listStudents(filters?: StudentFilters): Promise<Student[]> {
  return request<Student[]>(API_ENDPOINTS.student.read, filters || {});
}

export async function createStudent(data: CreateStudentRequest): Promise<Student> {
  return request<Student>(API_ENDPOINTS.student.create, data);
}

export async function deleteStudent(studentUuid: string): Promise<void> {
  await request(API_ENDPOINTS.student.delete, { student_uuid: studentUuid });
}

// client-side 計算（後端無此端點，從 listStudents 結果統計）
export async function getStudentStatusStats(semester: string): Promise<StudentStatusStats> {
  const students = await listStudents({ student_semester: semester });

  const stats: StudentStatusStats = { 修業中: 0, 修業完成: 0, 被當: 0, 退選: 0 };
  students.forEach((s) => { stats[s.student_status]++; });
  return stats;
}
```

---

### 4.5 services/workflows/ — 跨資源業務流程層

**職責**：需要合併多個 API 資源的複雜資料獲取，以及跨資源的業務邏輯（如批量更新）。

**實際範例 — `services/workflows/index.ts`：**

```typescript
// 跨資源合併：學生 + 成績合表（成績頁面需要）
export async function getScoresWithStudentInfo(semester?: string): Promise<ScoreWithStudent[]> {
  // 同時需要 Student 和 Score 兩個資源
  const students = semester
    ? await listStudents({ student_semester: semester })
    : await listStudents();
  const scores = await listScores();

  // 建立 studentMap 做 O(1) 查詢
  const studentMap = new Map<string, Student>();
  students.forEach((s) => studentMap.set(s.student_uuid, s));

  // enrichment：Score + Student 資訊合併
  return scores
    .map((score) => {
      const student = studentMap.get(score.f_student_uuid);
      if (!student) return null;
      return { ...score, student_name: student.student_name, student_number: student.student_number, ... };
    })
    .filter((item): item is ScoreWithStudent => item !== null);
}

// 批量操作（逐筆執行，回傳 success/failed 統計）
export async function batchUpdateScores(
  updates: BatchScoreUpdate[],
  scoreField: ScoreField
): Promise<{ success: number; failed: number }> {
  let success = 0, failed = 0;
  for (const update of updates) {
    try {
      const student = await getStudentByNumber(update.student_number);
      await upsertScore({ f_student_uuid: student.student_uuid, update_field: scoreField, ... });
      success++;
    } catch { failed++; }
  }
  return { success, failed };
}
```

---

### 4.6 hooks/base/ — 基礎 Hooks 層

**職責**：與業務無關、可跨功能復用的 hooks。**最重要的是 `useAsync` 與 `useAsyncEffect` 兩種模式**。

**實際範例 — `hooks/base/useAsync.ts`：**

```typescript
// ── 模式 1：useAsync（手動觸發）──────────────────────────────────────
// 用於：create / update / delete / upload（需要使用者明確觸發）
export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, status: 'idle', error: null });

  const execute = useCallback(async (...args: Args) => {
    setState({ data: null, status: 'loading', error: null });
    try {
      const data = await asyncFunction(...args);
      setState({ data, status: 'success', error: null });
      return data;
    } catch (error) {
      setState({ data: null, status: 'error', error: error as ApiError });
      throw error;
    }
  }, [asyncFunction]);

  const reset = useCallback(() => setState({ data: null, status: 'idle', error: null }), []);

  return { ...state, execute, reset, isLoading, isSuccess, isError, isIdle };
}

// ── 模式 2：useAsyncEffect（自動觸發）───────────────────────────────
// 用於：list / get（組件掛載時自動獲取，deps 變化時重新獲取）
export function useAsyncEffect<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [state, setState] = useState<AsyncState<T>>({ ... });

  const refetch = useCallback(async () => {
    // 同 useAsync 的邏輯，但不 rethrow
  }, [asyncFunction]);

  useEffect(() => { refetch(); }, deps);  // 自動執行，deps 變化重觸發

  return { ...state, refetch, isLoading, isSuccess, isError };
}
```

---

### 4.7 hooks/feature/ — 功能 Hooks 層

**職責**：每個 CRUD 操作獨立一個 hook，組合 base hooks + services 提供業務功能。

**設計模式：每個操作拆成獨立 hook（不合併成一個大 hook）**

**實際範例 — `hooks/feature/useStudents.ts`：**

```typescript
// 查詢列表 → useAsyncEffect（自動獲取，semester 變化重新拉資料）
export function useStudents(semester?: string) {
  const { data, status, error, refetch } = useAsyncEffect<Student[]>(
    () => listStudents(semester ? { student_semester: semester } : {}),
    [semester]   // ← deps：semester 變化重新觸發
  );

  return { students: data || [], status, error, refetch, isLoading, isSuccess, isError };
}

// 新增 → useAsync（手動觸發，等使用者按送出）
export function useCreateStudent() {
  const { execute, status, error } = useAsync<Student, [CreateStudentRequest]>(createStudent);

  const create = useCallback(async (data: CreateStudentRequest) => {
    return await execute(data);
  }, [execute]);

  return { create, status, error, isLoading, isSuccess, isError };
}

// 刪除 → useAsync（手動觸發）
export function useDeleteStudent() {
  const { execute, status, error } = useAsync<void, [string]>(deleteStudent);

  const remove = useCallback(async (studentUuid: string) => {
    return await execute(studentUuid);
  }, [execute]);

  return { remove, status, error, isLoading };
}
```

---

### 4.8 components/ — UI 渲染層

**職責**：接收 props 渲染 UI；功能組件透過 hook 取得資料；禁止直接呼叫 services。

**基礎組件範例 — 接收 props，純展示：**

```typescript
// components/StatusBadge.tsx
// 讀取 config/constants 的顯示配置，純 UI 映射
import { STUDENT_STATUS_CONFIG } from '@/config';

export function StatusBadge({ status }: { status: StudentStatus }) {
  const config = STUDENT_STATUS_CONFIG[status];
  return <span className={`badge badge-${config.color}`}>{config.label}</span>;
}
```

**功能組件範例 — 接收資料 props，渲染操作列表：**

```typescript
// components/students/StudentListWithActions.tsx
export function StudentListWithActions({ students, onEdit, onDelete, onStatusUpdate }: Props) {
  return (
    <Table
      data={students}
      keyExtractor={(s) => s.student_uuid}
      columns={[
        { key: 'student_number', label: '學號' },
        { key: 'student_name',   label: '姓名' },
        { key: 'student_status', label: '狀態',
          render: (s) => <StatusBadge status={s.student_status} /> },  // ← 展示映射
        { key: 'actions', label: '操作',
          render: (s) => (
            <div>
              <Button size="sm" onClick={() => onEdit?.(s)}>編輯</Button>
              <Button size="sm" variant="danger" onClick={() => onDelete?.(s)}>刪除</Button>
            </div>
          )
        },
      ]}
      emptyMessage="尚無學生資料"
    />
  );
}
```

---

### 4.9 app/ — 路由與業務編排層

**職責**：modal 狀態管理、事件處理函式（handleXxx）、多 hooks 組合、頁面 Layout 組合。

> **注意**：本專案所有頁面為 `'use client'`，資料獲取均透過 hooks。

**實際範例 — `app/students/page.tsx`（精簡版）：**

```typescript
'use client';
export default function StudentsPage() {
  // ── 頁面狀態：modal 開關 + 選中的資料 ─────────────────────────────
  const [semester, setSemester] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // ── Hooks 組合：多個操作並列 ───────────────────────────────────────
  const { students, isLoading, refetch } = useStudents(semester);
  const { remove: deleteStudent }         = useDeleteStudent();
  const { create: createStudent }         = useCreateStudent();

  // ── 事件處理：呼叫 hook，完成後 refetch + 關 modal ─────────────────
  const handleCreateSubmit = async (data: CreateStudentRequest) => {
    await createStudent(data);
    refetch();
    setIsCreateModalOpen(false);
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`確定刪除 ${student.student_name}？`)) return;
    await deleteStudent(student.student_uuid);
    refetch();
  };

  // ── JSX：組合組件 ─────────────────────────────────────────────────
  return (
    <div>
      <SemesterSelect value={semester} onChange={setSemester} />
      <StudentListWithActions
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onSubmit={handleCreateSubmit}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
```

---

## 5. 導入邊界規則

### 允許的導入關係

```typescript
// app/ 可以導入
import { StudentListWithActions } from '@/components/students';
import { useStudents, useCreateStudent } from '@/hooks';
import type { Student } from '@/types';

// components/ 可以導入
import { useGenerateScoreDiagram } from '@/hooks/feature'; // 功能組件可呼叫 hook
import { Button, Modal } from '@/components';              // 基礎組件組合
import { STUDENT_STATUS_CONFIG } from '@/config';
import type { Student } from '@/types';

// hooks/ 可以導入
import { useAsync, useAsyncEffect } from '@/hooks/base';
import { listStudents, createStudent } from '@/services';
import type { Student } from '@/types';

// services/api/ 可以導入
import { request, downloadRequest } from '@/services/clients';
import { API_ENDPOINTS, API_CONFIG } from '@/config';
import type { Student } from '@/types';

// services/workflows/ 可以導入
import { listStudents, listScores } from '@/services/api';
import type { Student, Score } from '@/types';
```

### 禁止的導入關係

```typescript
// ❌ services/ 絕對不能導入 hooks 或 components
import { useStudents } from '@/hooks';      // ❌
import { StudentList } from '@/components'; // ❌

// ❌ hooks/ 不能導入 components
import { Button } from '@/components';     // ❌

// ❌ config/ 不能導入任何其他層
import { listStudents } from '@/services'; // ❌
```

---

## 6. 非同步資料模式

這是架構中最核心的模式，決定使用哪種 hook：

### 決策樹

```
這個 API 呼叫什麼時候觸發？

需要使用者明確觸發（按鈕/送出）？
  → 使用 useAsync（手動 execute）
  → 用於：create / update / delete / upload / export

組件掛載時或 deps 變化時自動觸發？
  → 使用 useAsyncEffect（自動 + refetch）
  → 用於：list / get（依 semester/uuid 自動重拉）
```

### 使用範例對比

```typescript
// ── useAsync：手動，等使用者按「新增」────────────────────────────────
const { execute, isLoading, error } = useAsync(createStudent);

const handleSubmit = async (data) => {
  await execute(data);  // 使用者按下才執行
  refetch();
};

// ── useAsyncEffect：自動，semester 換了就重拉 ──────────────────────
const { data, isLoading, refetch } = useAsyncEffect(
  () => listStudents({ student_semester: semester }),
  [semester]   // semester 改變 → 自動重新呼叫
);
```

---

## 7. API Proxy 機制

瀏覽器不直接呼叫 Django，而是透過 Next.js 的 `app/api/[...slug]/route.ts` 代理：

```
Browser → http://localhost:3000/api/v0.1/.../student/create
         → (Next.js route.ts)
         → http://backend:8000/api/v0.1/.../student/create
```

**`app/api/[...slug]/route.ts` 實際邏輯：**

```typescript
export async function POST(request: NextRequest, { params }) {
  const targetUrl = `${process.env.BACKEND_URL}/api/${params.slug.join('/')}`;
  const contentType = request.headers.get('Content-Type') || '';

  // multipart/form-data → 直接轉發 FormData（保留 boundary）
  // application/json   → 轉發 text body
  const body = contentType.includes('multipart/form-data')
    ? await request.formData()
    : await request.text();

  const backendResponse = await fetch(targetUrl, { method: 'POST', body });

  // 二進位回應（圖片/PDF）→ ArrayBuffer 回傳
  // JSON 回應            → 直接 proxy
}
```

**好處**：
- 前端只需設定 `NEXT_PUBLIC_API_BASE_URL`，後端 URL 不暴露給瀏覽器
- 解決 CORS 問題（瀏覽器打同一個 origin 的 Next.js）
- Docker 環境中，後端 URL 由 `BACKEND_URL` env var 在 server-side 讀取

---

## 8. 完整複雜案例：成績頁面端到端

`app/scores/page.tsx` 是最複雜的頁面，涉及：
- 跨資源資料合併（Workflow）
- 考試狀態機感知（決定哪個欄位可輸入）
- 多個 hooks 並行組合
- 圖表生成（二進位回應處理）

### 呼叫鏈

```
app/scores/page.tsx
  ↓ useScoresWithStudents(semester)
    → hooks/feature/useScoresWithStudents.ts
      → useAsyncEffect → workflows.getScoresWithStudentInfo()
        → services/api/studentApi.listStudents()  ← 兩個 API 並行獲取
        → services/api/scoreApi.listScores()
        → 合併 ScoreWithStudent[]
  ↓ useTests(semester)
    → hooks/feature/useTests.ts
      → useAsyncEffect → testApi.listTests()
  ↓ (page 內計算) activeScoreField
    → 根據 tests 的 test_states 決定目前可輸入哪個欄位
  ↓ useGenerateScoreDiagram()
    → hooks/feature/useGenerateScoreDiagram.ts
      → useAsync → scoreApi.generateScoreDiagram()
        → services/clients/downloadRequest()     ← 回傳 Blob（PNG 圖片）
        → URL.createObjectURL(blob)              ← 轉成瀏覽器可用 URL
```

### 考試狀態機感知（pages 層業務邏輯）

```typescript
// app/scores/page.tsx — 根據考試狀態決定哪個欄位目前可輸入
const activeScoreField = useMemo(() => {
  if (!tests || tests.length === 0) return null;

  const EXAM_ORDER: ScoreField[] = [
    'score_quiz1', 'score_midterm', 'score_quiz2', 'score_finalexam'
  ];

  // 找第一個「考卷完成」狀態的考試（可以輸入成績）
  for (const field of EXAM_ORDER) {
    const fieldKeyword = SCORE_FIELD_NAMES[field]; // '第一次小考' 等
    const matchingTest = tests.find(t =>
      t.test_name.includes(fieldKeyword) && t.test_states === '考卷完成'
    );
    if (matchingTest) return field;
  }
  return null; // 無可輸入欄位
}, [tests]);
```

### 圖表下載（二進位回應處理）

```typescript
// hooks/feature/useGenerateScoreDiagram.ts
export function useGenerateScoreDiagram() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { execute, isLoading } = useAsync(async (testUuid: string) => {
    // downloadRequest 使用 responseType: 'blob'
    const blob = await downloadRequest(API_ENDPOINTS.score.generateDiagram, { test_uuid: testUuid });
    // Blob → Object URL，供 <img src> 使用
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    return url;
  });

  const reset = useCallback(() => setImageUrl(null), []);

  return { generate: execute, imageUrl, isLoading, reset };
}
```

### 完整資料流

```
1. page 掛載 → useScoresWithStudents(semester) 自動觸發
2.           → useTests(semester) 自動觸發
3. page 計算 activeScoreField（根據 tests state machine）
4. 渲染 AllScoresTable（傳入 scores + activeScoreField）
5. 使用者按「生成圖表」
6. → useGenerateScoreDiagram.generate(testUuid) 手動觸發
7. → scoreApi.generateScoreDiagram() → downloadRequest()
8. → 後端回傳 PNG 二進位 → Blob → Object URL
9. → GenerateDiagramModal 顯示 <img src={imageUrl}>
```

---

## 附錄：各層選用摘要

| 情境 | 放置層級 | 模式 |
|------|---------|------|
| TypeScript 類型、interface | `types/` | — |
| 靜態常量、API 端點、UI 顏色配置 | `config/` | — |
| 單一資源 CRUD | `services/api/` | `request()` |
| 需要多資源合併、批量操作 | `services/workflows/` | 純 async function |
| 自動獲取（頁面載入/deps 變化） | `hooks/feature` + `useAsyncEffect` | 自動 refetch |
| 手動觸發（使用者操作） | `hooks/feature` + `useAsync` | execute + refetch |
| 純展示（接收 props） | `components/` 根目錄 | props-driven |
| 功能展示（需要 hook） | `components/<resource>/` | hook + render |
| 頁面組合、modal 管理、事件處理 | `app/` | useState + handleXxx |
