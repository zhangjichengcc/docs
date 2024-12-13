# My Docs

> 个人学习文档

## 关于项目

- 本地开发

  ``` bash
    # 启动 docsify 服务，端口默认 3000
    $ npm start
  ```

- 本地 Docker 调试

  ``` bash
    # 停止并删除旧容器，打包新镜像
    $ bash docker-build
    # 启动镜像，端口 8101
    # bash docker-run
  ```

- 服务器部署
  项目采用github CI/CD 进行自动化集成部署，代码提交到 main 分支后，会自行构建，详情请查看文件 [./github/workflow/deploy.yaml`](./.github/workflows/deploy.yml)
  - 将代码上传到服务器
  - 停止删除旧容器，备份镜像，创建容器
  - 容器开放`80`端口，并将宿主机的`8101`端口映射到容器的`80`端口 `docker run -d --name ${{ env.CONTAINER_NAME }} -p 8101:80 ${{ env.IMAGE_NAME }}`
  - 宿主机 nginx 配置，监听 8101 端口进行反向代理到 443，并配置域名及缓存策略

## 参考文献

[docsify 官网](https://docsify.js.org/#/)

[docsify them 中文切换文档](https://sushantrahate.github.io/docsify-darkly-theme/#/)

[插件大全](https://www.itrma.com/75.html)

[docsify-ssr-demo](https://github.com/docsifyjs/docsify-ssr-demo/blob/master/package.json)
