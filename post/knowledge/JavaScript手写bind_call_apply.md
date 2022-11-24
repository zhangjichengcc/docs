# JavaScript 手写bind call apply

## 释义

- call `function.call(obj, ...argArray)` 改变 `this` 指向，指向到 `obj`, 并执行方法;

- apply `function.apply(obj, argArray)` 同 `call` 区别在于参数为数组形式 `[arg1, arg2, ...]`;

- bind `function.bind(obj, ...argArray)` 同 `call` 区别在于 `call` 返回一个新的方法，不会立刻执行，bind返回值可以再次通过 `(...otherArgArray)`，进行传参;

  ``` js
    function fn() {
      console.log(...arguments);
    }

    fn.call(this, 1,2,3)(2,1); // => 1 2 3 2 1
  ```

## call

> `call()` 方法在使用一个指定的 `this` 值和若干个指定的参数值的前提下调用某个函数或方法。

实现：

- 改变 `this` 指向；
- 执行方法；
- 入参为剩余参数 `obj, ...args`;

``` js
Function.prototype.myCall = function(obj, ...args) {
  // 将调用call的方法[this]绑定到obj上，用临时方法fn接收，这一步使fn的this指向obj
  obj.fn = this;
  // 将执行结果赋值给临时变量，此处是为了删除obj不存在的fn
  const tmp = obj.fn(...args);
  // 删除obj.fn
  delete obj.fn;
  return tmp;
}
```

## apply

`apply` 和 `call` 方法基本相同，只是传参方式为数组

``` js
Function.prototype.myApply = function(obj, args) {
  obj.fn = this;
  const tmp = obj.fn(...args);
  delete obj.fn;
  return tmp;
}
```

## bind

> `bind()` 方法会创建一个新函数。当这个新函数被调用时，`bind()` 的第一个参数将作为它运行时的 `this`，之后的一序列参数将会在传递的实参前传入作为它的参数。

?> `bind` 方法与 `call` 的区别在于 `bind` 会返回一个新方法，而 `call` 返回的是执行结果.

实现：

- 改变 `this` 指向；
- 返回新方法；
- 入参为剩余参数 `obj, ...args`;
- 作为**构造函数**使用

``` js
// 使用call
Function.prototype.myBind = function(obj, ...args) {
  const that = this;
  return function() {
    that.call(obj, ...args, ...arguments);
  }
}

// 不使用call
Function.prototype.myBind = function(obj, ...args) {
  obj.fn = this;
  return function() {
    obj.fn(...args, ...arguments);
  }
}
```

验证：

``` js
const obj = {
  name: 'tom'
}

function fn1() {
  console.log(this.name)
}

function fn2(age, sex) {
  console.log(this.name, age, sex);
}

fn1.bind(obj)(); // tom

fn2.bind(obj, 18, 'man')();   // tom 18 man
fn2.bind(obj, 18)('man');     // tom 18 man
```

如上，基本的 `bind` 功能已经实现，下面考虑一下作为构造函数使用的情况；

首先分析一下 `bind` 作为构造函数调用的结果；

``` js
const obj = {
  name: 'tom'
}

function Fn(sex) {
  this.sex = sex;
}

Fn.prototype.age = 18;

new (Fn.bind(obj, 'man'))
```

``` output
Fn {sex: 'man'}
↪ sex: "man"
  [[Prototype]]: Object
  ↪ age: 18
    constructor: ƒ Fn(sex)
    [[Prototype]]: Object
```

如上，`new (Fn.bind(obj, 'name'))` 方法返回新的对象，属性为 `F()` 本身，**并未指向 `bind` 绑定的 `obj`**，即对于 `new` 来说，`call` 的**第一个参数并未生效**

!> 一个绑定函数也能使用 `new`操作符创建对象：这种行为就像把原函数当成构造器。提供的 `this` 值被忽略，同时调用时的参数被提供给模拟函数。

也就是说当 `bind` 返回的函数作为构造函数的时候，`bind` 指定的 `this` 值会失效，但传入的参数依然生效.

以上，完善一下 `myBind`

``` js
Function.prototype.myBind = function(obj, ...args) {
  const that = this;
  
  function fn() {
    /** 
     * this 是运行时，
     * 当以构造函数形式调用（new），this 为实例
     * 当以普通函数调用，this 为调用者（windows）
     */
    if (this instanceof fn) {
      that.call(this, ...args, ...arguments);
    } else {
      that.call(obj, ...args, ...arguments);
    }
  }

  fn.prototype = that.prototype;

  return fn;
}
```

## 参考文献

[https://github.com/mqyqingfeng/Blog/issues/12](JavaScript深入之bind的模拟实现)

[手写 Call、Apply、Bind](https://note.zhangjc.cn/src/1_JS%E5%9F%BA%E7%A1%80/20210402_%E6%89%8B%E5%86%99call&bind&apply.html)
