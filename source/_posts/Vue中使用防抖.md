---
title: Vue中使用防抖
date: 2020-07-01 10:17	
updated: 2020-07-01 10:17	
tags:
  - Vue
  - JavaScript
  - 前端随笔
categories:
  - Vue
toc: true
excerpt: vue防抖使用
---

## 防抖函数实现

### 方式一：多次点击只执行最后一次

```javascript
/* 多次点击 只执行最后一次 */
const debounce = (function () {
  let timer = null;
  return function (func, delay = 1000) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(func, delay);
  };
})();
```

### 方式二：先执行一次

```javascript
/* 先执行一次 */
const debounce2 = (function () {
  let timer = null;
  let flag = true;
  return function (func, delay = 1000) {
    if (flag) {
      flag = false;
      func.call();
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      flag = true;
      func.call();
    }, delay);
  };
})();

export default {
  debounce,
  debounce2,
};
```

## 挂载到 Vue 原型

```javascript
/* 挂载到原型 */
import debounce from "./debounce/debounce";
Vue.prototype.$utils = {
  ...debounce,
};
```

## 使用示例

```javascript
/* 使用 */
this.$utils.debounce(() => {
  // ...     
}, 500);
```
