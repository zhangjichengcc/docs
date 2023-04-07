# 单列模式

> **单例模式**，也叫**单子模式**，是一种常用的软件设计模式，属于**创建型模式**的一种。在应用这个模式时，单例对象的类必须保证只有一个实例存在。许多时候整个系统只需要拥有一个的全局对象，这样有利于我们协调系统整体的行为。比如在某个服务器程序中，该服务器的配置信息存放在一个文件中，这些配置数据由一个单例对象统一读取，然后服务进程中的其他对象再通过这个单例对象获取这些配置信息。这种方式简化了在复杂环境下的配置管理。

## 特点

- 类只有一个实例
- 全局可访问该实例
- 自行实例化（主动实例化）
- 可推迟初始化，即延迟执行（与静态类/对象的区别）

?> JavaScript 是一门非正规面向对象的语言，并没有类的定义。而单例模式要求一个 “唯一” 和 “全局访问” 的对象，在 JavaScript 中类似全局对象，刚好满足单例模式的两个特点：“唯一” 和 “可全局访问”。虽然它不是正规的单例模式，但不可否认确实具备类单例模式的特点。

单例模式又分**懒汉式**和**饿汉式**两种，其区别在于懒汉式在调用的时候创建实例，而饿汉式则是在初始化就创建好实例

## 示例

简单模式

``` js
// 饿汉式
class Single {
  static instance = new Single();
  static getInstance() {
    return Single.instance;
  }
}

// 懒汉式
class Single {
  static instance: Single;
  static getInstance() {
    return Single.instance || new Single();
  }
}
```

透明版-通过 `new` 关键字创建

``` js
const Single = (function() {
  let instance;
  return function(name) {
    this.name = name;
    return !!instance 
      ? instance
      : instance = this;
  }
})()
```

“代理版“ 单例模式：

通过“代理”的形式，意图解决：将管理单例操作，与对象创建操作进行拆分，实现更小的粒度划分，符合“单一职责原则”

``` js
class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

// 代理器
const ProxySingle = (function() {
  let instance;
  return function(...props) {
    return instance || instance = User;
  }
})()
```
