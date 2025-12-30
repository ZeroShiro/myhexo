---
title: uniapp 封装小程序激励视频
date: 2021-05-14 16:55
updated: 2021-05-14 16:55
tags:
  - 小程序
  - uni-app
  - JavaScript
categories:
  - 小程序
toc: true
excerpt:  小程序激励视频使用
---

封装一个 uniapp 激励视频广告工具，方便在小程序中统一调用。

```js
let videoAd = null;

let adVideoUtils = {
  /**
   * @param {String} adUnitId 小程序广告视频 id
   * videoAdInit 初始化广告
   */
  videoAdInit(adUnitId) {
    if (videoAd) {
      videoAd = null;
    }
    if (uni.createRewardedVideoAd) {
      videoAd = uni.createRewardedVideoAd({
        adUnitId: adUnitId,
      });
      if (videoAd) {
        videoAd.onError((err) => {
          console.log(err);
        });
      }
      // return videoAd;
    }
  },

  /* 显示广告 true 为播放完成 */
  videoAdShow() {
    return new Promise((resolve, reject) => {
      adVideoUtils._showAd().then((val) => {
        if (val) {
          videoAd.onClose((res) => {
            if (res.isEnded) {
              // 成功 给予奖励
              resolve(true);
            } else {
              resolve(false);
            }
          });
          videoAd.onError((err) => {
            if (err.errCode == "1004") {
              reject("1004");
            } else {
              reject(err);
            }
          });
        } else {
          reject(err);
        }
      });
    });
  },

  _showAd() {
    return new Promise((resolve) => {
      videoAd
        .show()
        .then(() => {
          console.log("广告显示成功");
          resolve(true);
        })
        .catch((err) => {
          console.log("广告组件出现问题", err);
          // 可以手动加载一次
          videoAd
            .load()
            .then(() => {
              console.log("手动加载成功");
              resolve(true);
              // 加载成功后需要再显示广告
              return videoAd.show();
            })
            .catch((err) => {
              resolve(false);
              console.log("广告组件出现问题2次加载", err);
              // this.showUToast("加载失败啦，请稍后在试", "error");
            });
        });
    });
  },
};

export default adVideoUtils;
```

引入后注册使用：

```js
import adVideoUtils from "./../adVideoUtils";

Vue.prototype.$utils = {
  ...adVideoUtils,
};
```

页面中使用：

```js
// onLoad 中
this.$utils.videoAdInit(adUnitId);

// 显示
this.$utils
  .videoAdShow()
  .then((res) => {
    if (res) {
      // 成功
      this.adVideoRes();
    } else {
      this.adVideoErr();
    }
  })
  .catch((err) => {
    this.showUToast("视频加载失败了,稍后在试", "error");
  });
```
