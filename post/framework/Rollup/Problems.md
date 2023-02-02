# Problems

开发问题总结

## 引用 package.json 内容

commonjs 获取

``` js
const packageJson = require('../package.json');
```

esm 获取

``` js
import fs from 'fs';
const packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'))
```

若想通过 import 的方式引入，则需要在 `rollup.config.js` 中添加 `@rollup/plugin-json` 插件

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
import packageJson from '../package.json';
```
