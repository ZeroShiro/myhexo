---
title: GL.iNet MT3000 软件路由刷机 iStoreOS 及 FRP 内网穿透全指南
date: 2025-04-15 15:32
updated: 2025-04-15 15:32
tags:
  - Linux
  - OpenWrt
  - FRP
categories:
  - Linux
toc: true
excerpt: 记录 GL.iNet MT3000 刷入 iStoreOS 固件，并配合阿里云 VPS 搭建 FRP 内网穿透实现远程访问的完整流程。
---

![MT3000](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-mt3000.70atbl5nl8.jpg)

## 一、 MT3000 刷入 iStoreOS

iStoreOS 是基于 OpenWrt 优化的固件，拥有更好用的应用商店和 UI 界面，非常适合作为旁路由或主路由使用。

### 1. 固件与工具下载
* **GL.iNet 原厂 U-BOOT 固件（备用/救砖）**: [点击前往 gl-inet.cn 下载](https://dl.gl-inet.cn/router/mt3000/stable)
* **iStoreOS 固件下载**: [点击前往 fw.koolcenter.com](https://fw.koolcenter.com/iStoreOS/glinet_mt3000/)
    * *注意：请下载 `glinet_mt3000-squashfs-sysupgrade.bin` 格式的文件。*

### 2. 进入 U-Boot 模式刷机
1.  拔掉路由器电源。
2.  按住机身上的 `Reset` 键不放，同时插入电源。
3.  观察指示灯，当蓝灯闪烁 5-6 次转为**白灯常亮**时，松开 Reset 键。
4.  电脑网线连接路由器的 LAN 口，将电脑 IP 设置为静态 `192.168.1.2`。
5.  浏览器访问 `192.168.1.1`，进入 U-Boot Web 界面。
6.  选择下载好的 iStoreOS `.bin` 固件进行上传更新。

### 3. 初始设置
刷机完成后，电脑 IP 改回自动获取。
* **后台管理地址**: `192.168.100.1` (iStoreOS 默认)
* **默认密码**: `password`

iStoreOS 后台预览：
![mys-istoreOS](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-istoreOS.pftdprvwg.jpg)

---

## 二、 服务端配置 (VPS)

前提：你需要一台拥公网 IP 的服务器（如阿里云、腾讯云等）。

### 1. 环境准备
* **防火墙设置**：在云服务商的安全组中放行以下端口：
    * `8002` (FRP 通信端口)
    * `8080` (FRP 面板端口，可选)
    * 以及你计划穿透的其他业务端口。

### 2. 下载并安装 FRP
请先确认服务器架构（一般为 `amd64`）。

```bash
# 1. 下载 FRP (以 v0.58.1 为例)
wget [https://github.com/fatedier/frp/releases/download/v0.58.1/frp_0.58.1_linux_amd64.tar.gz](https://github.com/fatedier/frp/releases/download/v0.58.1/frp_0.58.1_linux_amd64.tar.gz)

# 2. 解压
tar -zxvf frp_0.58.1_linux_amd64.tar.gz

# 3. 进入目录
cd frp_0.58.1_linux_amd64/

# 4. 移动二进制文件到系统路径 (可选，方便调用)
sudo cp frps /usr/local/bin/
sudo mkdir /etc/frp
sudo cp frps.toml /etc/frp/
```

### 3. 修改配置文件
编辑配置文件 `vi /etc/frp/frps.toml`，写入以下内容：

```toml
# frps.toml
bindPort = 8002

#这部分是后台看板配置（可选）
webServer.addr = "0.0.0.0"
webServer.port = 8080
webServer.user = "admin"
webServer.password = "admin123"

# 身份验证令牌（可选 建议修改复杂一点）
auth.method = "token"
auth.token = "MySecretToken123"
```

### 4. 设置开机自启 (Systemd)
为了防止服务器重启后 FRP 断开，建议创建服务文件。

`vi /etc/systemd/system/frps.service`

```ini
[Unit]
Description=frps service
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
# 注意修改为你实际的配置文件路径
ExecStart=/usr/local/bin/frps -c /etc/frp/frps.toml
Restart=always

[Install]
WantedBy=multi-user.target
```

启动并启用服务：
```bash
systemctl daemon-reload
systemctl start frps
systemctl enable frps
```

---

## 三、 客户端配置 (OpenWrt/iStoreOS)

### 1. 安装 FRP 插件
在 iStoreOS 的“iStore”商店中搜索并安装 FRP 客户端，或者直接在“服务”菜单中找到。

![mys-frp-管理入口](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-frp-管理入口.6bhjrl36jk.jpg)

### 2. 配置连接
虽然 iStoreOS 提供了 UI 界面，但了解底层配置有助于排错。

**方式 A：UI 界面设置 (推荐)**
* **服务器地址**: 填写 VPS 的公网 IP
* **服务器端口**: `8002`
* **Token**: `MySecretToken123` (需与服务端一致)
* **添加规则**:
    * 类型: TCP
    * 本地 IP: `192.168.100.1` (路由自身)
    * 本地端口: `80`
    * 远程端口: 例如 `8080` (访问 VPS:8080 即转发到路由:80)

**方式 B：终端命令调试**
如果你需要通过 SSH 查看配置或调试：

![mys-bash-istoreOS](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-bash-istoreOS.3k8hjiyg7x.jpg)

```bash
# 查看 OpenWrt UCI 配置文件
vi /etc/config/frpc

# 典型配置结构如下：
# config init
# 	option server_addr '120.27.xx.xx'
# 	option server_port '8002'
# 	option token 'MySecretToken123'
#   ...

# 查看运行日志 (排错利器)
logread -e frpc

# 重启客户端服务
/etc/init.d/frpc restart
```

---

## 四、 验证结果

当服务端和客户端均启动成功后，访问：`http://VPS_IP:8080`，可以看到连接状态。

![mys-frps-success](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-frps-success.b9dmvytm0.jpg)
![mys-istoreOS-success](https://cdn.jsdelivr.net/gh/ZeroShiro/picx-images-hosting@master/myBlog/mys-istoreOS-success.1sfions768.jpg)