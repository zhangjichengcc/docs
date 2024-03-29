# VScode 调试技巧

官网地址: [https://code.visualstudio.com/docs/nodejs/nodejs-debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

**当你在 launch.json 中配置了 type 属性的值后，就可以使用VS Code的智能提示（command+I）来查看所有可用的属性**

``` json
{
  // 了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch with node",
      "runtimeArgs": [
        "-r",
        "ts-node/register"
      ],
      "args": [
        "${workspaceFolder}/src/index.ts"
      ]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch with ts-node",
      "program": "${workspaceFolder}/out/index.js",
      "preLaunchTask": "tsc build"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch with nodemon",
      "console": "integratedTerminal",
      "runtimeExecutable": "nodemon",
      "restart": true,
      "runtimeArgs": [
        "-r",
        "ts-node/register"
      ],
      "args": [
        "${workspaceFolder}/src/index.ts"
      ]
    },
    {
      "name": "Attach to node",
      "type": "node",
      "request": "attach",
      "restart": true,
      "processId": "${command:PickProcess}"
    },
    {
      "name": "Launch file with Chrome",
      "request": "launch",
      "type": "chrome",
      "file": "${workspaceFolder}/index.html"
    }
  ]
}
```

## 参数说明

configurations

必填字段：

- name：调试名
- type：必填项，调试类型，当前为 node，如果是 PHP 调试，则在安装 PHP 调试插件后写 php；
- request：必填项，有两种类型，分别是 `launch` 和 `attach`，前者的意思就是 VSCode 会打开这个程序然后进入调试，后者的意思是你已经打开了程序，然后接通 Node.js 的内部调试协议进行调试，如果你看过上面的“Node.js 的调试原理”一文，应该可以大致理解；

**`launch` 与 `attach` 共有字段**

- protocol: 设置调试协议

  `auto` 尝试自动检测目标运行时使用的协议
  `inspector` 新的V8调试器协议，解决遗留版本的多数问题，node versions >= 6.3 and Electron versions >= 1.7.4.
  `legacy` 原始的v8调试器协议，node versions < v8.0 and Electron versions < 1.7.4.

- port: 调试使用的端口
- address: TCP/IP地址，用于远程调试

**`launch` 特有字段**

- `localRoot` 远程调试时映射的本地地址

- `remoteRoot` 远程调试时的远程目录地址

- `sourceMaps`  默认为true

- `outFiles` 当map文件不在js文件同目录时用于指定 sourceMaps的位置

- `restart` 自动重启调试，修改代码并保存后会自动重启调试。

- `timeout` 配置自动附加的超时时间

- `stopOnEntry` 自动断点到第一行代码处

- `smartStep` 自动跳过未映射到源代码的代码

- `skipFiles` :`[]String`,指定跳过单步调试的代码

- ``` json
  "skipFiles": [
    "${workspaceFolder}/node_modules/**/*.js",  //跳过node_modules
    "${workspaceFolder}/lib/**/*.js",//跳过lib
    "<node_internals>/**/*.js"//跳过node核心模块
  ]
  ```

- `trace`启用诊断输出

**`attach` 特有字段**

- program：程序的启动入口；

- `args :[]String` 传递给程序的参数,可在`process.argv`拿到

- `cwd` 指定程序启动调试的目录 ,当 vscode 启动目录不是项目根目录，并且调试npm script时非常有用

- `runtimeExecutable` 设置运行时可执行文件路径，默认是 `node` 可以是其他的执行程序，如`npm、nodemon、esno、ts-node`

- `runtimeArgs` 传递给运行时可执行文件的参数,例如：

  ``` json
  {
    "type": "node",
    "request": "launch",
    "name": "npm launch app",
    "args":["a"],
    "runtimeExecutable": "npm",
    "runtimeArgs": [
      "run-script",
      "app",
      "b"
    ],
    "port": 6666
  }
  ```

  打印参数可以发现 `args 、runtimeArgs`都会传给程序，但是`runtimeArgs`参数会紧跟可执行文件

  ``` bash
  C:\Program Files\nodejs\npm.cmd\run-script app b a
  Debugger listening on wS://127.0.0.1:6666/3d146f17-87eb-402e-9d3d-2c0e415386e1 
  For help, see: https://nodejs.orgLen/docs/inspector 
  Debugger attached.
  
  > Array(4) ["C:\Program Files\nodejs\node.exe", "F:\owerProject\demo\express-app.js","b","a"]
  ```

- `runtimeVersion` 设置运行时可执行程序的版本，如果使用`nvm`，可以切换node.js版本

- `env` 添加额外的环境变量

- `envFile` 文件加载环境变量

- `console` 配置终端可以是外部终端或者内部集成终端，默认值`internalConsole`

- `outputCapture` -如果设置为std，则进程stdout / stderr的输出将显示在调试控制台中，而不是侦听调试端口上的输出。这对于直接写入stdout / stderr流而不是使用console.*API的程序或日志库很有用。

- `autoAttachChildProcesses` 跟踪调试对象的所有子过程，并自动附加到在调试模式下启动的子过程

**`attach` 特有字段**

- `processId` 指定nodejs进程id,由于每次启动都会变，传入`"${command:PickProcess}"`

## 变量参考

### 预定义变量

``` bash
${userHome} - 用户主文件夹的路径
${workspaceFolder} - 在 VS Code 中打开的文件夹的路径
${workspaceFolderBasename} - 在 VS Code 中打开的文件夹的名称，不带任何斜杠 (/)
${file} - 当前打开的文件
${fileWorkspaceFolder} - 当前打开文件的工作区文件夹
${relativeFile} - 当前打开的文件相对于workspaceFolder
${relativeFileDirname} - 当前打开的文件的目录名相对于workspaceFolder
${fileBasename} - 当前打开的文件的基本名称
${fileBasenameNoExtension} - 当前打开的文件的基本名称，没有文件扩展名
${fileExtname} - 当前打开的文件的扩展名
${fileDirname} - 当前打开文件的文件夹路径
${fileDirnameBasename} - 当前打开文件的文件夹名称
${cwd} - VS Code 启动时任务运行器的当前工作目录
${lineNumber} - 活动文件中当前选定的行号
${selectedText} - 活动文件中当前选定的文本
${execPath} - 正在运行的 VS Code 可执行文件的路径
${defaultBuildTask} - 默认构建任务的名称
${pathSeparator} - 操作系统用于分隔文件路径中组件的字符
```

### 环境变量

您还可以通过 `${env:Name}` 语法引用环境变量（例如，`${env:USERNAME}`）。

``` json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}/app.js",
  "cwd": "${workspaceFolder}",
  "args": ["${env:USERNAME}"]
}
```

### 配置变量

您可以通过`${config:Name}`语法（例如）引用 VS Code 设置（“配置”）`${config:editor.fontSize}`。

### 命令变量

如果上面的预定义变量不够，您可以通过 `${command:commandID}` 语法使用任何 VS Code 命令作为变量。

### 输入变量

> 命令变量已经很强大，但它们缺乏一种机制来配置针对特定用例运行的命令。例如，不可能将提示消息或默认值传递给通用“用户输入提示”。

目前 VS Code 支持三种类型的输入变量：

- `PromptString`：显示一个输入框以从用户处获取字符串。
- `pickString`：显示快速选择下拉列表，让用户从多个选项中进行选择。
- `command`：运行任意命令。

每种类型都需要额外的配置属性：

**promptString：**

- description：显示在快速输入中，提供输入的上下文。
- default：如果用户没有输入其他内容，将使用默认值。
- password：设置为 true 以使用密码提示输入，但不会显示键入的值。

**pickString：**

- description：显示在快速选择中，提供输入的上下文。
- options：供用户选择的选项数组。
- default：如果用户没有输入其他内容，将使用默认值。它必须是选项值之一。

选项可以是字符串值或同时具有标签和值的对象。下拉列表将显示label: value。

**command：**

- command：在变量插值上运行的命令。
- args：传递给命令实现的可选选项包。

示例：

``` json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "inputs": [
    // {
    //   "type": "command",
    //   "id": "commId",
    //   "command": "qq"
    // },
    {
      "type": "pickString",
      "id": "initiator",
      "description": "Please select an initiator",
      "options": ["node", "esno", "ts-node"],
      "default": "node"
    },
    {
      "type": "promptString",
      "id": "args",
      "description": "Please enter parameters",
      "default": ""
    }
  ],
  "configurations": [
    {
      "name": "launch current file with input",
      "type": "node",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "program": "${fileWorkspaceFolder}",
      "runtimeExecutable": "${input:initiator}",
      "runtimeArgs": ["${input:args} ${file}"]
    },
  ]
}
```

## Question

### 1. 如果使用了符号链接怎么调试？

传递参数:

```json
{
  "runtimeArgs": ["--preserve-symlinks"]
}
```

如果主脚本也在符号链接路径里面，需要再传递一个参数`"--preserve-symlinks-main"`，支持的版本是 `Node 10+.`

### 2. 如何调试 ECMAScript 模块？

如果使用esm或传递`--experimental-modules`给Node.js以便使用ECMAScript模块，则可以传递这些选项通过`runtimeArgs`属性：

- `"runtimeArgs" : ["--experimental-modules"]`  -使用Node v8.5.0 +中的[实验性ECMAScript模块支持](https://links.jianshu.com/go?to=https%3A%2F%2Fnodejs.org%2Fapi%2Fesm.html)
- `"runtimeArgs" : ["-r", "esm"]` -使用[esm ES模块加载器](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fstandard-things%2Fesm)（请注意，`["-r esm"]`如果没有逗号，则无法使用）

## 参考文献

[VScode 变量参考](https://code.visualstudio.com/docs/editor/variables-reference#_environment-variables)

[在 Visual Studio Code 中调试](https://code.visualstudio.com/docs/editor/debugging#_global-launch-configuration)

[如何使用 VS Code 来调试 Node.js 代码](https://wizardforcel.gitbooks.io/node-in-debugging/content/4.3.html)

[Launch.json attributes](https://code.visualstudio.com/docs/editor/debugging#_launchjson-attributes)

[Launch configuration attributes](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_launch-configuration-attributes)

[VSCode 调试中 launch.json 配置不完全指南](https://www.barretlee.com/blog/2019/03/18/debugging-in-vscode-tutorial/)
