# Docker 部署指南

## 🚀 快速部署

### 1. 使用自動化腳本（推薦）

```bash
# 建構並啟動容器
./docker-run.sh build-run

# 僅建構映像
./docker-run.sh build

# 僅啟動容器 (需先建構)
./docker-run.sh run

# 查看容器狀態
./docker-run.sh status

# 查看日誌
./docker-run.sh logs

# 停止容器
./docker-run.sh stop
```

### 2. 手動 Docker 指令

```bash
# 建構映像
docker build -t calculus-frontend:latest .

# 啟動容器
docker run -d \
  --name calculus_frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata \
  --restart unless-stopped \
  calculus-frontend:latest

# 查看容器狀態
docker ps

# 查看日誌
docker logs -f calculus_frontend

# 停止容器
docker stop calculus_frontend
docker rm calculus_frontend
```

### 3. 使用 Docker Compose

```bash
# 啟動服務 (僅前端)
docker-compose up -d

# 停止服務
docker-compose down

# 查看日誌
docker-compose logs -f
```

## 🔧 配置說明

### 環境變數

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata` | 後端 API 基礎網址 |
| `NODE_ENV` | `production` | Node.js 環境 |
| `PORT` | `3000` | 前端服務埠號 |

### 網路連接

- **前端服務**: `http://localhost:3000`
- **後端 API**: `http://localhost:8000`

## 📋 部署檢查清單

### 部署前檢查

- [ ] 確認 Docker 已安裝 (`docker --version`)
- [ ] 確認後端服務運行在 port 8000
- [ ] 檢查後端 API 可訪問性

```bash
curl -X POST http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata/Student_MetadataWriter/read \
  -H "Content-Type: application/json" \
  -d "{}"
```

### 部署後檢查

- [ ] 前端容器正常運行 (`docker ps`)
- [ ] 前端頁面可訪問 (`curl http://localhost:3000`)
- [ ] 檢查容器日誌無錯誤 (`docker logs calculus_frontend`)

## 🔍 故障排除

### 常見問題

1. **容器啟動失敗**
   ```bash
   # 查看詳細錯誤訊息
   docker logs calculus_frontend
   
   # 檢查容器狀態
   docker ps -a
   ```

2. **API 連接錯誤**
   ```bash
   # 檢查後端服務
   docker ps | grep backend
   
   # 測試後端連通性
   curl -X POST http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata/Student_MetadataWriter/read \
     -H "Content-Type: application/json" -d "{}"
   ```

3. **端口衝突**
   ```bash
   # 檢查端口占用
   netstat -tulpn | grep :3000
   
   # 使用不同端口啟動
   docker run -d --name calculus_frontend -p 3001:3000 calculus-frontend:latest
   ```

4. **重新建構映像**
   ```bash
   # 強制重新建構
   docker build --no-cache -t calculus-frontend:latest .
   ```

## 📊 系統需求

- **Docker**: 版本 20.10+
- **Docker Compose**: 版本 1.29+ (可選)
- **系統記憶體**: 最少 1GB 可用
- **磁盘空間**: 最少 2GB 可用

## 🔄 更新部署

```bash
# 停止現有容器
docker stop calculus_frontend
docker rm calculus_frontend

# 重新建構映像
./docker-run.sh build

# 啟動新容器
./docker-run.sh run
```

## 📝 生產環境建議

1. **使用正式域名**
   ```bash
   -e NEXT_PUBLIC_API_BASE_URL=https://your-api.domain.com/api/v0.1/Calculus_oom/Calculus_metadata
   ```

2. **添加反向代理** (Nginx)
   ```nginx
   server {
       listen 80;
       server_name your-frontend.domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **設置 HTTPS** (建議使用 Let's Encrypt)

4. **監控和日誌**
   ```bash
   # 設置日誌輪轉
   docker run --log-driver=json-file --log-opt max-size=10m --log-opt max-file=3 ...
   ```

## 🎯 成功部署確認

當看到以下訊息表示部署成功：

1. 容器狀態顯示 "Up"
2. 日誌顯示 "Ready in XXXms"
3. 前端頁面 (http://localhost:3000) 正常載入
4. API 連接測試返回 200 狀態碼

部署完成！🎉