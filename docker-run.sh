#!/bin/bash

# 使用 source 或 . 来加载 .env 文件
source ./.env

# 启动 Docker 容器
echo "Starting Docker container..."
docker run -d --name $CONTAINER_NAME -p 8101:80 $IMAGE_NAME  

# 检查容器启动是否成功
if [ $? -eq 0 ]; then
  echo "Docker container started successfully."
  docker ps
else
  echo "Error: Docker container failed to start."
  exit 1
fi