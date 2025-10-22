# PM2 守护进程管理器

> PM2 是一个守护进程管理工具，帮助您管理和守护您的应用程序。它以简单直观的 C​​LI 命令行方式进行工作。

## 安装

``` bash
$ npm install pm2@latest -g
# or
$ yarn global add pm2
```

## 启动

### 基本方式

``` bash
$ pm2 start <js文件路径>.js
$ pm2 start <json描述文件路径>.json
$ pm2 start <sh文件路径>.sh
```

### npm/yarn

``` bash
$ pm2 start npm -- start
$ pm2 start npm -- run <scriptname>
$ pm2 start yarn -- start
$ pm2 start yarn -- run <scriptname>
$ pm2 start <某种方式> -- --param_name param_value
```

### 配置文件

``` javascript
// config.js
module.exports = {
  apps : [{
    name   : "limit worker",
    script : "./worker.js",
    args   : "limit"
  },{
    name   : "rotate worker",
    script : "./worker.js",
    args   : "rotate"
  }]
}
```

``` json
# config.json
{
  "apps":
  {
    "name": "test",
    "cwd": "/yourpath/here/",
    "script": "./test.sh",
    "exec_interpreter": "bash",
    "min_uptime": "60s",
    "max_restarts": 30,
    "exec_mode" : "cluster_mode",
    "error_file" : "./test-err.log",
    "out_file": "./test-out.log",
    "pid_file": "./test.pid",
    "watch": false
  }
}
```

## 参考文献

[PM2中文网](https://pm2.fenxianglu.cn/)
