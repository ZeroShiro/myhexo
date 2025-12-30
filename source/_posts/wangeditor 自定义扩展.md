---
title: wangeditor 自定义扩展
date: 2023-07-01 10:17
updated: 2023-07-01 10:17
tags:
  - Vue
  - JavaScript
  - 前端随笔
categories:
  - Vue
toc: true
excerpt: wangeditor 自定义扩展
---

```javascript
import E from 'wangeditor';
import Vue from 'vue';
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E;

export class AlertMenu extends BtnMenu {
  editor;
  constructor(editor) {
    const $elem = E.$(
      `<div class="w-e-menu" data-title="扩展">
                <div>
                <i class="w-e-icon-image "></i>
</div>
            </div>`
    );
    super($elem, editor);
    this.editor = editor;
  }
  clickHandler() {
    const editor = this.editor;
    const config = editor.config;
    const uploadFile = config.uploadFile;
    if (uploadFile && typeof uploadFile === 'function') {
      uploadFile();
    }
  }
  tryChangeActive() {
    this.active();
  }
}
```
