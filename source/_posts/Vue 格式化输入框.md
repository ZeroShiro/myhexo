---
title: Vue 格式化输入框
date: 2021-08-16 14:24
updated: 2021-08-16 14:24
tags:
  - Vue
  - JavaScript
  - 前端随笔
categories:
  - Vue
toc: true
excerpt: Vue格式化输入框
---

```javascript
/**
 *
 * @param {num} 格式化数数字保留2位
 * @param {max} 最大值
 * @param {min} 最小值
 * @param {isFen} 最大值是否是分单位
 * @param {returnMax} 超过最大值返回值
 * @return {*num}
 */

function changePrice(num, max = 1000000, min = 0, isFen = false, returnMax = 0, returnMin = 0) {
  const str =
      ('' + num)
        .replace(/[^\d^\.]+/g, '') // 1：把不是数字，不是小数点的过滤掉
        .replace(/^0+(\d)/, '$1') // 2：第一位0开头，0后面为数字，则过滤掉，取后面的数字
        .replace(/^\.+/, '0') // 3：如果输入的第一位为小数点，则替换成 0. 实现自动补全
        .replace(/^0+(\d)/, '$1') // 4：第一位0开头，0后面为数字，则过滤掉，取后面的数字 防止 .0
        .match(/^\d*(\.?\d{0,2})/g)[0] || '' // 5：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
  const ns = str.replace(/\.+$/, '')

  if (Number(ns) <= min) {
    return returnMin
  }
  if (Number(ns) > Number((max / 100).toFixed(2)) && isFen) {
    return returnMax
  }
  if (Number(ns) > Number((max).toFixed(2)) && !isFen) {
    return returnMax
  }
  return ns
}
function changeAmount(num, max = 1000000, min = 0, returnMax = 0, returnMin = 0) {
  const str = ('' + num) // 1：转成字符串
    .replace(/[^\d]+/g, '') // 2：把不是数字的过滤掉
    .replace(/^\.+(\d)/, '$1') // 3
    .replace(/^0+(\d)/, '$1') // 4：第一位0开头，0后面为数字，则过滤掉，取后面的数字
    .replace(/^\.+/, '') // 5：如果输入的第一位为小数点，则替换成 = 实现自动补全
  if (Number(str) < min) {
    return returnMin
  }
  if (Number(str) > max) {
    return returnMax
  }
  return str
}
```

