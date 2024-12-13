#!/bin/bash

# 使用 source 或 . 来加载 .env 文件
source ./.env

# 关闭并删除旧容器
echo "Stopping and removing old container..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

if [ $? -eq 0 ]; then
  echo "Old container stopped and removed successfully."
else
  echo "Error: Failed to stop and remove old container."  
  exit 1
fi

# 删除旧镜像（如果存在）
echo "Removing old image..."
docker rmi $IMAGE_NAME || true

# 构建 Docker 镜像
echo "Building Docker image..."
docker build -f ./Dockerfile -t $IMAGE_NAME .

# 检查镜像构建是否成功
if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
  docker image ls
else
  echo "Error: Docker image build failed."
  exit 1
fi
