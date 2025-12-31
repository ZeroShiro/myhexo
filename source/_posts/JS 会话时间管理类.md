---
title: JS 会话时间管理类
date: 2024-08-15 15:32
updated: 2024-08-15 15:32
tags:
  - JavaScript
categories:
  - JavaScript
toc: true
excerpt: JS 会话时间管理类
---

```javascript
/**
 * 会话时间管理类
 */
class SessionTimeManager {
  /**
   * 设置会话时间
   * @param {string} key - 存储键名
   * @param {number} duration - 持续时间（毫秒）
   */
  static setSessionTime(key, duration) {
    if (!key) throw new Error('键名不能为空');
    const expiryTime = Date.now() + duration;
    sessionStorage.setItem(key, expiryTime.toString());
  }

  /**
   * 检查并更新会话时间
   * @param {string} key - 存储键名
   * @param {number} duration - 持续时间（毫秒），默认为24小时
   * @returns {boolean|string} - 返回true表示更新成功，'OneTime'表示首次设置，false表示未过期
   */
  static checkAndUpdateSession(key, duration = 86400000) {
    if (!key) throw new Error('键名不能为空');

    const storedTime = sessionStorage.getItem(key);
    const currentTime = Date.now();

    // 如果没有存储时间，设置并返回'OneTime'
    if (!storedTime) {
      this.setSessionTime(key, duration);
      return 'OneTime';
    }

    // 检查是否过期
    if (currentTime >= parseInt(storedTime)) {
      this.setSessionTime(key, duration);
      return true;
    }

    return false;
  }

  /**
   * 获取剩余时间
   * @param {string} key - 存储键名
   * @returns {number} - 剩余时间（毫秒），如果key不存在返回0
   */
  static getRemainingTime(key) {
    const storedTime = sessionStorage.getItem(key);
    if (!storedTime) return 0;

    const remaining = parseInt(storedTime) - Date.now();
    return remaining > 0 ? remaining : 0;
  }
}

// 使用示例
const SESSION_KEY = 'sessionTimeKey'; // 统一使用一个键名
const SESSION_DURATION = 5000; // 5秒的会话时间

const flag = SessionTimeManager.checkAndUpdateSession(SESSION_KEY, SESSION_DURATION);
setTimeout(() => {
  console.log(flag, '-----flag');
  if (flag === true) {
    // 会话已更新，可以执行相关操作
    console.log('会话已更新');
  }
  if (flag === 'OneTime') {
    // 首次设置会话
    console.log('首次设置会话');
  }
  if (flag === false) {
    // 会话未过期
    console.log('会话未过期，剩余时间：', SessionTimeManager.getRemainingTime(SESSION_KEY), 'ms');
  }
}, 1000);
```
