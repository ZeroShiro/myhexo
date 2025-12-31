---
title: Vue 导出xlsx 封装
date: 2024-07-01 10:17
updated: 2024-07-01 10:17
tags:
  - Vue
  - JavaScript
  - 前端随笔
categories:
  - Vue
toc: true
excerpt: Vue 导出xlsx 封装
---

```javascript
import Axios from "axios";
import Vue from "vue";

let exprotUtils = {
  exportX2(url, fromData, fileName, method = "POST", HOST = "") {
    let hostUrl = '默认url'if (HOST) {
      hostUrl = HOST;
    }
    return Axios(hostUrl + url, {
      method: method,
      headers: {
        Authorization: "bearer " + localStorage.getItem("token"),
        "client-type": "browser",
        "Content-Type": "application/json;",
        Accept: "application/json"
      },
      data: {
        ...fromData
      },
      responseType: "blob"
    }).then(res => {
      if (res && res.message) {
        return new Promise((res, rej) => {
          res(false);
        });
      }
      if (res && res.status == "200") {
        return exprotUtils._downloadExcel(res, fileName);
      }
    });
  },
  _downloadExcel(res, name = "导出.xlsx") {
    return new Promise((resolve, reject) => {
      if (res != null) {
        const content = res.data;
        const fileName = name;
        const blob = new Blob([content], { type: "application/ms-excel" });
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL对象
          document.body.removeChild(elink);
        } else {
          navigator.msSaveBlob(blob, fileName);
        }
        resolve(true);
      } else {
        reject(false);
      }
    });
  }
};
export default exprotUtils;
```
