---
title: fail2ban 使用和防护服务器
date: 2025-03-15 15:32
updated: 2025-03-15 15:32
tags:
  - Linux
  - fail2ban
categories:
  - Linux
toc: true
excerpt: 记录 fail2ban 安装、配置与常用运维命令
---

### 1. 安装 fail2ban
```bash
sudo apt update
sudo apt install fail2ban -y
```

### 2. 初始化配置
默认配置文件 `jail.conf` 会随软件更新被覆盖，**必须**复制一份 `jail.local` 进行修改。
```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

### 3. 编辑防护规则
在 `jail.local` 文件中找到 or 添加 `[sshd]` 模块，写入以下内容：
```ini
[sshd]
enabled = true

# ⚠️ 端口必须与 /etc/ssh/sshd_config 中的 Port 一致 (默认22)
port = 22

# 【关键配置】Debian 12 / Ubuntu 22+ 必须指定 backend 为 systemd
# 注意：此时不需要设置 logpath，它会自动读取系统日志
backend = systemd

# --- 封禁策略 ---
# 允许失败次数 (超过此次数即封禁)
maxretry = 3
# 统计时间窗口 (在此时间内累计失败 maxretry 次则触发封禁)
findtime = 1h
# 封禁时长 (支持 m/h/d，例如 1d = 1天)
bantime  = 1d

# --- 白名单 (可选) ---
# 建议将自己的 IP 加入白名单，防止误封。多个 IP 用空格隔开
# ignoreip = 127.0.0.1/8 ::1 你的静态IP
```

### 4. 服务管理
```bash
# 启动服务
sudo systemctl start fail2ban
# 设置开机自启
sudo systemctl enable fail2ban

# 修改配置后重载 (无须重启服务)
sudo systemctl reload fail2ban
```

### 5. 查询状态
查看 SSH 监狱的运行状态及被封禁的 IP 列表：
```bash
sudo fail2ban-client status sshd
```

**输出示例：**
```text
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  |- Total failed: 5
|  `- Journal matches:  _SYSTEMD_UNIT=sshd.service + _COMM=sshd
`- Actions
   |- Currently banned: 1
   |- Total banned: 2
   `- Banned IP list: 192.168.10.5
```

### 6. 手动解封 IP
如果误封了正常 IP，使用以下命令解封：
```bash
# 语法：fail2ban-client set [服务名] unbanip [IP地址]
sudo fail2ban-client set sshd unbanip 192.168.1.x
```