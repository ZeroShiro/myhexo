---
title: PicX 使用指南：构建高效免费的 GitHub 图床系统
date: 2026-03-30 15:32
updated: 2026-03-30 15:32
tags:
  - 工具
  - GitHub
categories:
  - GitHub
toc: true
excerpt: 推荐一款基于 GitHub API 的高颜值、易上手的免费图床工具——PicX。
cover: https://picx-docs.xpoet.cn/assets/img-7.Da15Znu4.png
---

**PicX** 是一款基于 GitHub API 开发的开源图床解决方案。它不仅具备简洁清晰的用户界面，更极大程度地简化了 GitHub 图床的初始配置与日常使用流程。

## 一、 系统登录与授权机制

由于 PicX 的核心服务依赖于 GitHub API，用户需先完成账户绑定。系统提供两种身份验证方式，建议优先采用 GitHub OAuth 授权登录。

### 1. GitHub OAuth 授权登录（推荐方案）
首次使用时，需在 GitHub 账户中安装 `PicX GitHub APP`。点击登录界面的“安装 PicX GitHub APP”按钮，系统将引导您至 GitHub 进行应用部署。此步骤旨在授予 PicX 必要的仓库读写权限，仅需执行一次。

![安装 PicX GitHub APP](https://picx-docs.xpoet.cn/assets/img-1.SmF2HX15.png)

安装完成后，页面将自动重定向至 PicX 平台。此时点击 **`GitHub OAuth 授权登录`** 按钮，系统将自动完成后续环境准备。

![授权确认](https://picx-docs.xpoet.cn/assets/img-7.Da15Znu4.png)

### 2. Personal Access Token 登录
若您出于安全策略考量或更倾向于手动管理凭证，可选择使用 GitHub 提供的 Personal Access Token 进行登录。在生成 Token 时，请务必勾选 `repo` 权限。

![生成 Token](https://picx-docs.xpoet.cn/assets/img-9.sNyX8yes.png)

获取 Token 后，将其填入 PicX 的登录输入框，并点击“一键配置”以完成系统接入。

---

## 二、 自动化图床配置

为进一步降低用户的操作成本，PicX 自 v3.0 版本起对系统底层逻辑进行了大幅优化。

在您通过上述任一方式完成登录并触发“一键配置”后，系统将在您的 GitHub 账户下自动创建一个名为 `picx-images-hosting` 的专属存储仓库，并默认部署于 `master` 分支。

![一键配置界面](https://picx-docs.xpoet.cn/assets/img-17.Cn3ljBG3.png)

> **说明：** > 当前版本已取消自定义仓库与分支的选择功能，统一采用系统标准化的仓库架构。若您此前拥有旧的图床仓库，可以通过 PicX 内置的“图片迁移”功能，将历史数据平滑同步至全新的默认仓库中。

---

## 三、 高效的图片上传模块

配置环节完成后，系统将进入核心的图片上传工作台。PicX 致力于提供流畅的交互体验，并支持以下三种文件导入方式：

1. **拖曳上传**：将本地图片文件直接拖拽至指定的交互区域。
2. **剪贴板读取（高效推荐）**：完成屏幕截图或复制图片后，在页面任意位置使用快捷键 **`Ctrl + V`**（Windows）或 **`Command + V`**（macOS），图片将被自动添加至待上传队列。
3. **本地选择**：点击上传区域，通过系统文件管理器选取目标图片。

![上传区域演示](https://picx-docs.xpoet.cn/assets/img-14.BaIHWSyx.png)

将图片载入后，按下快捷键 **`Ctrl + S`** 或 **`Command + S`** 即可执行上传指令。上传成功后，PicX 会**自动生成并复制**该图片的 Markdown 格式链接至系统剪贴板。用户可直接在文档编辑器中执行粘贴操作，显著提升了排版效率。

![上传成功与复制链接](https://picx-docs.xpoet.cn/assets/img-16.BUUqhf_j.png)

---

## 四、 核心操作流程演示

为便于您更直观地了解系统的整体运作与交互逻辑，可参考下方的标准操作演示：

![PicX 快速开始演示](https://picx-docs.xpoet.cn/assets/picx-quick-start.cuveZe7h.gif)

---