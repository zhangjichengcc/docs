#!/bin/bash

# 镜像名称
IMAGE_NAME="my-docs-image"
TAR_FILE="${IMAGE_NAME}.tar"

# 构建 Docker 镜像
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# 检查镜像构建是否成功
if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
else
  echo "Error: Docker image build failed."
  exit 1
fi

# 保存 Docker 镜像为 tar 文件
echo "Saving Docker image as tar file..."
docker save -o $TAR_FILE $IMAGE_NAME

# 检查保存过程是否成功
if [ $? -eq 0 ]; then
  echo "Docker image saved successfully as $TAR_FILE."
  # 删除原有的 Docker 镜像
  echo "Removing Docker image..."
  docker rmi $IMAGE_NAME
else
  echo "Error: Docker image save failed."
  exit 1
fi
