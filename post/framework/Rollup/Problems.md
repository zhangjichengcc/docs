# Problems

开发问题总结

## 获取工作目录

``` js
// rollup.config.js
import { fileURLToPath } from 'node:url'

export default {
  ...,
  // generates an absolute path for <currentDir>/src/some-file.js
  external: [fileURLToPath(new URL('src/some-file.js', import.meta.url))]
};
```

## 引用 package.json 内容

?> 导入软件包文件，例如将依赖项自动标记为“外部”，这会很有用。根据您的 Node 版本，有不同的方法:

### commonjs 获取

``` js
const pkg = require('../package.json');
```

### 对于 Node 17.5 + ，可以使用导入断言

``` js
import pkg from './package.json' assert { type: 'json' };

export default {
  // Mark package dependencies as "external". Rest of configuration
  // omitted.
  external: Object.keys(pkg.dependencies)
};
```

### 对于旧的 Node 版本，可以使用 createRequire

``` js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// ...
```

### 直接从磁盘读取和解析文件

``` js
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
```

等同于

``` js
import { readFileSync } from 'node:fs';

// Use import.meta.url to make the path relative to the current source
// file instead of process.cwd(). For more information:
// https://nodejs.org/docs/latest-v16.x/api/esm.html#importmetaurl
const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url))
);

// ...
```

### 插件方式获取

在 `rollup.config.js` 中添加 `@rollup/plugin-json` 插件

``` js
// rollup.config.js
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [json()]
};

// src/index.js
import pkg from '../package.json';
```

## 使用 typeScript 的配置文件

> 使配置文件支持 `typescript`提示

### 使用ts配置文件 `rollup.config.ts`

``` typescript
import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
  /* your config */
};
export default config;
```

?> ⚠️注意，我们需要引入插件 `@rollup/plugin-typescript`, 并确保在 `tsconfig.json` 的 `include` 路径中有 `rollup`配置文件:

``` json
// tsconfig.json
{
  "compilerOptions": {
    /** options */
  },
  "include": ["src/**/*", "types/**/*", "rollup.config.ts"]
}
```

使用如下命令启动：

``` shell
rollup --config rollup.config.ts --configPlugin @rollup/plugin-typescript
```

或者在 `package.json` 配置启动命令

``` json
// package.json
{
  /** config options */

  "scripts": {
    "build": "rollup -c rollup.config.ts --configPlugin @rollup/plugin-typescript",
  },
}
```

### 使用 JSDoc 类型提示

[JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

``` js
// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  /* your config */
};
export default config;
```

### 使用 defineConfig

> 使用 `defineConfig` 助手，它提供智能感知而不需要 JSDoc 注释

``` js
// rollup.config.js
import { defineConfig } from 'rollup';

export default defineConfig({
  /* your config */
});
```

## 添加 typescript

rollup 提供了 `@rollup/plugin-typescript` 进行 typescript 编译，如上的 .ts 配置文件就是采用该插件进行编译。

?> 需要注意的是，当我们使用 `babel` 编译ts时，`babel` 与 `@rollup/plugin-typescript` 二选一即可，若只需要编译ts，我们推荐使用 `@rollup/plugin-typescript`.

?> 若需要使用 `babel` 进行一些代码的特殊处理，则可以使用 `babel`，或两者兼用，但推荐使用 `@rollup/plugin-typescript` 进行ts编译，`babel` 进行其他处理，因为 `@rollup/plugin-typescript` 对 ts 的处理更好。

!> 注意，当我们同时使用 `babel` 和 `@rollup/plugin-typescript` 时，ts编译的目标需要在 `tsconfig.json` 中的 `target` 字段指定.

配置别名

- `baseUrl`：设置基本目录以解析非绝对模块名称(定义一个根目录，以此进行绝对文件路径解析)
- `paths`：用于设置模块名或路径映射列表，这样就可以简写项目中自定义模块的文件路径。

``` json
{ 
  "compilerOptions": { 
    // 注意：baseUrl 必选，与 paths 成对出现，以 tsconfig.json 文件所在目录开始 
    "baseUrl": ".",  
    "paths": { 
      // 映射列表 
      "@/*": [ 
        "src/*" 
      ], 
      "moduleA": [ 
        "src/libs/moduleA" 
      ] 
    } 
  } 
} 
 
// 代码里这么写 
import Toast from '@/components/Toast.ts' // 模块实际位置: src/components/Toast.ts 
import TestModule from 'moduleA/index.js' // 模块实际位置: src/libs/moduleA/index.js 
```

!> ⚠️ 如果需要自动生成(导出)类型定义文件，**TSC 不会处理路径别名**，需要引入 [typescript-transform-paths](https://www.npmjs.com/package/typescript-transform-paths) 插件，以及 [ttypescript](https://github.com/cevek/ttypescript) 来转换路径别名为相对路径。

由于当前的 TypeScript 不支持 tsconfig.json 中的自定义转换器，且无法使用 tsc 命令使用自定义转换器编译文件，所以引入了 ttypescript 作为包装器

``` json
// tsconfig.json 
{ 
  "compilerOptions": { 
    "baseUrl": "./", 
    // 配置路径别名映射 
    "paths": { 
      "@/*": ["src/*"] 
    }, 
    "plugins": [ 
      // 转换输出 js 文件中的路径 
      { "transform": "typescript-transform-paths" }, 
 
      // 转换输出 .d.ts 文件中的路径 
      { "transform": "typescript-transform-paths", "afterDeclarations": true } 
    ] 
  } 
} 
```

``` js
// rollup.config.js
import typescript from '@rollup/plugin-typescript'; 
import ttypescript from 'ttypescript'; 
 
export default [ 
  { 
    input: './src/index.ts', 
    output: { 
      dir: 'dist', 
      format: 'cjs', 
      entryFileNames: 'index.js', 
    }, 
    plugins: [ 
      typescript({ 
        typescript: ttypescript, 
      }), 
    ], 
  }, 
]; 
```

## external

<!-- todo -->