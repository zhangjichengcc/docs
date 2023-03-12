<!--
 * @Author: zhangjicheng
 * @Date: 2021-04-06 21:42:46
 * @LastEditTime: 2021-04-07 19:21:19
 * @LastEditors: zhangjicheng
 * @Description: 
 * @FilePath: \my-note\src\_tools\commitizen&husky&commitlint.md
 * 可以输入预定的版权声明、个性签名、空行等
-->

# 规范化Commit Commitizen + Husky + commitlint

> 采用 Commitizen + Husky + commitlint 规范化 git commit 提交

首先分别介绍一下三者：

- Commitizen: 一种方便的提交工具，替代 `git commit` 通过命令行提示完善 commit
- Husky: git 钩子工具，可以监听`git`的每一步操作
- Commitlint: 按规范校验 commit 信息

## Commitizen

[commitizen](https://www.npmjs.com/package/commitizen)

### 1. 可以采用全局或局部安装

``` bash
# 全局安装
> npm install commitizen -g
```

``` bash
# 局部安装
> npm install commitizen --save-dev
```

### 2. 初始化 commitizen 以使用cz常规的changelog适配器

``` bash
# 全局安装
> commitizen init cz-conventional-changelog --save-dev --save-exact
# 局部安装
> npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

然后在 `package.json` 文件中加入如下代码

``` json
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
```

### 3. 使用

``` bash
# 全局安装
> git-cz
# 局部安装
> npx git-cz
```

或者在 `package.json` 中配置 `script`

``` json
  "scripts": {
    "commit": "git-cz"
  }
```

``` bash
> npm run commit
```

### 4. 通过使用git钩子和--hook命令行选项将Commitizen合并到现有的git提交工作流中

> 此步骤使得 git commit 触发 commitizen

tips: 此部分关联 husky 相关知识，可以先往下阅读熟悉husky后再看

`.git/hooks/prepare-commit-msg` [husky6+ 在 `.husky/prepare-commit-msg`] 文件中添加如下内容

``` bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

或者在 `package.json` 中添加：

``` json
"husky": {
  "hooks": {
    "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true",
  }
}
```

> Why exec < /dev/tty? By default, git hooks are not interactive. This command allows the user to use their terminal to interact with Commitizen during the hook.
> 为什么执行 `</dev/tty`？默认情况下，git钩子不交互。该命令允许用户在钩子期间使用终端与 `commitizen` 交互。

### 5. 自定义commit规范

在根目录创建 `cz.config.js` 文件，cz-customizable 会首先在项目根目录下寻找: .cz-config.js 或 .config/cz-config.js，如果找不到，会去主目录寻找。我们也可以在 package.json 中手动去指定配置文件的路径。

``` json
"config": {
  "commitizen": { 
    "path": "node_modules/cz-customizable"
  },
  "cz-customizable": {
    "config": "config/path/to/my/config.js"
  }
}
```

> 自定义commit规则

``` js
module.exports = {
  types: [
    {value: 'feat',      name: 'feat:        ✨特性 一个新的特性'},
    {value: 'merge',     name: 'merge:       💼合并 合并代码'},
    {value: 'fix',       name: 'fix:         🐛修复 修复一个Bug'},
    {value: 'docs',      name: 'docs:        📝文档 变更的只有文档'},
    {value: 'style',     name: 'style:       📜格式 空格, 分号等格式修复'},
    {value: 'refactor',  name: 'refactor:    ♻️重构 代码重构，注意和特性、修复区分开'},
    {value: 'perf',      name: 'perf:        ⚡️性能 提升性能'},
    {value: 'test',      name: 'test:        ✅测试 添加一个测试'},
    {value: 'chore',     name: 'chore:       🔧工具 开发工具变动(构建、脚手架工具等)'},
    {value: 'revert',    name: 'revert:      ⏪回滚 代码回退'}  ],
    scopes: [
      {name: '模块1'},
      {name: '模块2'},
      {name: '模块3'},
      {name: '模块4'}
    ],
  // it needs to match the value for field type. Eg.: 'fix'
    scopeOverrides: {
      fix: [
        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    },
  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    // used if allowCustomScopes is true
    customScope: '选择变更范围(可选):',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?'
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['特性', '修复'],
  // limit subject length
  subjectLimit: 100
};
```

更多配置参看官网 [commitizen/cz-cli](https://github.com/commitizen/cz-cli)

## Husky

[husky npm 官网](https://www.npmjs.com/package/husky)  
[husky 说明文档](https://typicode.github.io/husky/#/?id=create-a-hook)

### 1. 安装

``` bash
> npm install husky --save-dev
```

### 2. 添加钩子

``` bash
> npx husky install
```

### 3. 创建钩子

``` bash
> npx husky add .husky/pre-commit "npm test"
```

### 4. 配置钩子

``` bash
# v4.0 in package.json / .huskyrc.json
{
  "hooks": {
    "pre-commit": "npm test && npm run foo"
  }
}

# v6.0 in .husky/pre-commit
npm test
npm run foo
```

### 5. 使用 commitlint 进行校验

> **HUSKY_GIT_PARAMS (i.e. commitlint, ...)**
> Previous HUSKY_GIT_PARAMS environment variable is replaced by native params $1, $2, etc.
> 以前的HUSKY_GIT_PARAMS环境变量被原生参数$1、$2等替换。

``` json
// .huskyrc.json (v4)
{
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

``` bash
# .husky/commit-msg (v6)
# ...
npx --no-install commitlint --edit $1
# or
yarn commitlint --edit $1
```

>**提示**  
> 注意本文使用的是最新版 v6.0.0，此版本配置改动较大

Environment variables:

- HUSKY_SKIP_HOOKS becomes HUSKY.
- HUSKY_SKIP_INSTALL is removed.
- HUSKY_GIT_PARAMS is removed. Instead Git parameters should be used directly in scripts (e.g. $1).
- PATH for locally installed tools is not automatically set anymore. You'll need to use your package manager to run them.

环境变量：

- HUSKY_SKIP_HOOKS 变为 HUSKY。
- 已删除HUSKY_SKIP_INSTALL。
- HUSKY_GIT_PARAMS 已被删除。相反，Git参数应该直接用于脚本（例如$1）。
- 本地安装工具的路径不再自动设置。您需要使用包管理器来运行它们。

## Commitlint

> commitlint负责用于对commit message进行格式校验
> commitlint只能做格式规范，无法触及内容。对于内容质量的把控只能靠我们自己。

官方文档 [docs/cli](https://commitlint.js.org/#/reference-cli)

### 1. 安装

``` bash
# 注意，windows下
> npm i --save-dev husky @commitlint/config-conventional @commitlint/cli
```

### 2. 添加配置

创建 `commitlint.config.js`

``` bash
# In the same path as package.json

echo 'module.exports = {extends: ["@commitlint/config-conventional"]};' > ./commitlint.config.js
```

也可以自定义检验规则

Rules are made up by a name and a configuration array. The configuration array contains:

- Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
- Applicable always|never: never inverts the rule.
- Value: value to use for this rule.

规则由名称和配置数组组成。配置数组包含：

- 级别 [0..2]：0禁用规则。因为1它将被视为2错误警告。
- 适用 always|never：never反转规则。
- 值：用于此规则的值。

``` js
module.exports = {
  extents:[
    // "@commitlint/config-conventional"
    "cz"
  ],
  rules:{
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'merge',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert'
      ]
    ]
  }
}
```

### 3. 引入husky

``` bash
# package.json

...,
"husky": {
    "hooks": {
      "commit-msg": "commitlint -e $GIT_PARAMS"
    }
}
```

注意: 由于 `husky` 版本问题，此处参考 <a href="#commitlint">使用 commitlint 进行校验</a>

### 4. 使用

执行 `git cz` 进入interactive模式，根据提示依次填写

![](./images/20210407.png)

参考文献：  
[https://note.xiexuefeng.cc/post/husky-and-git-hooks/](https://note.xiexuefeng.cc/post/husky-and-git-hooks/)

[https://github.com/qiqihaobenben/commitizen-git](https://github.com/qiqihaobenben/commitizen-git)

[https://zhuanlan.zhihu.com/p/100773495](https://zhuanlan.zhihu.com/p/100773495)

[https://blog.csdn.net/qiwoo_weekly/article/details/108177769](https://blog.csdn.net/qiwoo_weekly/article/details/108177769)
