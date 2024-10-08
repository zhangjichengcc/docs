# Dockerfile reference

> Docker可以通过读取Dockerfile中的指令来自动构建镜像。Dockerfile是一个文本文档，其中包含用户可以在命令行上调用的用于组装图像的所有命令。

## 常用配置

| Instruction                                                  | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`ADD`](https://docs.docker.com/reference/dockerfile/#add)   | 添加本地或远程文件和目录 Add local or remote files and directories. |
| [`ARG`](https://docs.docker.com/reference/dockerfile/#arg)   | 使用构建时变量 Use build-time variables.                     |
| [`CMD`](https://docs.docker.com/reference/dockerfile/#cmd)   | 指定默认命令 Specify default commands.                       |
| [`COPY`](https://docs.docker.com/reference/dockerfile/#copy) | 复制文件和目录 Copy files and directories.                   |
| [`ENTRYPOINT`](https://docs.docker.com/reference/dockerfile/#entrypoint) | 指定默认的可执行文件 Specify default executable.             |
| [`ENV`](https://docs.docker.com/reference/dockerfile/#env)   | 设置环境变量 Set environment variables.                      |
| [`EXPOSE`](https://docs.docker.com/reference/dockerfile/#expose) | 描述应用程序正在侦听哪些端口 Describe which ports your application is listening on. |
| [`FROM`](https://docs.docker.com/reference/dockerfile/#from) | 从一个基本映像创建一个新的构建阶段 Create a new build stage from a base image. |
| [`HEALTHCHECK`](https://docs.docker.com/reference/dockerfile/#healthcheck) | 在启动时检查容器的运行状况 Check a container's health on startup. |
| [`LABEL`](https://docs.docker.com/reference/dockerfile/#label) | 向镜像添加元数据 Add metadata to an image.                   |
| [`MAINTAINER`](https://docs.docker.com/reference/dockerfile/#maintainer-deprecated) | 指定镜像的作者 Specify the author of an image.               |
| [`ONBUILD`](https://docs.docker.com/reference/dockerfile/#onbuild) | 指定何时在构建中使用镜像的指令 Specify instructions for when the image is used in a build. |
| [`RUN`](https://docs.docker.com/reference/dockerfile/#run)   | 执行构建命令 Execute build commands.                         |
| [`SHELL`](https://docs.docker.com/reference/dockerfile/#shell) | 设置镜像的默认 shell Set the default shell of an image.      |
| [`STOPSIGNAL`](https://docs.docker.com/reference/dockerfile/#stopsignal) | 指定退出容器的系统调用信号 Specify the system call signal for exiting a container. |
| [`USER`](https://docs.docker.com/reference/dockerfile/#user) | 设置用户ID和组ID Set user and group ID.                      |
| [`VOLUME`](https://docs.docker.com/reference/dockerfile/#volume) | 创建卷挂载 Create volume mounts.                             |
| [`WORKDIR`](https://docs.docker.com/reference/dockerfile/#workdir) | 更改工作目录 Change working directory.                       |

1. **`FROM`**
   指定基础镜像，所有 Dockerfile 都必须以该指令开始。

   ```dockerfile
   FROM node:14
   ```

2. **`LABEL`**
   为镜像添加元数据，如作者、版本等。

   ```dockerfile
   LABEL maintainer="zhangjicheng@example.com"
   ```

3. **`WORKDIR`**
   设置工作目录，类似 `cd` 命令。

   ```dockerfile
   WORKDIR /app
   ```

4. **`COPY`**
   将文件从宿主机复制到镜像内。

   ```dockerfile
   COPY . /app
   ```

5. **`ADD`**
   和 `COPY` 类似，但支持解压 `.tar` 文件以及从 URL 下载。

   ```dockerfile
   ADD https://example.com/file.tar.gz /app
   ```

6. **`RUN`**
   在构建镜像时运行的命令，通常用于安装依赖、构建项目等。

   ```dockerfile
   RUN apt-get update && apt-get install -y curl
   RUN npm install
   ```

7. **`CMD`**
   容器启动时运行的默认命令。可以是一个可执行文件或参数数组。`CMD` 只会在不提供命令时执行。

   ```dockerfile
   CMD ["npm", "start"]
   ```

8. **`ENTRYPOINT`**
   容器启动时始终执行的命令。可与 `CMD` 配合使用来传递参数。

   ```dockerfile
   ENTRYPOINT ["python"]
   CMD ["app.py"]
   ```

9. **`EXPOSE`**
   指定容器开放的端口，这不会实际暴露端口，而是声明服务监听的端口。

   ```dockerfile
   EXPOSE 3000
   ```

10. **`ENV`**
    设置环境变量，方便在镜像内使用。

    ```dockerfile
    ENV NODE_ENV=production
    ENV PORT=3000
    ```

11. **`VOLUME`**
    定义数据卷，可以挂载持久化数据。

    ```dockerfile
    VOLUME ["/data"]
    ```

12. **`USER`**
    指定容器内使用的用户，增加安全性。

    ```dockerfile
    USER appuser
    ```

13. **`ARG`**
    定义在构建时可以传递的参数，与 `ENV` 相似，但作用范围只在构建过程中。

    ```dockerfile
    ARG NODE_VERSION=14
    ```

14. **`HEALTHCHECK`**
    设置健康检查，定期检查容器服务的健康状况。

    ```dockerfile
    HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost:3000/ || exit 1
    ```

15. **`ONBUILD`**
    指定在其他 Dockerfile 基于当前镜像时自动执行的指令。

    ```dockerfile
    ONBUILD RUN echo "This will run on child Dockerfile"
    ```

## 示例

1. node 应用

   ``` dockerfile
   # 基础镜像
   FROM node:14
   
   # 作者信息
   LABEL maintainer="zhangjicheng@example.com"
   
   # 设置工作目录
   WORKDIR /app
   
   # 复制 package.json 并安装依赖
   COPY package*.json ./
   RUN npm install
   
   # 复制项目文件
   COPY . .
   
   # 设置环境变量
   ENV NODE_ENV=production
   
   # 暴露端口
   EXPOSE 3000
   
   # 启动命令
   CMD ["npm", "start"]
   ```

2. Python 应用

   ``` dockerfile
   # 基础镜像
   FROM python:3.9
   
   # 设置工作目录
   WORKDIR /app
   
   # 复制依赖文件并安装
   COPY requirements.txt ./
   RUN pip install -r requirements.txt
   
   # 复制项目文件
   COPY . .
   
   # 暴露端口
   EXPOSE 5000
   
   # 启动命令
   CMD ["python", "app.py"]
   
   ```

3. 多阶段构建（优化镜像大小）

   ``` dockerfile
   # 第一阶段：编译构建
   FROM node:14 AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   # 第二阶段：生成轻量级镜像
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

## 参考

[DockerFile](https://docs.docker.com/reference/dockerfile/#overview)
