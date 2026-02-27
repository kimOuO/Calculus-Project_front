#!/bin/bash

# Calculus OOM Frontend - Docker Build and Run Script

set -e

echo "=========================================="
echo "Calculus OOM Frontend - Docker 部署"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安裝${NC}"
    echo ""
    echo "請先安裝 Docker:"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "  sudo sh get-docker.sh"
    echo ""
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose 未安裝，將使用 docker run 啟動${NC}"
    USE_COMPOSE=false
else
    USE_COMPOSE=true
fi

echo -e "${GREEN}✅ Docker 版本: $(docker --version)${NC}"
if [ "$USE_COMPOSE" = true ]; then
    echo -e "${GREEN}✅ Docker Compose 版本: $(docker-compose --version)${NC}"
fi
echo ""

# Function to build image
build_image() {
    echo -e "${BLUE}🔨 開始建構 Docker 映像...${NC}"
    
    # Build the Docker image
    docker build -t calculus-frontend:latest . \
        --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker 映像建構成功！${NC}"
    else
        echo -e "${RED}❌ Docker 映像建構失敗${NC}"
        exit 1
    fi
}

# Function to run container
run_container() {
    echo -e "${BLUE}🚀 啟動容器...${NC}"
    
    # Stop and remove existing container if it exists
    docker stop calculus_frontend 2>/dev/null || true
    docker rm calculus_frontend 2>/dev/null || true
    
    # Run the container
    docker run -d \
        --name calculus_frontend \
        -p 3000:3000 \
        -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata \
        --restart unless-stopped \
        calculus-frontend:latest
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 容器啟動成功！${NC}"
        echo ""
        echo -e "${BLUE}📱 應用程式已啟動於: http://localhost:3000${NC}"
        echo -e "${BLUE}🔗 後端 API 位址: http://localhost:8000${NC}"
        echo ""
        echo "查看容器狀態: docker ps"
        echo "查看日誌: docker logs calculus_frontend"
        echo "停止容器: docker stop calculus_frontend"
    else
        echo -e "${RED}❌ 容器啟動失敗${NC}"
        exit 1
    fi
}

# Function to use docker-compose
run_with_compose() {
    echo -e "${BLUE}🚀 使用 Docker Compose 啟動...${NC}"
    
    # Stop existing services
    docker-compose down 2>/dev/null || true
    
    # Start services
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 服務啟動成功！${NC}"
        echo ""
        echo -e "${BLUE}📱 前端應用: http://localhost:3000${NC}"
        echo -e "${BLUE}🔗 後端 API: http://localhost:8000${NC}"
        echo ""
        echo "查看服務狀態: docker-compose ps"
        echo "查看日誌: docker-compose logs -f"
        echo "停止服務: docker-compose down"
    else
        echo -e "${RED}❌ 服務啟動失敗${NC}"
        exit 1
    fi
}

# Check if backend is running
echo -e "${YELLOW}🔍 檢查後端服務狀態...${NC}"
if docker ps | grep -q "calculus.*backend\|backend.*calculus"; then
    echo -e "${GREEN}✅ 後端容器正在運行${NC}"
    BACKEND_RUNNING=true
else
    echo -e "${YELLOW}⚠️  未發現後端容器，請確保後端服務正在運行${NC}"
    echo -e "${YELLOW}   後端應該運行在 localhost:8000${NC}"
    BACKEND_RUNNING=false
fi
echo ""

# Main execution
case "${1:-build-run}" in
    "build")
        build_image
        ;;
    "run")
        if docker images | grep -q "calculus-frontend"; then
            if [ "$USE_COMPOSE" = true ] && [ "$BACKEND_RUNNING" = true ]; then
                run_with_compose
            else
                run_container
            fi
        else
            echo -e "${RED}❌ 找不到 calculus-frontend 映像，請先執行建構${NC}"
            echo "執行: $0 build"
            exit 1
        fi
        ;;
    "build-run")
        build_image
        echo ""
        if [ "$USE_COMPOSE" = true ] && [ "$BACKEND_RUNNING" = true ]; then
            run_with_compose
        else
            run_container
        fi
        ;;
    "stop")
        echo -e "${YELLOW}🛑 停止容器...${NC}"
        if [ "$USE_COMPOSE" = true ]; then
            docker-compose down
        else
            docker stop calculus_frontend 2>/dev/null || true
            docker rm calculus_frontend 2>/dev/null || true
        fi
        echo -e "${GREEN}✅ 容器已停止${NC}"
        ;;
    "logs")
        echo -e "${BLUE}📋 顯示容器日誌...${NC}"
        if [ "$USE_COMPOSE" = true ]; then
            docker-compose logs -f calculus-frontend
        else
            docker logs -f calculus_frontend
        fi
        ;;
    "status")
        echo -e "${BLUE}📊 容器狀態:${NC}"
        echo ""
        if [ "$USE_COMPOSE" = true ]; then
            docker-compose ps
        else
            docker ps | grep calculus_frontend || echo "容器未運行"
        fi
        ;;
    *)
        echo "使用方式: $0 {build|run|build-run|stop|logs|status}"
        echo ""
        echo "指令說明:"
        echo "  build      - 僅建構 Docker 映像"
        echo "  run        - 僅運行容器 (需要先建構)"
        echo "  build-run  - 建構並運行容器 (預設)"
        echo "  stop       - 停止並移除容器"
        echo "  logs       - 顯示容器日誌"
        echo "  status     - 顯示容器狀態"
        exit 1
        ;;
esac