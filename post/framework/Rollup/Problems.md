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
