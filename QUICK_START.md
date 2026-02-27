# 微積分成績管理系統 - 前端

## 🚀 快速啟動

### 1. 確認後端運行
```bash
# 檢查後端容器是否運行
docker ps | grep calculus

# 後端應該運行在 localhost:8000
curl http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata/Student_MetadataWriter/read \
  -X POST -H "Content-Type: application/json" -d "{}"
```

### 2. 啟動前端 (Docker 方式 - 推薦)
```bash
# 一鍵建構並啟動
./docker-run.sh build-run

# 健康檢查
./health-check.sh

# 訪問應用程式
# 前端: http://localhost:3000
# 後端: http://localhost:8000
```

### 3. 本地開發模式
```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 訪問: http://localhost:3000
```

## ⚙️ 環境配置

環境變數已設定在 `.env` 檔案：
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata
```

## 🔧 管理指令

```bash
# 查看容器狀態
docker ps

# 查看前端日誌
docker logs -f calculus_frontend

# 停止前端
docker stop calculus_frontend

# 重啟前端
./docker-run.sh stop && ./docker-run.sh run
```

## 📱 主要功能

- **學生管理**: `/students` - 新增、查看、管理學生
- **成績管理**: `/scores` - 錄入成績、計算總分、查看統計
- **考試管理**: `/tests` - 創建考試、設定權重
- **學生成績詳情**: `/students/[學號]/scores` - 查看單一學生成績

## 🔍 故障排除

1. **前端無法啟動**：檢查 port 3000 是否被佔用
2. **無法連接後端**：確認後端運行在 localhost:8000
3. **容器問題**：執行 `./health-check.sh` 診斷
4. **重新建構**：`./docker-run.sh stop` 然後 `./docker-run.sh build-run`

---

**技術棧**: Next.js 14 + TypeScript + Tailwind CSS + Docker