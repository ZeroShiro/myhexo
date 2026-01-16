---
title: Docker 在服务器部署独立 ChatGPT Web AI对话
date: 2025-12-24 15:32:00
updated: 2025-12-24 15:32:00
tags:
  - Docker
  - AI
categories:
  - AI
toc: true
excerpt: 本文记录如何使用 Docker 部署 ChatGPT Web 项目，并配合 Caddy 实现域名反向代理。
cover: https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-msg-ai.2kset8w44g.jpg
---

## 1. 项目与运行
项目地址：[https://github.com/ZeroShiro/chatgpt-web](https://github.com/ZeroShiro/chatgpt-web)


```shell
# node -v 最好 > 16 版本
node -v 
# 安装使用pnpm 
npm install pnpm -g
# 进入文件夹 `/service` 运行以下命令
pnpm install
# 根目录下运行以下命令
pnpm bootstrap
# 网页
pnpm dev
```

## 2. 构建镜像 (本地操作)
> 如果你直接使用现有的 Docker 镜像，可跳过此步。

![mys-docker-desktop](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-docker-desktop.8vner3rjli.jpg)

~~~bash
# 1. 登录 Docker Hub
docker login
# i Info → To login with a different account, run 'docker logout' followed by 'docker login'
# Login Succeeded

# 2. 构建并推送 (指定 platform 为 linux/amd64 以适配服务器)
docker buildx build --platform linux/amd64 -t zeroshiro/chatgpt-web:latest .
docker push zeroshiro/chatgpt-web:latest
~~~

## 3. 服务器端部署

### 创建目录
~~~bash
mkdir -p /opt/chatgpt-web  # 如果目录不存在，先创建它
cd /opt/chatgpt-web        # 进入目录
~~~

### 配置 docker-compose.yml
使用编辑器创建并修改文件：
~~~bash
nano docker-compose.yml
~~~

写入以下内容：

~~~yaml
services:
  app:
    image: zeroshiro/chatgpt-web:latest
    container_name: chatgpt-web
    restart: always
    ports:
      - "127.0.0.1:3002:3002"
    environment:
      # --- 你的配置 ---

      # 1. 你的 API Key
      - OPENAI_API_KEY=sk-***********

      # 2. 你的中转接口地址
      # 注意：通常中转地址不需要带 /v1，如果无法对话，请尝试删掉结尾的 /v1 再试
      - OPENAI_API_BASE_URL=https://api.openai.com

      # 3. [重要] 访问密码，防止被滥用
      - AUTH_SECRET_KEY=123456

      # 4. 其他设置
      - TIMEOUT_MS=100000
      - OPENAI_API_MODEL=gpt-3.5-turbo
~~~


### 拉取镜像并启动服务
~~~bash
# 拉取最新镜像
docker compose pull

# 后台启动服务
docker compose up -d

# (可选) 查看日志
docker compose logs -f
~~~

## 4. 使用 Caddy 反向代理

在你的 `Caddyfile` 中添加以下配置：

~~~caddy
chat.mysit.vip {
    # 将流量转发给本地的 Docker 容器
    reverse_proxy 127.0.0.1:3002
}
~~~

保存后重载 Caddy：
~~~bash
caddy reload
~~~

## 5.预览
![mys-chat-message](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-chat-message.4g4zluqugo.jpg)