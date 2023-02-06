# TypeScript 指北

> 本模块着重记录那些常用却又不那么常用的知识点，一些很常见的只是点会一笔带过甚至忽略，而那些很冷门的点也不会做记录，故名 “指北” 。

主要针对个人尚未完全掌握的基本方法的一次补强。

## 初始化

``` bash
tsc --init
```

## 自动生成 .d.ts 声明文件

``` shell
tsc -d
```

``` json
// ts.config.json
{
  "compilerOptions": {
    // ...
    "declaration": true,
  }
}
```
