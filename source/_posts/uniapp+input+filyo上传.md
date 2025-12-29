---
title: uni-app 中使用 input 和 flyio 实现文件上传
date: 2020-05-14 16:55
updated: 2020-05-14 16:55
tags:
  - 小程序
  - uni-app
  - JavaScript
categories:
  - 前端开发
toc: true
excerpt: 本文介绍了在 uni-app 项目中如何使用动态创建的 input 元素配合 flyio 库实现文件上传功能。
---

在 uni-app 开发中，有时需要动态创建文件上传组件。以下是使用 `input` 元素和 `flyio` 实现文件上传的示例代码。

## 文件上传初始化

```javascript
// 文件上传初始化
function initUploadFile() {
  // 创建 input 元素
  let input = document.createElement("input");
  input.type = "file";
  input.classList = "input_file";
  input.onchange = (e) => {
    this.ChooseFile(e);
  };
  // 插入到指定元素中
  this.$refs.input.$el.appendChild(input);
}
```

## 上传附件

```javascript
// 上传附件
function ChooseFile(e) {
  let form = new FormData();
  let sourceId = this.id;
  let files = e.target.files[0];
  
  // 设置需要的字段
  form.append("files", files);
  form.append("sourceId", sourceId);
  
  // 使用 flyio 上传
  this.$fly
    .post(`UploadFile_url`, form)
    .then((res) => {
      // 成功处理
    })
    .catch((err) => {
      // 失败处理
    });
}
```

## 注意事项

1. 确保在使用前已经引入并配置好 `flyio` 库
2. `this.$refs.input.$el` 需要指向一个有效的 DOM 元素
3. 文件上传接口地址 `UploadFile_url` 需要替换为实际的上传地址
4. 根据实际需求调整 `FormData` 中的字段名称和值
