# Nodejs pure esm 模块的迁移方法

## 背景

npm 轮子哥 [Sindre Sorhus](https://github.com/sindresorhus) 承担社区有相当规模的一部分的底层轮子维护，他的一举一动将深刻影响社区数以万计的顶层工具。

按 [Sindre Sorhus](https://github.com/sindresorhus) 的评价和思考，他现在是讨厌 `cjs` 的，要完全拥抱 `pure esm` ，并且在最近几个月将他所维护的几乎所有轮子都强制迁移到了 `pure esm` 版本，此举可以公开的信息如下：

- 大版本变化：进行了大版本的 Breaking change ，所以如果你正在使用 `cjs` 编写，需要安装他的前一个版本（如现在为 ^3.0.0 ，你需要安装 ^2.0.0 ）。
- 社区大冲击：造成了很多顶层工具链路被破坏，如 `nextjs` 等，在几天内迅速发布了 alpha 修复的 esm 版应对。
- 强制席卷 esm：虽然人们知道 `esm` 才是 JavaScript 的未来，但是在 nodejs 界写 cjs 是上古传承的地位了，即使 typescript 的转换够强大，但是 [Sindre Sorhus](https://github.com/sindresorhus) 认为以后只需 `pure esm`，放弃 cjs 。

## 如何迁移 pure esm

在最近一次命令行工具王者 [execa](https://www.npmjs.com/package/execa) 发生了 `pure esm` 的改变后，社区对 to pure esm 的评价越来越激烈。

Sindre Sorhus 本人也发布了迁移 pure esm 的推荐手法：[esm-package.md](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

如何将 cjs 工具转换为 esm ，下面我将就 Sindre Sorhus 的建议之上进行一个详细的介绍和解读。

## JavaScript 编写的工具

对于原来是 `js` 编写的 `cjs` 工具，你需要做以下几件事：

1. 添加 `"type": "module"` 到你的 `package.json` ：这样 `node` 去运行你的工具时才知道使用 `esm` 的加载器运行（默认是 `cjs` ）

2. 在 `package.json` 中替换 `"main": "index.js"` 到 `"exports": "./index.js"` ：这一步是限制 esm 的导出范围，防止隐式的 hack 导入引发不确定的行为，当然 exports 也可以指定为对象进行详细的范围指定（关于详细方式可自行在搜索引擎搜索后学习），在 ts 4.5 中也推荐了使用 exports 防止隐式导入（当然其 nodenext 系 module 转换被暂时搁浅到下个版本了）。

3. 在 `package.json` 中使用 `engines` 字段限制 nodejs 运行版本号：如 `"node": "^12.20.0 || ^14.13.1 || >=16.0.0"` 。

4. 删除全部代码中的 'use strict'; ：在 esm 界我们不需要这个严格声明。

5. 将代码中所有的 cjs 导入导出 `require() / module.exports` 转换为 `esm 的 import / export` 。

6. 使用完整的相对文件路径引入文件，如：`import x from './index.js'` ，此处要写明文件名和拓展名。

7. 将所有的 `.d.ts` 文件转换为 esm 的导出格式：对于社区使用 js 编写的的流行工具包一般官方或者社区会帮助维护一份 types 包，如 `@types/*` 等，这些辅助的格式声明文件也须进行 esm 的迁移。

8. 建议使用 `node:*` 协议进行导入 `node` 内置模块：这是防止混淆的做法，如 `import path from 'path'` → `import path from 'node:path'` ，此举可以明确限制告诉 `node` 我在导入一个内置的模块（因为有的时候可能 `npm` 的公共包也和 `node` 内置模块是一个名字）。

## Typescript 编写的工具

大体与上面相同，需要注意的是：

- 删除 `namespace` 用法并使用 `export` ：这就意味着纯 `.d.ts` 的命名空间 `type` 法被开除 `esm` 户籍，相信有很多新手在编写 `type` 时图简单使用 `.d.ts` 存放，结果要承担不可 `copy` 、不可 `export` 、有时 `ide` 会不识别的问题。

- 更改 `tsconfig.json` 中编译的目标为 `es` 格式，即 `module: "es2020"` （未来 ts 4.6+ 将支持新的 `node` 系 `module` 选项来更好的应对 to esm 转换）。

示例：

``` diff
// package.json
{
  "name": "debug-in-vscode",
  "version": "0.0.1",
  
+  "type": "module",
  "scripts": {
-    "start": "node -r ts-node/register src/index.ts"
+    "start": "node --loader ts-node/esm src/index.ts"
  },
  "devDependencies": {
    "@types/node": "^18.15.3",
    "esno": "^0.16.3",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.5"
  }
}
```

``` diff
// tsconfig.json
{
  "compilerOptions": {
+    "module": "ES2022",
+    "esModuleInterop": true,
    // "skipLibCheck": true,
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true,
    "outDir": "./out"
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

``` diff
// ts
- import * as fs from 'fs';
- import * as path from 'path';
- import * as http from 'http';
+ import fs from 'node:fs';
+ import path from 'node:path';
+ import http from 'node:http';
+ import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
http.createServer((req, res) => {
  if (req.url === '/') {
    fs.createReadStream(
      path.join(__dirname, '../index.html')
    ).pipe(res);
  } else {
    res.end(req.url);
  }
}).listen(8001, () => {
  console.log('run at 8001');
});
```



## 迁移 cjs 内置变量的成本

1. `require` 到 `import` 的转换

2. `__dirname / __filename` 到 `import.meta.url` 的转换

关于第二点的 `import.meta.url` 迁移，目前社区有一种 hack 的做法：[混用 cjs 导出 __dirname 进行 hack](https://github.com/nodejs/node-eps/blob/master/002-es-modules.md#4512-getting-cjs-variables-workaround)

``` js
// expose.js
module.exports = {__dirname};
```

``` js
// use.mjs
import expose from './expose.js';
const {__dirname} = expose;
```

当然这种 hack 是非常规手段，常规的迁移手段应该是：

``` js
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

?> 其实本质上 `import.meta.url` 利用内置工具转为 `file` 的绝对路径后再用 `path.dirname` 转到文件夹名即可。

- `import.meta.url` 是 `es2020 (es11)` 的行为，当然 `esnext` 也支持，在其他要编译为 `esm` 模块的地方使用时你或许需要牢记这一点。

- 严禁使用 `new URL(import.meta.url).pathname` 这种写法，会引发不同平台表现不一致和错误，详见 `url.fileURLToPath(url)` （很多地方都告诉你这么写其实是不对的）

## 参考文献

[Nodejs纯esm模块的迁移方法、社区冲击、评价浅论](https://blog.csdn.net/qq_21567385/article/details/121440227)

[Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
