# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 将 Docsify 项目的文件复制到 Nginx 的 web 目录
COPY ./ /usr/share/nginx/html

# 暴露 Nginx 默认的端口 80
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]