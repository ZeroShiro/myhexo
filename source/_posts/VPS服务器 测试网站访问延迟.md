---
title: VPS服务器 测试网站访问延迟
date: 2025-01-20 15:32
updated: 2025-01-20 15:32
tags:
  - Linux
  - bash脚本
categories:
  - Linux
toc: true
excerpt: VPS服务器 测试网站访问延迟
---


```bash
(for d in \
  www.yahoo.com \
  gateway.icloud.com itunes.apple.com swdist.apple.com swcdn.apple.com \
  updates.cdn-apple.com mensura.cdn-apple.com osxapps.itunes.apple.com aod.itunes.apple.com \
  www.apple.com developer.apple.com \
  www.microsoft.com learn.microsoft.com update.microsoft.com software.download.prss.microsoft.com \
  cdn-dynmedia-1.microsoft.com res-1.cdn.office.net res.public.onecdn.static.microsoft \
  www.amazon.com aws.amazon.com d1.awsstatic.com s0.awsstatic.com \
  images-na.ssl-images-amazon.com m.media-amazon.com player.live-video.net \
  one-piece.com lol.secure.dyn.riotcdn.net www.lovelive-anime.jp \
  academy.nvidia.com www.python.org vuejs.org react.dev \
  www.java.com www.oracle.com www.mysql.com redis.io \
  www.cisco.com www.samsung.com www.amd.com www.asus.com \
  vscode.dev github.io cdn.jsdelivr.net \
  www.cloudflare.com www.bing.com static.cloud.coveo.com \
  polyfill-fastly.io www.sony.com www.mozilla.org www.intel.com \
  api.snapchat.com images.unsplash.com \
; do \
  t1=$(date +%s%3N); \
  timeout 1 openssl s_client -connect $d:443 -servername $d </dev/null &>/dev/null && \
  t2=$(date +%s%3N) && echo "$((t2 - t1)) $d"; \
done) | sort -n | head -n 10 | awk '{printf "✔️  %s (%s ms)\n", $2, $1}’
```