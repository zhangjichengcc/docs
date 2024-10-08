# docker compose

## 常用配置

**`version: "3.8"`**
`version` 指定 Docker Compose 文件的格式版本。不同版本支持的功能不同，`3.8` 是目前最新的常用版本。

**`services`**
定义一组服务，每个服务对应一个容器。可以启动、停止、重启、管理这些服务。

**`image`**
指定容器使用的镜像。如果镜像不存在，会从 Docker Hub 下载。

**`build`**
用于从 Dockerfile 构建镜像。`context` 指定了 Dockerfile 所在的路径，`dockerfile` 用于指定文件名。

**`ports`**
端口映射，格式为 `主机端口:容器端口`，用于将容器的端口暴露到主机上。

**`environment` 和 `env_file`**
`environment` 内联定义环境变量，`env_file` 使用外部文件提供变量。

**`volumes`**
挂载主机目录到容器内。可以用于持久化数据或在开发过程中保持代码同步。

**`networks`**
定义网络，容器间可以通过网络通信。自定义网络可以避免不同容器使用默认网络。

**`depends_on`**
指定服务间的依赖关系。确保依赖的服务（如数据库）在应用服务启动前完成初始化。

**`restart`**
定义容器重启策略。可选项：

- `no`：不会自动重启
- `always`：容器退出时总是重启
- `on-failure`：容器因失败退出时才会重启
- `unless-stopped`：容器总是重启，除非被手动停止

``` yaml
version: "3.8"                      # 指定 Docker Compose 文件的版本

services:                           # 定义应用中的服务
  app:                              # 服务名
    image: node:14-alpine           # 基于哪个镜像来启动服务
    container_name: app_container   # 自定义容器名
    build:                          # 指定 Dockerfile 的构建配置
      context: ./app                # Dockerfile 所在目录
      dockerfile: Dockerfile        # Dockerfile 名称，默认为 Dockerfile
    ports:
      - "3000:3000"                 # 将主机的 3000 端口映射到容器内的 3000 端口
    environment:                    # 定义环境变量
      - NODE_ENV=production
    env_file:                       # 使用外部 .env 文件定义环境变量
      - .env
    volumes:                        # 挂载主机文件到容器内
      - ./app:/usr/src/app
      - /usr/src/app/node_modules   # 忽略某些挂载（常见的是 node_modules）
    networks:                       # 定义该服务所在的网络
      - app_network
    depends_on:                     # 设置依赖服务，确保某些服务先启动
      - db
    command: npm start              # 容器启动时执行的命令
    restart: always                 # 容器重启策略: no, always, on-failure, unless-stopped

  db:                               # 数据库服务
    image: mysql:5.7                # 使用 MySQL 镜像
    container_name: mysql_container
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"                 # 数据库端口映射
    volumes:
      - db_data:/var/lib/mysql      # 持久化数据库数据

volumes:                            # 定义数据卷，用于持久化存储
  db_data:

networks:                           # 定义自定义网络
  app_network:
    driver: bridge                  # 使用 bridge 网络驱动

```

## 示例

.env

``` bash
DB_USER=root
DB_PASSWORD=secret
DB_HOST=localhost
DB_PORT=3306
```

docker-compose.yaml

``` yaml
version: "3.8"  # 定义 Docker Compose 文件使用的版本。

# default-logging
x-logging:
  &default-logging  # 定义了一个可重用的日志配置别名，其他服务可以引用。
  options:          # 配置日志的大小和文件轮换策略。
    max-size: "300m"  # 单个日志文件的最大大小为 300MB。
    max-file: "1"     # 仅保留 1 个日志文件（超过后覆盖之前的日志）。
  driver: json-file  # 使用 json-file 作为日志驱动程序。

# services 定义了多个容器（服务）。
services:

  # nginx 服务器配置
  nginx:
    image: nginx:1.21.3  # 使用 Nginx 1.21.3 版本的官方镜像。
    container_name: nginx  # 容器名称为 nginx。
    logging: *default-logging  # 使用前面定义的日志配置。
    env_file:
      - common.env  # 使用名为 common.env 的文件来设置环境变量。
    networks:
      - tax_preference_network  # 该容器加入 tax_preference_network 网络。
    ports:  # 将宿主机的端口映射到容器内的端口。
      - "80:80"  # 将宿主机的 80 端口映射到容器的 80 端口，用于 HTTP。
      - "443:443"  # 将宿主机的 443 端口映射到容器的 443 端口，用于 HTTPS。
      - "8080:8080"  # 将宿主机的 8080 端口映射到容器的 8080 端口。
    volumes:  # 挂载本地目录到容器内，用于 Nginx 配置和证书。
      - ${PWD}/nginx/nginx.conf:/etc/nginx/nginx.conf  # 将本地的 nginx.conf 配置文件挂载到容器中。
      - ${PWD}/nginx/conf.d:/etc/nginx/conf.d  # 将本地的 conf.d 目录挂载到 Nginx 的 conf.d 目录。
      - ${PWD}/nginx/cert:/etc/cert  # 挂载本地证书目录到容器中的 /etc/cert。
      - ${PWD}/nginx/web:/opt/web  # 将本地的静态文件挂载到容器的 /opt/web 目录。

  # MySQL 数据库配置
  mysql:
    image: mysql:5.7  # 使用 MySQL 5.7 官方镜像。
    container_name: mysql  # 容器名称为 mysql。
    logging: *default-logging  # 使用前面定义的日志配置。
    env_file:
      - common.env  # 使用名为 common.env 的文件来设置环境变量。
    networks:
      - tax_preference_network  # 该容器加入 tax_preference_network 网络。
    ports:
      - "3306:3306"  # 将宿主机的 3306 端口映射到容器的 3306 端口，用于 MySQL 连接。
    volumes:  # 挂载本地数据卷以持久化数据库数据和配置文件。
      - /data/docker/mysql/data:/var/lib/mysql  # 将 MySQL 数据库数据保存到宿主机的 /data/docker/mysql/data。
      - ${PWD}/mysql/conf:/etc/mysql/mysql.conf.d  # 挂载 MySQL 配置文件目录。
    environment:  # MySQL 的环境变量配置。
      - "MYSQL_ROOT_PASSWORD=root"  # 设置 MySQL 的 root 用户密码为 "root"。
    command:
      --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --default-time-zone='+8:00'  # 设置字符集、排序规则和时区。

  # Redis 缓存配置
  redis:
    image: redis:6.2.6  # 使用 Redis 6.2.6 官方镜像。
    container_name: redis  # 容器名称为 redis。
    logging: *default-logging  # 使用前面定义的日志配置。
    env_file:
      - common.env  # 使用名为 common.env 的文件来设置环境变量。
    networks:
      - tax_preference_network  # 该容器加入 tax_preference_network 网络。
    ports:
      - "6379:6379"  # 将宿主机的 6379 端口映射到容器的 6379 端口，用于 Redis 连接。
    volumes:
      - ${PWD}/redis/redis.conf:/etc/redis/redis.conf  # 挂载 Redis 配置文件。
      - ${PWD}/redis/data:/data  # 将 Redis 的数据目录挂载到本地。
    command: redis-server /etc/redis/redis.conf --appendonly yes  # 启动 Redis，启用 appendonly 持久化模式。

  # MinIO 对象存储配置
  minio:
    image: minio/minio  # 使用 MinIO 官方镜像。
    container_name: minio  # 容器名称为 minio。
    logging: *default-logging  # 使用前面定义的日志配置。
    env_file:
      - common.env  # 使用名为 common.env 的文件来设置环境变量。
    networks:
      - tax_preference_network  # 该容器加入 tax_preference_network 网络。
    ports:
      - "9000:9000"  # 将宿主机的 9000 端口映射到容器的 9000 端口，用于 MinIO 服务。
      - "9001:9001"  # 将宿主机的 9001 端口映射到容器的 9001 端口，用于 MinIO 控制台。
    volumes:
      - /data/docker/minio:/data  # 持久化 MinIO 数据到本地目录。
    environment:  # MinIO 的环境变量。
      - "MINIO_ROOT_USER=root"  # 设置 MinIO 的 root 用户。
      - "MINIO_ROOT_PASSWORD=hcfAI123456"  # 设置 MinIO 的 root 用户密码。
      - "MINIO_ACCESS_KEY=tax_preference_dev"  # 设置 MinIO 的访问密钥。
      - "MINIO_SECRET_KEY=tax_preference_dev"  # 设置 MinIO 的秘密密钥。
    command: server /data --console-address ":9001"  # 启动 MinIO 服务，并指定控制台地址。

  # Elasticsearch 搜索引擎配置
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.1  # 使用 Elasticsearch 7.15.1 官方镜像。
    container_name: elasticsearch  # 容器名称为 elasticsearch。
    logging: *default-logging  # 使用前面定义的日志配置。
    env_file:
      - common.env  # 使用名为 common.env 的文件来设置环境变量。
    networks:
      - tax_preference_network  # 该容器加入 tax_preference_network 网络。
    environment:  # Elasticsearch 的环境变量配置。
      - "discovery.type=single-node"  # 设置 Elasticsearch 为单节点模式。
    ports:
      - "9200:9200"  # 将宿主机的 9200 端口映射到容器的 9200 端口，用于 Elasticsearch 连接。
    deploy:  # 配置资源限制。
      resources:
        limits:
          memory: 4G  # 限制最大内存使用 4GB。
        reservations:
          memory: 2G  # 保留 2GB 内存。
    volumes:  # 持久化 Elasticsearch 数据和插件目录。
      - es_data:/usr/share/elasticsearch/data  # 持久化数据到名为 es_data 的卷。
      - ${PWD}/elasticsearch/plugins:/usr/share/elasticsearch/plugins  # 挂载 Elasticsearch 插件目录。

  # RabbitMQ 消息队列配置
  rabbitmq:
    image: rabbitmq:3-management  # 使用带有管理控制台的 RabbitMQ 官方镜像。
    container_name: rabbitmq  # 容器名称为 rabbitmq。
    logging: *default-logging  # 使用前面定义的日志配置。
    env_file:
      - common.env  # 使用名为 common.env 的文件来设置环境变量。
    networks:
      - tax_preference_network  # 该容器加入 tax_preference_network 网络。
    environment:  # RabbitMQ 的环境变量配置。
      - "RABBITMQ_DEFAULT_VHOST=tax_preference_dev"  # 设置 RabbitMQ 的默认虚拟主机。
      - "RABBITMQ_DEFAULT_USER=tax_preference_dev"  # 设置 RabbitMQ 的默认用户名。
      - "RABBITMQ_DEFAULT_PASS=12345678Aa"  # 设置 RabbitMQ 的默认密码。
    ports:
      - "5672:5672"  # 将宿主机的 5672 端口映射到容器的 5672 端口，用于消息队列连接。
      - "15672:15672"  # 将宿主机的 15672 端口映射到容器的 15672 端口，用于管理界面。
    volumes:
      - /data/docker/rabbitmq:/var/lib/rabbitmq  # 持久化 RabbitMQ 数据。

# 定义数据卷
volumes:
  es_data:
    driver: local  # 定义本地数据卷，用于持久化 Elasticsearch 数据。

# 定义网络
networks:
  tax_preference_network:
    ipam:  # IP 地址管理配置。
      driver: default  # 使用默认的 IP 地址管理驱动。
      config:
        - subnet: "192.168.13.0/24"  # 为网络指定子网范围。

```

``` yaml
version: "3.8"  # 定义 Docker Compose 文件的版本。3.8 是一种稳定且常用的版本。

# default-logging: 定义一个默认的日志配置，可以复用在多个服务中。
x-logging:
  &default-logging  # 通过 YAML 锚点 (&default-logging) 定义一个可重用的日志配置。
  options:
    max-size: "300m"  # 日志文件的最大大小为 300MB。
    max-file: "1"  # 最多保留 1 个日志文件（意味着当日志文件达到 max-size 时将覆盖之前的日志）。
  driver: json-file  # 日志驱动，使用 JSON 文件格式保存日志。

# services: 定义一组服务，每个服务将运行在单独的容器中。
services:
  # tax-preference-server: 定义税务优惠服务器的服务。
  tax-preference-server:
    image: 172.16.122.15:5000/tax-preference-server:0.0.5  # 使用私有仓库的镜像，版本为 0.0.5。
    container_name: tax-preference-server  # 容器名称为 tax-preference-server。
    logging: *default-logging  # 复用上面定义的日志配置（&default-logging）。
    env_file:
      - common.env  # 使用外部的环境变量文件（common.env），其中包含服务需要的环境变量。
    networks:
      - tax_preference_network  # 该服务将连接到名为 tax_preference_network 的网络。
    volumes:
      # 将主机上的 ./logs/tax-preference-server 目录挂载到容器内的 /logs/tax-preference-server 目录，用于存放服务日志。
      - ./logs/tax-preference-server:/logs/tax-preference-server
    ports:
      - "9090:9090"  # 将主机的 9090 端口映射到容器内的 9090 端口。
      - "5090:5005"  # 将主机的 5090 端口映射到容器内的 5005 端口，通常用于调试或其他用途。

  # tax-preference-web: 定义税务优惠 Web 前端服务。
  tax-preference-web:
    image: hai-registry:5000/tax-preference-web:0.0.5  # 使用另一个私有仓库的镜像，版本为 0.0.5。
    # image: af5858280f37  # 这行注释可能用于记录先前镜像的 ID，方便回滚或对比。
    container_name: tax-preference-web  # 容器名称为 tax-preference-web。
    logging: *default-logging  # 复用相同的日志配置。
    env_file:
      - common.env  # 使用相同的环境变量文件。
    networks:
      - tax_preference_network  # 连接到相同的网络，方便服务之间的通信。
    ports:
      - "3000:3000"  # 将主机的 3000 端口映射到容器的 3000 端口，通常用于前端 Web 服务的访问。

# networks: 定义该服务集群所使用的网络。
networks:
  tax_preference_network:  # 创建一个名为 tax_preference_network 的自定义网络。
    ipam:  # IP 地址管理配置。
      driver: default  # 使用默认的 IP 地址管理驱动。
      config:
        - subnet: "192.168.13.0/24"  # 定义子网，服务将在该子网内分配 IP 地址，范围是 192.168.13.0 到 192.168.13.255。
```
