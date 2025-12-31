---
title: uniapp 小程序授权确认封装
date: 2024-12-21 17:15
updated: 2024-12-21 17:15
tags:
  - 小程序
  - uni-app
  - JavaScript
categories:
  - 小程序
toc: true
excerpt: uniapp 小程序授权确认封装
---

```javascript
// 使用例如
 opSetAuth('scope.record', '录音权限').then((res) => {
      //   console.log(res);
      //   if (res) {
      //   }
  // });

// 询问授权并且打开
function opSetAuth(scope , title = '') {
  /**
   * 打开系统设置界面并检查权限
   * @param {string} scope - 需要检查的权限名称
   * @param {string} title - 授权名字
   * @returns {Promise} - 返回一个 Promise，确保用户在设置界面授权了权限
   */
  function openAppSettings(scope, title) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: '提示',
        content: '需要您授权' + title,
        success: () => {
          uni.openSetting({
            success(res) {
              if (res.authSetting[scope]) {
                console.log(`${scope} 已在设置中授权`);
                resolve(true);
              } else {
                console.warn(`${scope} 在设置中未授权`);
                reject(new Error(`用户未授权 ${scope}`));
              }
            },
            fail(err) {
              console.error('打开设置失败', err);
              reject(err);
            },
          });
        },
      });
    });
  }
  /**
   * 检查并确保某个权限已授权
   * @param {string} scope - 需要检查的权限名称，例如 'scope.userLocation'
   * @returns {Promise} - 返回一个 Promise，确保权限已经开启
   */
  return new Promise((resolve, reject) => {
    // 检查用户是否已经授权该权限
    uni.getSetting({
      success(res) {
        if (res.authSetting[scope]) {
          // 已授权
          console.log(`${scope} 已授权`);
          resolve(true);
        } else {
          // 请求授权
          uni.authorize({
            scope,
            success() {
              console.log(`${scope} 授权成功`);
              resolve(true);
            },
            fail() {
              console.warn(`${scope} 授权失败，打开设置界面`);
              // 打开设置界面让用户手动授权
              openAppSettings(scope , title).then(resolve).catch(reject);
            },
          });
        }
      },
      fail(err) {
        console.error('获取设置失败', err);
        reject(err);
      },
    });
  });
}
```
