# SemesterSelect 組件使用說明

## 概述

`SemesterSelect` 是一個共用的學期選擇器組件，用於在所有需要篩選學期的頁面中統一使用。它會自動從後端獲取所有可用的學期選項，並以下拉選單的方式呈現。

## 功能特點

- ✅ 自動獲取所有可用學期選項
- ✅ 學期按降序排列（最新學期在前）
- ✅ 支援"全部學期"選項
- ✅ 載入狀態自動處理
- ✅ 完全響應式設計
- ✅ 統一的 UI/UX

## 使用方式

### 基本用法

```typescript
import { SemesterSelect } from '@/components';

function MyPage() {
  const [semester, setSemester] = useState('');

  return (
    <SemesterSelect
      value={semester}
      onChange={setSemester}
    />
  );
}
```

### 完整參數

```typescript
<SemesterSelect
  value={semester}              // 當前選中的值
  onChange={setSemester}        // 變更處理函數
  label="學年學期"              // 標籤文字（可選，默認為"學年學期"）
  includeAll={true}             // 是否包含"全部"選項（可選，默認為 true）
  allLabel="全部學期"           // "全部"選項的文字（可選，默認為"全部學期"）
  disabled={false}              // 是否禁用（可選，默認為 false）
/>
```

## API 參數

| 參數 | 類型 | 默認值 | 說明 |
|------|------|--------|------|
| `value` | `string` | - | **(必填)** 當前選中的學期值 |
| `onChange` | `(value: string) => void` | - | **(必填)** 學期變更時的回調函數 |
| `label` | `string` | `"學年學期"` | 選擇器的標籤文字 |
| `includeAll` | `boolean` | `true` | 是否包含"全部學期"選項 |
| `allLabel` | `string` | `"全部學期"` | "全部"選項顯示的文字 |
| `disabled` | `boolean` | `false` | 是否禁用選擇器 |

## 實際應用範例

### 1. 學生管理頁面 (students/page.tsx)

```typescript
<div className="flex gap-4 items-end">
  <div className="flex-1 max-w-xs">
    <SemesterSelect
      value={semester}
      onChange={setSemester}
    />
  </div>
  <Button variant="secondary" onClick={() => setSemester('')}>
    清除篩選
  </Button>
</div>
```

### 2. 成績管理頁面 (scores/page.tsx)

```typescript
<SemesterSelect
  value={semester}
  onChange={setSemester}
/>
```

### 3. 考試管理頁面 (tests/page.tsx)

```typescript
<div className="flex-1 max-w-xs">
  <SemesterSelect
    value={semester}
    onChange={setSemester}
  />
</div>
```

## 內部實現

組件內部使用 `useSemesters` hook 來獲取學期列表：

```typescript
// hooks/feature/useSemesters.ts
export function useSemesters() {
  const { data, status, error, refetch } = useAsyncEffect<string[]>(
    getSemesters,
    []
  );

  return {
    semesters: data || [],
    status,
    error,
    refetch,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
```

學期數據從 `getSemesters` API 獲取：

```typescript
// services/api/testApi.ts
export async function getSemesters(): Promise<string[]> {
  const tests = await listTests();
  const semesters = [...new Set(tests.map(test => test.test_semester))];
  return semesters.sort().reverse(); // 最新學期在前
}
```

## 遷移指南

### 從 Input 遷移到 SemesterSelect

**之前：**
```typescript
<Input
  label="學年學期"
  placeholder="例: 1141"
  value={semester}
  onChange={(e) => setSemester(e.target.value)}
/>
```

**之後：**
```typescript
<SemesterSelect
  value={semester}
  onChange={setSemester}
/>
```

### 從 Select 遷移到 SemesterSelect

**之前：**
```typescript
const [semesters, setSemesters] = useState<string[]>([]);

useEffect(() => {
  const loadSemesters = async () => {
    const semesterList = await getSemesters();
    setSemesters(semesterList);
  };
  loadSemesters();
}, []);

<Select
  value={semester}
  onChange={(e) => setSemester(e.target.value)}
  options={[
    { value: '', label: '全部學期' },
    ...semesters.map(sem => ({ value: sem, label: sem }))
  ]}
/>
```

**之後：**
```typescript
<SemesterSelect
  value={semester}
  onChange={setSemester}
/>
```

## 優勢

1. **統一性**：所有頁面使用相同的學期選擇器，確保一致的用戶體驗
2. **簡化代碼**：無需在每個頁面重複實現學期獲取邏輯
3. **自動更新**：學期列表會自動從後端獲取，無需手動維護
4. **減少錯誤**：統一管理減少了代碼重複和潛在錯誤
5. **易於維護**：修改只需在一個地方進行

## 已更新的頁面

以下頁面已經更新使用 `SemesterSelect` 組件：

- ✅ `/app/students/page.tsx` - 學生管理頁面
- ✅ `/app/scores/page.tsx` - 成績管理頁面
- ✅ `/app/tests/page.tsx` - 考試管理頁面
