# PWA

> PWA 全名是 Progressive Web App，依照字面上來解釋為『漸進式』的網站應用程式，逐步的將網站漸進優化為具備 APP 的優點，如果在完善的環境裡就能夠提供更強大的功能、若是環境不許可，也能確保優雅降級，提供最基本的服務。

## Web-App-Manifest

[生成工具](https://tomitm.github.io/appmanifest/)

> Web App Manifest 是一种用于描述 Web 应用的元数据的 JSON 文件，它定义了应用的名称、图标、起始 URL、显示模式、主题颜色等信息。PWA 则是一种利用现代 Web 技术使 Web 应用具备原生应用般体验的方式，它通过提供离线访问、响应式布局、快速加载等特性，使得用户可以在浏览器中像使用原生应用一样访问 Web 应用。

``` json
# manifest.json

{
  "name": "zhangjicheng`s docs",
  "description": "Zhangjicheng`s personal learning document",
  "short_name": "docs",
  "start_url": "https://docs.zhangjc.cn/#/",
  "lang": "zh-CN",
  "display": "standalone",
  "icons": [
    {
      "src": "/assets/cover.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

``` js
// service-worker.js

// 定义缓存名称
const cacheName = 'my-site-cache-v1';

// 定义要缓存的资源列表
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截网络请求并从缓存中返回
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有请求的资源，则直接返回缓存
        if (response) {
          return response;
        }
        // 否则从网络请求资源，并将请求结果缓存起来
        return fetch(event.request)
          .then(response => {
            // 检查是否获取成功，如果成功，则将结果缓存起来
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

```

``` html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="manifest" href="assets/manifest.json">
  <title>PWA Example</title>
</head>
<body>
  <!-- 页面内容 -->
  
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered:', registration);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  </script>
</body>
</html>
```

## electronjs

> Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入 Chromium 和 Node.js 到 二进制的 Electron 允许您保持一个 JavaScript 代码代码库并创建 在Windows上运行的跨平台应用 macOS和Linux——不需要本地开发 经验。

[electron](https://www.electronjs.org/zh/docs/latest/)

## tauri

> Tauri 是一款应用构建工具包，让您能够为使用 Web 技术的所有主流桌面操作系统构建软件。

[tauri](https://tauri.app/zh-cn/v1/guides/)

## Pake

> 很简单的用 Rust 打包网页生成很小的桌面App

[pake-cli](https://github.com/tw93/Pake/blob/master/README_CN.md)

## 参考文献

[学习渐进式 Web 应用](https://web.dev/learn/pwa/welcome?hl=zh-cn)
