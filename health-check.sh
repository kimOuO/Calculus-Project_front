#!/bin/bash

# Health Check Script for Calculus OOM Frontend

echo "=========================================="
echo "Calculus OOM 系統健康檢查"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Docker
echo -n "Docker 服務: "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ 已安裝${NC}"
else
    echo -e "${RED}✗ 未安裝${NC}"
    exit 1
fi

# Check backend container
echo -n "後端容器: "
if docker ps | grep -q "calculus.*backend\|backend.*calculus"; then
    echo -e "${GREEN}✓ 運行中${NC}"
    BACKEND_PORT=$(docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "calculus.*backend|backend.*calculus" | grep -o "0.0.0.0:[0-9]*" | cut -d: -f2 | head -1)
    echo "  └─ 端口: ${BACKEND_PORT:-8000}"
else
    echo -e "${RED}✗ 未運行${NC}"
fi

# Check frontend container
echo -n "前端容器: "
if docker ps | grep -q "calculus.*frontend\|frontend.*calculus"; then
    echo -e "${GREEN}✓ 運行中${NC}"
    FRONTEND_PORT=$(docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "calculus.*frontend|frontend.*calculus" | grep -o "0.0.0.0:[0-9]*" | cut -d: -f2 | head -1)
    echo "  └─ 端口: ${FRONTEND_PORT:-3000}"
else
    echo -e "${RED}✗ 未運行${NC}"
fi

echo ""
echo "=========================================="
echo "API 連通性測試"
echo "=========================================="

# Test backend API
echo -n "後端 API 連通性: "
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata/Student_MetadataWriter/read -X POST -H "Content-Type: application/json" -d "{}" 2>/dev/null || echo "000")

if [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ 正常 (HTTP $BACKEND_STATUS)${NC}"
else
    echo -e "${RED}✗ 異常 (HTTP $BACKEND_STATUS)${NC}"
fi

# Test frontend
echo -n "前端頁面連通性: "
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ 正常 (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}✗ 異常 (HTTP $FRONTEND_STATUS)${NC}"
fi

echo ""
echo "=========================================="
echo "系統資源"
echo "=========================================="

# Docker stats
echo "容器資源使用:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep -E "calculus|NAME"

echo ""
echo "=========================================="
echo "快速訪問連結"
echo "=========================================="
echo -e "前端應用: ${GREEN}http://localhost:3000${NC}"
echo -e "後端 API: ${GREEN}http://localhost:8000${NC}"
echo ""

# Quick commands
echo "常用指令:"
echo "  查看容器: docker ps"
echo "  查看前端日誌: docker logs -f calculus_frontend"
echo "  查看後端日誌: docker logs -f calculus_backend"
echo "  停止前端: docker stop calculus_frontend"
echo "  重啟前端: docker restart calculus_frontend"