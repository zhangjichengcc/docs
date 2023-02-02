# Plugins

?> Rollup 常用插件汇总

我们可以通过在npm 中搜索 @rollup 来查看插件汇总，下面总结一些常见插件。

## @rollup/plugin-babel

> 集成 rollup 和 Babel 之间的无缝连接。

[@rollup/plugin-babel](https://www.npmjs.com/package/@rollup/plugin-babel)

``` bash
npm install @rollup/plugin-babel --save-dev
```

``` js
//  rollup.config.js

import { babel } from '@rollup/plugin-babel';

const config = {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'es'
  },
  plugins: [babel({ babelHelpers: 'bundled' })]
};

export default config;
```

## @rollup/plugin-commonjs

> 将 CommonJS 模块转换成 ES6，这样它们就可以包含在一个 rollup 包中

[@rollup/plugin-commonjs](https://www.npmjs.com/package/@rollup/plugin-commonjs)

``` bash
npm install @rollup/plugin-commonjs --save-dev
```

``` js
// rollup.config.js

import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [commonjs()]
};
```

!> 注意！rollup-plugin-commonjs 应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏CommonJS的检测。当在相同的 rollup 配置中使用 @rollup/plugin-babel 和 @rollup/plugin-commonjs 时，需要注意的是,@rollup/plugin-commonjs 必须放在 plugins 数组中的这个插件之前，这样它们才能正常工作。例如:

``` js
// rollup.config.js

import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const config = {
  ...
  plugins: [
    commonjs(),
    babel({ babelHelpers: 'bundled' })
  ],
};
```

## @rollup/plugin-node-resolve

[@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve)

> 使用 Node 解析算法定位模块，用于在 Node _ module 中使用第三方模块

``` bash
npm install @rollup/plugin-node-resolve --save-dev
```

``` js
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [nodeResolve()]
};
```

## rollup-plugin-filesize

> 打包后展示包大小

[rollup-plugin-filesize](https://www.npmjs.com/package/rollup-plugin-filesize)

## @rollup/plugin-json

> .json 文件转换成 ES6模块

[@rollup/plugin-json](https://www.npmjs.com/package/@rollup/plugin-json)

``` bash
npm install @rollup/plugin-json --save-dev
```

``` js
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [json()]
};
```

## rollup-plugin-typescript2

> rollup TypeScript 的编译器插件

[rollup-plugin-typescript2](https://www.npmjs.com/package/rollup-plugin-typescript2)

## rollup-plugin-node-polyfills

[rollup-plugin-node-polyfills](https://www.npmjs.com/package/rollup-plugin-node-polyfills)

> Allows the node builtins to be required/imported.

``` bash
npm install --save-dev rollup-plugin-node-polyfills
```

``` js
import nodePolyfills from 'rollup-plugin-node-polyfills';
rollup({
  entry: 'main.js',
  plugins: [
    nodePolyfills()
  ]
})
```

## @rollup/plugin-terser

> rollup 压缩包工具

[@rollup/plugin-terser]()

``` bash
import terser from '@rollup/plugin-terser';
```

## @rollup/plugin-eslint

> 用于 lint 入口点和所有用 ESLint 导入的文件

[@rollup/plugin-eslint](https://www.npmjs.com/package/@rollup/plugin-eslint)

``` bash
npm install @rollup/plugin-eslint --save-dev
```

``` js
import eslint from '@rollup/plugin-eslint';

export default {
  input: 'main.js',
  plugins: [
    eslint({
      /* your options */
    })
  ]
};
```
