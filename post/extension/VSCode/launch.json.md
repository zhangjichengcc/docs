# launch.json 配置不完全指南

官网地址: [https://code.visualstudio.com/docs/nodejs/nodejs-debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

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

参数说明

configurations

必填字段：

- name：调试名
- type：必填项，调试类型，当前为 node，如果是 PHP 调试，则在安装 PHP 调试插件后写 php；
- request：必填项，有两种类型，分别是 `launch` 和 `attach`，前者的意思就是 VSCode 会打开这个程序然后进入调试，后者的意思是你已经打开了程序，然后接通 Node.js 的内部调试协议进行调试，如果你看过上面的“Node.js 的调试原理”一文，应该可以大致理解；

`launch` 与 `attach` 共有字段

- program：程序的启动入口；
- runtimeExecutable：启动命令；
- args：启动时的参数
- protocol: 设置调试协议 

​	 `auto` 尝试自动检测目标运行时使用的协议
 	`inspector` 新的V8调试器协议，解决遗留版本的多数问题，node versions >= 6.3 and Electron versions >= 1.7.4.
 	`legacy` 原始的v8调试器协议，node versions < v8.0 and Electron versions < 1.7.4.

- port: 调试使用的端口
- address: TCP/IP地址，用于远程调试



## 参考文献

[如何使用 VS Code 来调试 Node.js 代码](https://wizardforcel.gitbooks.io/node-in-debugging/content/4.3.html)

