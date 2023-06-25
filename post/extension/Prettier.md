# Prettier

`Prettier` 在自己官网首页列出这么三点：

- An opinionated code formatter
- Supports many languages
- Integrates with most editors
- Has few options

官方首先告诉你，`Prettier` 是一个 `Opinionated` 的代码格式化工具。所以要掌握 `Prettier` 的精髓就是要理解这个单词。

> Prettier 说自己是一个 Opinionated code formatter，就是说：你必须认同我的观点，按照我说的做。否则你就别用我，硬着头皮用就会处处不爽！

支持多种语言和多种编辑器这里就不说了

至于 **Has few options**，其实就是 `Opinionated` 的最直接体现。除了必要的设置项，不会再给你们更多。给你设置项越多，你们越乱，你们就会继续争吵！

## 一. 使用

``` shell
$ npm install prettier --save-dev --save-exact

$ npx prettier --write [filename]
```

## 二. vscode 配置

安装插件 `Prettier - Code formatter`

手动格式化

- Mac：CMD + Shift + P -> Format Document
- WIndows：Ctlr + Shift + P -> Format Document

保存文件自动格式化

打开配置文件

- Mac：CMD + ,
- Windows：Ctrl + ,

![vscode 保存格式化](./img/prettier-vscode-onsave.png)

若保存时某一行代码不需要自动格式化，则可以使用注释 `// ingore-prettier`

## 三. 整合 Git

和 Git 整合，有四种方法：

- lint-staged
- pretty-quick
- pre-commit
- precise-commits

其中除了 `pre-commit` 之外，都是 `npm` 的 `module`，需要先 `npm install ...`。我们只介绍 `lint-staged` 用法。当你需要 `Prettier` 和其他 `Linters` 一起用的时候，也用 `lint-staged`。

### husky

[husky](https://github.com/typicode/husky)，没错就是哈士奇的英文。

![husky](./img/prettier-husky.png)

二哈在这里的作用就是咬住 Git 的 [hooks](https://githooks.com/) 不放。我们这里只关心 pre-commit 这一个 hook。

> 注意，husky 不同版本差异较大，很多教程给的都是旧版，只适用 v4.x， 如下配置

``` json
// package.json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,css,md}": "prettier --write"
  }
}
```

**上面的配置，需要安装 husky 的 v4.x版本才能生效**

目前最新是 v7+，关于新老版本，新版比老版多了一个步骤，并且配置也有所不同

- 老版本：安装 ——> 配置
- 新版本：安装 ——> 启用 ——> 生成 .husky相关配置

关于新版安装配置如下：

``` bash
$ npm install husky --save-dev
# 手动启用husky
$ npx husky install
# 生成husky配置文件（执行完这一步，根目录会有一个 .husky目录, 里面就是相应的hooks）
$ npx husky add .husky/pre-commit "npx lint-staged"  
```

![.husky](./img/prettier-husky-lint-staged.png)

?> 上面的配置方法有一个问题：我们不可能每次 `install` 之后都需要手动去启用 husky, 可以在 `package.json` 添加配置：`scripts": { "prepare": "husky install" }`,它的作用是：在husky安装完之后，自动关联启用。

继续配置 package.json

``` json
{
  "scripts": {
    // ...
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx,css,md}": "prettier --write"
  }
}
```

### lint-staged

> [lint-staged](https://www.npmjs.com/package/lint-staged) 能够让 lint 只检测暂存区的文件，所以速度很快.

上面已经涉及到 lint-staged 的使用了，这里完善一下

通常 lint-staged 和 husky 都是配合使用的，所以也可以不必像上文那样手动安装，在我们安装 lint-staged 时可以同时安装 husky，如下

``` shell
# 先别运行这两行，下面会有更简单的办法
# $ npm install husky -D
# $ npm install lint-staged -D

# 这一行就可以安装husky和lint-stage，并且配置好husky。
$ npx mrm lint-staged
```

`mrm` 之后, 项目根目录会自动生成 `.husky` 目录，同时 package.json 也会增加相应配置

``` json
{
  // ...
  "scripts": {
    // ...
    "prepare": "husky install"
  },
  "devDependencies": {
    // ...
    "husky": ">=7",
    "lint-staged": ">=10",
    "prettier": "^2.8.6"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx,css,md}": "prettier --write"
  }
}

```

现在你可以修改 js、css、json、md 文件，把他们搞乱！然后 `git add .`，然后再 `git commit -m 'Test Prettier'` 试试了。

### eslint

关于 eslint，这里不做详细说明，会有单独文章用来介绍

首先安装 eslint

``` shell
$ npm install eslint -D

$ npx eslint --init
```

根据项目选择即可，会生成 `.eslintrc.*` 配置文件

eslint + husky + lint-staged 进行项目校验，其实很简单，和上面配置基本相同，只是添加了 eslint 的命令而已

``` diff
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,css,md}": "prettier --write",
+    "*.{js,jsx,ts,tsx}": [
+      "eslint --fix"
+    ]
  }
}
```

## 四. Prettier 和各种 Linters 是什么关系？如何配合使用？

> prettier 官方不建议和各种 lint 集成 官方建议是 "活我给你干好了 别问我是谁 把我忘了吧 当我不存在..."

各种 Linters 是按照规则(Rules)去检查代码的，遇到不符合规则的代码就会提示你，有的规则还能自动帮你解决冲突。

这些规则分为两类：

- Formatting rules
- Code-quality rules

> Prettier 并不会取代各种 Linters，而是能避免你的代码和这些 Linters 定义的 `Formatting rules` 冲突; Linters 检查出来违反 `Code-quality rules` 的情况后还需要你自己根据业务逻辑和语法手动修改。Prettier 帮你格式化代码，但是不会帮你挑出潜在的错误。

> ESLint 是一款 Lint 工具，包含了代码质量检查等等。而 Prettier 仅仅只是一个代码风格的约束工具，对于代码可能产生的 Bug 等并不关心。虽然说 ESLint 其实也具备一定的代码风格的格式化能力，但是在实践中，我们一般采用 ESlint 来做代码质量的约束，用 Prettier 来做代码风格的约束。

通常，两者不必整合，各自做自己的工作，但**有时会出现两者规则冲突的情况(通常是在我们配置了文件保存自动格式化的情况下会出现)**

我们可以通过手动修改两者规则，来解决冲突；这里我们介绍另外一种整合的方法

Prettier 和 Linters 的整合需要做两件事：

- 禁用 Linters 自己的 Formatting rules，让 Prettier 接管这些职责。这些配置有现成的 [Config](https://github.com/prettier/eslint-config-prettier)，Linters 的配置继承这个 Config 就可以了。
- 让 Linters 执行时首先能够调用 Prettier 格式化带啊，然后再检查 Code-quality 类规则。这是 由 Linters 的 [Plugin](https://github.com/prettier/eslint-plugin-prettier) 实现的。

prettier 官方提供了 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 和 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier), 来处理上文的两个功能。

- `eslint-config-prettier` 这个工具其实就是禁用掉了一些不必要的以及和 Prettier 相冲突的 ESLint 规则。
- `eslint-plugin-prettier` 这个插件的主要作用就是将 prettier 作为 ESLint 的规则来使用，**相当于代码不符合 Prettier 的标准时，会报一个 ESLint 错误，** 同时也可以通过 `eslint --fix` 来进行格式化。

具体配置如下：

``` shell
$ npm i --save-dev prettier
$ npm i --save-dev eslint-plugin-prettier eslint-config-prettier
```

修改 .eslintrc.*

``` json
{
  "extends": ["prettier"], // 继承 eslint-config-prettier 配置
  "plugins": ["prettier"], // 引用 eslint-plugin-prettier 插件
  "rules": {
    "prettier/prettier": "error"
  }
}
```

上面的配置可以简化如下

``` diff
{
+  "extends": ["plugin:prettier/recommended"],
-  "extends": ["prettier"],
-  "plugins": ["prettier"],
-  "rules": {
-    "prettier/prettier": "error",
-    "arrow-body-style": "off",
-    "prefer-arrow-callback": "off"
-  }
}
```

此时，我们相当于使用 eslint 来托管了 prettier 的校验，同时兼容了两者的校验规则，那么我们是不是可以只使用 eslint 来校验格式化代码呢？

我们知道，eslint 主要是针对 js 相关代码进行校验，而 prettier 则比较广泛，所以，可以使用 eslint 来校验 js，prettier 来校验其他语言

**1、pre-commit 配置 (提交前格式化)**

  ``` json
  // package.json
  {
    // ...
    "lint-staged": {
      "src/**/*.{js,jsx,ts,tsx}": [
        "eslint --fix"
      ],
      "*.{json,yaml,md,less,css}": [
        "prettier --write"
      ]
    }
  }
  ```

**2、vscode 配置 (文件保存格式化)**

> vscode 我们用来配置文件保存格式化，通常这一步会有 eslint 和 prettier 的冲突，这是由于 js 一类的文件同时被 eslint 和 prettier 格式化处理了，我们要做的是，**对于js一类文件，我们只用一种处理器去格式化，由于上文，我们已经将 prettier 的规则交给 eslint 来处理了，所以对于这类文件，我们用 eslint 的规则来处理，而其他文件则交由 prettier 规则去处理**

配置大体分为两类

1、 开启文件保存自动格式化【prettier】 `"editor.formatOnSave": true`, 关闭对`js、jsx、ts、tsx` 等文件的格式化，把他们交由 eslint 处理，如下：

```json
{
  // 文件保存时格式化, 默认使用 prettier
  "editor.formatOnSave": true,
  // 默认格式化工具选择 prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 针对共用的语言如js、ts、jsx、tsx关闭文件保存自动格式化功能，通过eslint来做这件事
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[javascriptreact]": {
    "editor.formatOnSave": false
  },
  "[typescript]": {
    "editor.formatOnSave": false
  },
  "[typescriptreact]": {
    "editor.formatOnSave": false
  },

  // 开启 eslint 校验
  "eslint.enable": true,

  // 代码保存时触发
  "editor.codeActionsOnSave": {
    // 使用eslint来fix，包括格式化会自动fix和代码质量检查会给出错误提示
    "source.fixAll.eslint": true
  }
}

```

2、 统一使用 prettier 进行格式化，修改 `js、jsx、ts、tsx` 文件的格式化规则为 eslint，如下：

``` json
{
  // 文件保存时格式化, 默认使用 prettier
  "editor.formatOnSave": true,
  // 默认格式化工具选择 prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 设置js的 formatter 为 eslint
  "[javascriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },

  // 开启 eslint 校验
  "eslint.enable": true,

  // 代码保存时触发
  "editor.codeActionsOnSave": {
    // 关闭 eslint 在文件保存时的校验，交给 prettier 去做
    "source.fixAll.eslint": false
  }
}
```

?> 有些人认为造成 eslint 和 prettier 冲突的原因是 vscode 的 `editor.formatOnSave` 和 `editor.codeActionsOnSave` 两者的功能重复了，我最开始也是这样觉得，但稍微深入研究，就会发现两者其实并不重复，从字面也不难理解，`formatOnSave` 是在保存时格式化，`codeActionsOnSave` 是在保存时执行操作，如果要说两者有什么关联，那也是 `codeActionsOnSave` > `formatOnSave`

## 五. 配置

Prettier 反复强调自己是一个 Opinionated code formatter，而且只有 few(很少) options。这意味着：

> Prettier 不是一个你想如何设置就如何设置的代码风格格式化工具，不能任由你改变其输出风格。其最主要的目的就是让团队停止争吵，配置项越多，就离这个主要目的越远，团队就会一直讨论应该如何配置。这就是 Prettier 的哲学，而且广受欢迎。

我们推荐采用默认配置即可，比如我们在 vscode 中安装了 prettier 之后，可以在 settings 中设置 prettier 配置，也可以自己手动在项目内新建 `.prettierrc` 文件来定义我们的规则，具体配置项就不细说了，详细的配置文档[Prettier-Options](https://prettier.io/docs/en/options.html)

github 上已经有 cli 来帮助我们生成配置，[create-prettier-eslint](https://github.com/leggsimon/create-prettier-eslint)，为了方便我们也可以使用。

## 六. 配置示例

> 下面给一份本文示例，供参考

`.husky/pre-commit`

``` shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

`.vscode/settings.json`

``` json
{
  // 文件保存时格式化, 默认使用 prettier
  "editor.formatOnSave": true,

  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 针对共用的语言如js、ts、jsx、tsx关闭文件保存自动格式化功能，通过eslint来做这件事
  // "[javascript]": {
  //   "editor.formatOnSave": false
  // },
  // "[javascriptreact]": {
  //   "editor.formatOnSave": false
  // },
  // "[typescript]": {
  //   "editor.formatOnSave": false
  // },
  // "[typescriptreact]": {
  //   "editor.formatOnSave": false
  // },

  // 指定 js 的 formatter 为 eslint
  "[javascriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },

  // 开启 eslint 校验
  "eslint.enable": true,

  // 代码保存时触发
  "editor.codeActionsOnSave": {
    // 使用eslint来fix，包括格式化会自动fix和代码质量检查会给出错误提示
    "source.fixAll.eslint": false
  }
}
```

`.eslintignore`

``` yaml
node_modules/
build/
dist/
*.md
```

`.eslint`

``` json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "settings": {
    "react": {
      "version": "18.0.0"
    }
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended"
  ],
  "overrides": [],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint"],
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "trailingComma": "es5"
      }
    ]
  }
}
```

`.prettierrc`

``` json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

`package.json`

``` json
{
  "private": true,
  "author": "zhangjicheng <zhangjichengcc@163.com>",
  "scripts": {
    "dev": "umi dev",
    "build": "umi build",
    "postinstall": "umi setup",
    "setup": "umi setup",
    "start": "npm run dev",
    "prepare": "husky install"
  },
  "dependencies": {
    "ahooks": "^3.7.5",
    "antd-mobile": "^5.28.1",
    "axios": "^1.3.4",
    "react-document-title": "^2.0.3",
    "umi": "^4.0.61"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-document-title": "^2.0.5",
    "@types/react-dom": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^5.56.0",
    "@typescript-eslint/parser": "^5.56.0",
    "eslint": "^8.36.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.32.2",
    "husky": ">=7",
    "lint-staged": ">=10",
    "prettier": "^2.8.6",
    "typescript": "^4.1.2"
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint --fix"
    ],
    "*.{json,yaml,md,less,css}": [
      "prettier --write"
    ]
  }
}

```

## 参考文献

[prettier 官网](https://prettier.io/)

[Prettier看这一篇就行了](https://zhuanlan.zhihu.com/p/81764012)

[prettier-playground](https://prettier.io/playground/)

[husky 文档](https://typicode.github.io/husky/#/)

[vsCode配置Eslint+Prettier结合使用详细配置步骤，规范化开发](https://blog.csdn.net/qq_36784628/article/details/125483886?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-125483886-blog-122727900.235%5Ev27%5Epc_relevant_multi_platform_whitelistv3&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-125483886-blog-122727900.235%5Ev27%5Epc_relevant_multi_platform_whitelistv3&utm_relevant_index=1)
