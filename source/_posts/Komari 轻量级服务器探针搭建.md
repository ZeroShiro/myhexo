---
title: Komari 轻量级服务器探针搭建
date: 2026-05-31 20:40
updated: 2026-05-31 20:40
tags:
  - 服务器
  - 探针
  - Docker
categories:
  - 后端运维
toc: true
excerpt: 极简高颜值的轻量级服务器状态监控工具 Komari 部署教程。
cover: https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-服务1.17613aizv7.jpg
---

## 1. 安装方式

Komari 服务端部署非常简单，官方提供了一键脚本和 Docker 两种安装方式。

如果你喜欢保持系统环境整洁，或者后续有迁移、备份需求，推荐直接使用 Docker 部署。

### 方式 1：一键管理脚本

适用于 Ubuntu、Debian 等支持 systemd 的 Linux 发行版。

```bash
curl -fsSL https://raw.githubusercontent.com/komari-monitor/komari/main/install-komari.sh
chmod +x install-komari.sh
sudo ./install-komari.sh
```

### 方式 2：Docker 部署（推荐）

```bash
mkdir -p ./data
docker run -d \
  -p 25774:25774 \
  -v $(pwd)/data:/app/data \
  --name komari \
  --restart unless-stopped \
  ghcr.io/komari-monitor/komari:latest

docker logs komari
```

启动成功后，访问：

```text
http://你的服务器IP:25774
```

即可进入 Komari 初始化界面。

---

## 2. Agent 自动发现

完成 Dashboard 部署并首次登录后，可以使用 Komari 提供的 Agent 自动发现功能快速接入服务器节点。

### 添加本机节点

对于运行 Dashboard 的服务器，Komari 会自动识别当前主机，并提示将其添加为受控节点。

![mys-komari自动发现](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-komari自动发现.5mog8jal14.jpg)

点击添加后，即可立即开始监控当前服务器的运行状态。

### 自动发现外部节点

如果需要监控其他 VPS 或独立服务器，可以在目标服务器执行以下命令：

```bash
bash <(curl -sL https://raw.githubusercontent.com/komari-monitor/komari-agent/refs/heads/main/install.sh) -e https://example.com --auto-discovery <AD Key>
```

参数说明：

* `https://example.com` 替换为你的 Komari 面板地址
* `<AD Key>` 替换为后台生成的自动发现密钥
* 确保目标服务器能够正常访问 Komari 面板

安装完成后，Agent 会自动注册到控制面板，无需手动配置 Token。

---

## 3. 配置与进阶使用

节点接入完成后，可以在后台进行进一步管理和配置。

### 节点管理

支持修改节点名称、调整服务器分组以及管理所有已接入节点。

### 告警通知

Komari 支持 CPU、内存、磁盘以及节点离线等告警。

通过 Webhook 可以接入 Telegram、企业微信、飞书等通知平台，在服务器异常时及时收到提醒。

### 前端定制

Komari 拥有现代化的界面设计，并且完全开源。

如果具备前端开发能力，可以自行修改主题样式、页面布局或接入其他图表组件，打造符合个人需求的监控面板。

---

## 4. 总结

作为一款轻量级服务器监控工具，Komari 在易用性和颜值方面都表现不错。

无论是个人博客、家庭实验室还是 VPS 集群监控，都能够快速完成部署并投入使用。同时较低的资源占用也不会对服务器上的其他业务产生明显影响。

![mys-服务1](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-服务1.17613aizv7.jpg)