# 总览

**Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。**它是目前最流行的 Linux 容器解决方案。

Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 Docker，就不用担心环境问题。

总体来说，Docker 的接口相当简单，用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

Docker 的主要用途，目前有三大类。

**（1）提供一次性的环境。**比如，本地测试他人的软件、持续集成的时候提供单元测试和构建的环境。

**（2）提供弹性的云服务。**因为 Docker 容器可以随开随关，很适合动态扩容和缩容。

**（3）组建微服务架构。**通过多个容器，一台机器可以跑多个服务，因此在本机就可以模拟出微服务架构。

## Docker 指令

### 容器管理

#### 查看容器

``` bash
# 查看运行中的容器
$ docker ps | docker container ls

# 查看所有容器，包括停止的
$ docker ps -a | docker container ls -a

# 查看特定容器的详细信息
$ docker inspect <container_id_or_name>

# 查看容器的日志
$ docker logs <container_id_or_name>

# 查看容器的资源使用情况 这个命令会实时显示所有容器的 CPU、内存、网络 I/O 和磁盘 I/O 等使用情况。
$ docker stats

# 查看特定容器的环境变量和配置
$ docker inspect --format='{{json .Config.Env}}' <container_id_or_name>
```

#### 创建容器

``` bash
$ docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

# 后台运行（Detached 模式）
-d: docker run -d <image_name>

# 交互模式
-i：保持标准输入打开。
-t：为容器分配一个伪终端。
-it: docker run -it <image_name> /bin/bash

# 映射端口
-p: docker run -p 8080:80 <image_name> # 将宿主机的端口（左边的 8080）映射到容器的端口（右边的 80）。

# 挂载卷
# 将宿主机目录或文件（左边的 /host/path）挂载到容器的目录（右边的 /container/path）。
-v: docker run -v /host/path:/container/path <image_name>

# 设置环境变量
-e: docker run -e ENV_VAR=value <image_name>

# 引入环境变量文件
--env-file: docker run --env-file <envFile_name> <image_name>

# 命名容器
--name: docker run --name my_container <image_name>

# 删除容器（自动清理）
--rm: docker run --rm <image_name>

# 限制 CPU 和内存使用
--cpus：限制容器可用的 CPU 数量。
--memory：限制容器可用的内存大小。

$ docker run --cpus="1.5" --memory="512m" <image_name>
```

#### 启用/停用/重启容器

```bash
# 启动已经创建但处于停止状态的容器
$ docker start [OPTIONS] CONTAINER

CONTAINER：容器的名称或 ID。
# 常用选项：
-a：附加到容器的标准输入输出（类似 docker attach）。
-i：开启容器的交互模式（适用于带有终端的容器）。
# 启动容器并附加到其终端：
$ docker start -ai my_container

# 停止正在运行的容器（它会发送一个 SIGTERM 信号给容器内部的进程，允许其有序关闭。如果容器在一段时间内没有响应，它会发送 SIGKILL 信号强制关闭。）
$ docker stop [OPTIONS] CONTAINER
#CONTAINER：容器的名称或 ID。
# 常用选项：
-t：指定 Docker 在发送 SIGKILL 之前等待容器停止的超时时间（默认为 10 秒）。

# 重启容器
$ docker restart [OPTIONS] CONTAINER
# CONTAINER：要重启的容器名称或 ID。
# 常用选项：
-t：指定在发送 SIGKILL 之前等待容器停止的超时时间（默认为 10 秒）。
```

### 删除容器

``` bash
# 删除已停止的容器
$ docker rm <container_name_or_id>
# 强制删除运行中的容器
$ docker rm -f <container_name_or_id>
# 删除所有已停止的容器
$ docker container prune
```

### 在已经运行的 Docker 容器中执行命令

``` bash
$ docker exec [OPTIONS] CONTAINER COMMAND [ARG...]

# 进入运行中的容器并执行命令
$ docker exec -it <container_name_or_id> /bin/bash
```

`CONTAINER`：运行的容器的名称或 ID。

`COMMAND`：在容器内要执行的命令。

`[ARG...]`：传递给命令的参数（可选）。

常用选项

- `-i`：保持容器的标准输入打开。
- `-t`：为命令分配一个伪终端（通常与 `-i` 一起使用，形成交互式终端 `-it`）。
- `-d`：让命令在容器中后台执行。
- `--user`：以指定的用户身份执行命令。

---

### 镜像管理

#### 查看镜像

``` bash
# 查看本地镜像列表
$ docker images
$ docker image ls

# 显示所有镜像，包括中间层和 dangling（悬空）镜像
$ docker images -a/--all
$ docker image ls -a/--all
# output
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my-app              latest              d1f8a6d5b1c4        2 days ago          150MB
nginx               latest              5e9b9f0f9b4d        3 weeks ago        133MB
<none>              <none>              7e4c10e4d2e0        4 weeks ago        250MB
在这个列表中，<none> 表示没有标签的镜像，也就是 dangling 镜像。使用 `docker images -a` 命令可以帮助你更全面地了解本地的镜像情况。

# 查看镜像的详细信息
$ docker inspect <image_id_or_name>

# 查看特定镜像的历史
$ docker history <image_id_or_name>

# 查看镜像的层（layers）
$ docker image ls -f "dangling=false" # 这会列出所有非悬空（非 dangling）的镜像层。

# 查看特定镜像的标签
$ docker images <image_name>

# 查看特定镜像的配置
$ docker inspect --format='{{json .Config}}' <image_id_or_name>
```

#### 打包镜像

``` bash
$ docker build [OPTIONS] PATH | URL | -

# OPTIONS
# 打包镜像
-t: docker build -t `images_name:images_tag` .
# 指定 DockerFile 配置文件
-f: docker build -f `dockerFilePath` .
# 不使用缓存
--no-catch: docker build --no-cache -t `images_name:images_tag` .
# 传递构建时的变量
--build-arg: docker build --build-arg `ENV=production` -t `images_name:images_tag` .
```

#### 删除镜像

``` bash
# 删除未使用镜像
$ docker rmi <image_name_or_id>
# 强制删除镜像（已被容器使用的）
$ docker rmi -f <image_name_or_id>
# 删除未被任何容器使用的所有镜像（称为悬空镜像，dangling images）
$ docker image prune
# 删除所有未使用的镜像，无论它们是否悬空
$ docker image prune -a
```

### 网络管理

#### 查看网络

``` bash
docker network ls
```

#### 创建网络

``` bash
docker network create <network_name>
```

#### 连接容器到网络

``` bash
docker network connect <network_name> <container_name_or_id>
```

### 数据卷管理

#### 创建数据卷

``` bash
docker volume create <volume_name>
```

#### 挂载数据卷到容器

``` bash
docker run -v <volume_name>:/path/in/container <image_name>
```

#### 列出数据卷

``` bash
docker volume ls
```

#### 删除数据卷

``` bash
docker volume rm <volume_name>

# 删除所有未使用的数据卷
docker volume prune
```

### 系统清理

``` bash
# 清理未使用的资源（容器、镜像、网络、数据卷等）
$ docker system prune

# 清理所有未使用的资源（包括停止的容器、未被引用的镜像、未使用的网络和数据卷）
$ docker system prune -a

```

### Docker Compose 命令

如果使用 `docker-compose.yml` 文件管理多容器应用，常用的 Docker Compose 命令有：

``` bash
# 启动服务
docker-compose up

# 后台运行
docker-compose up -d

# 停止服务
docker-compose down
```

### 系统信息

``` bash
# 查看 Docker 系统信息
docker info
# 查看 Docker 版本
docker --version
```

### 镜像/容器导出和导入

`docker save`/ `docker load`

- **作用**：用于导出 **镜像**，包括镜像的所有层（layers）以及其相关的元数据（metadata，如 Dockerfile 中的指令、历史记录等）。
- **适用场景**：当你想要将镜像从一台主机移动到另一台主机并保留镜像的所有信息时，使用 `docker save`。
- **输出内容**：生成的 `.tar` 文件包含镜像的所有层和相关的元数据，可以在其他 Docker 环境中加载并恢复为相同的镜像。

``` bash
# 导出镜像
docker save -o <output_file.tar> <image_name:tag>

# 导入镜像
docker load -i <output_file.tar>
```

`docker export`/ docker import

- **作用**：用于导出 **容器** 的文件系统，将容器的当前文件系统打包为 `.tar` 文件，但 **不包含容器的历史记录**、元数据或 Docker 的层次结构信息。

- **适用场景**：当你只需要容器的当前文件系统而不关心 Docker 镜像层和历史信息时，使用 `docker export`。常用于备份或迁移容器内的文件。

- **输出内容**：只导出容器的文件系统，不包括镜像的层次信息和 Dockerfile 指令等元数据。

``` bash
# 导出容器（将容器的文件系统导出为 tar 包）
docker export <container_id> > container.tar

# 导入容器（从 tar 包导入文件系统为新镜像）
docker import <container.tar> <new_image_name>
```

### 区别总结

| 特性         | `docker save`                    | `docker export`                              |
| ------------ | -------------------------------- | -------------------------------------------- |
| 导出的对象   | 镜像                             | 容器的文件系统                               |
| 包含的内容   | 镜像的所有层、历史记录、元数据   | 仅容器文件系统，**不包含镜像历史和元数据**   |
| 导入命令     | `docker load`                    | `docker import`                              |
| 使用场景     | 迁移镜像，保留完整的镜像层和历史 | 导出容器的当前文件系统，不关心镜像的构建历史 |
| 支持增量镜像 | 是                               | 否                                           |

**`docker save`** 适用于导出和分享完整的 Docker 镜像。

**`docker export`** 适用于仅备份或迁移容器的文件系统，不关心镜像的详细构建历史。

docker-compose.yml

``` yaml
version: "3.8"
# default-logging
x-logging:
  &default-logging
  options:
    max-size: "300m"
    max-file: "1"
  driver: json-file
# services
services:
  # tax-preference-server
  tax-preference-server:
    image: 172.16.122.15:5000/tax-preference-server:0.0.5
    container_name: tax-preference-server
    logging: *default-logging
    env_file:
      - common.env
    networks:
      - tax_preference_network
    volumes:
      # 服务日志挂载
      - ./logs/tax-preference-server:/logs/tax-preference-server
    ports:
      - "9090:9090"
      - "5090:5005"

  tax-preference-web:
    image: hai-registry:5000/tax-preference-web:0.0.5
    #image: af5858280f37
    container_name: tax-preference-web
    logging: *default-logging
    env_file:
      - common.env
    networks:
      - tax_preference_network
    ports:
      - "3000:3000"
networks:
  tax_preference_network:
    ipam:
      driver: default
      config:
        - subnet: "192.168.13.0/24"
```

### 其他

#### 关于 ARG 和 ENV

构建镜像时传入的参数，可以在运行时使用

``` bash
# 构建镜像文件
$ docker build --build-arg ENV=production -t images_name:images_tag .
```

构建文件，DockerFile，可以使用构建时传入的参数

``` dockerfile
# 基础镜像
FROM node:18

# 定义构建时的变量
ARG ENV

# 打印变量（可选）
RUN echo "Building in ${ENV} mode"

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 根据传入的环境变量选择安装不同的依赖
RUN if [ "$ENV" = "production" ]; then \
        npm install --only=production; \
    else \
        npm install; \
    fi

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
```

注意事项

**ARG vs ENV**: `ARG` 用于构建时的环境变量，在镜像创建后不可用；而 `ENV` 用于设置运行时环境变量，可以在容器运行时访问。你可以在 `Dockerfile` 中将 `ARG` 的值赋给 `ENV` 变量，以便在运行时访问。

``` dockerfile
# 将构建时的 ARG 值赋给运行时的 ENV
ENV ENV_MODE=${ENV}
```

## 引用

[docker 中文](https://www.docker.org.cn/index.html)
[Docker官方文档中文版+个人总结](https://github.com/feixuek/docker?tab=readme-ov-file)
