# this 详解

## 前言

> `this` 指向问题是入坑前端必须了解知识点，现在迎来了ES6时代，因为箭头函数的出现，所以感觉有必要对 `this` 问题梳理一下，遂有此文
----
> 在非箭头函数下， `this` 指向调用其所在函数的对象，而且是离谁近就是指向谁（此对于常规对象，原型链， getter & setter等都适用）；构造函数下，`this` 与被创建的新对象绑定；DOM事件，`this` 指向触发事件的元素；内联事件分两种情况，`bind` 绑定， `call` & `apply` 方法等， 箭头函数也会进行讨论。

## 全局环境下

在全局环境下，`this` 始终指向全局对象（`window`）, 无论是否严格模式；

## 函数上下文调用

### 1. 函数直接调用

- 非严格模式下，`this` 指向全局对象
- 严格模式下，`this` 为 `undefined`

``` javascript
function f1() {
  return this;
}
function f2() {
  "use strict"; // 严格模式
  return this;
}

f1(); // window
f2(); // undefined
```

### 2. 对象中的this

对象内部方法的 `this` 指向调用这些方法的对象，

- 函数的定义位置不影响其 `this` 指向，`this` 指向只和调用函数的对象有关。
- 多层嵌套的对象，内部方法的 `this` 指向离被调用函数最近的对象（`window` 也是对象，其内部对象调用方法的 `this` 指向内部对象， 而非`window`）。

``` javascript
const obj = {
  value: 'obj',
  fn: function() {
    console.log(this.value);
    return this;
  }
}

obj.fn(); // "obj" {value: "obj", fn: ...}

const { fn } = obj;
fn(); // undefined window
```

### 3. 原型链中的this

原型链中方法的 `this` 仍然指向调用它的对象；

``` javascript
const obj = {
  value: 'obj',
}

obj.__proto__.fn = function() {
  console.log(this.value);
  return this;
}

obj.fn(); // "obj" {value: "obj"}

const { fn } = obj;
fn(); // undefined window
```

### 4. 构造函数中的this

构造函数中的 `this` 与被创建的新对象绑定。

注意：当构造器返回的默认值是一个 `this` 引用的对象时，可以手动设置返回其他的对象，如果返回值不是一个对象，返回 `this`。可参考[手写new](./20210224_手写new.md)

``` javascript
function P() {
  this.value = 'P';
}
P.prototype.getThis = function() {
  console.log(this.value);
  return this;
}

const p = new P();
p.getThis(); // "P" P {value: "P"}
```

### 5. call & apply & bind

当函数通过 `Function` 对象的原型中继承的方法 `call()`、 `apply()` 和 `bind()` 方法调用时， 其函数内部的 `this` 值可绑定到 `call()` & `apply()` & `bind()` 方法指定的第一个对象上， 如果第一个参数不是对象，JavaScript内部会尝试将其转换成对象然后指向它。

### 6. DOM 事件处理函数中的this

当函数被当做监听事件处理函数时， 其 `this` 指向触发该事件的元素 （针对于 `addEventListener` 事件）

### 7. 内联事件

- 当代码被内联处理函数调用时，它的 `this` 指向监听器所在的DOM元素
- 当代码被包括在函数内部执行时，其 `this` 指向等同于 函数直接调用的情况，即在非严格模式指向全局对象 `window`， 在严格模式指向 `undefined`

原生js

``` html
<script src="">
  function handleClick() {
    console.log(this);
  }
</script>

<!-- 输出该节点 -->
<button onclick="console.log(this)">内联处理函数调用时</button> 
<!-- 输出 window -->
<button onclick="handleClick()">内联处理函数调用时</button>
```

reactjs

``` js
class Demo extends React.Component {
  constructor() {
    // 这是官方推荐写法
    this.handleClick3 = this.handleClick1.bind(this);
  }

  // 函数声明
  handleClick1() {
    console.log(this);
  }

  // 箭头函数
  hanndleClick2 = () => {
    console.log(this);
  }

  render() {
    return (
      <div>
        <!-- 输出undefined -->
        <button onClick={this.handleClick1}>函数声明</button>
        <!-- 输出 Class Demo -->
        <button onClick={this.handleClick2}>箭头函数</button>
        <!-- 输出 Class Demo -->
        <button onClick={this.handleClick1.bind(this)}>函数声明 bind</button>
        <!-- 输出 Class Demo -->
        <button onClick={this.handleClick3}>函数声明 construcor bind</button>
      </div>
    )
  }
}
```

这里提一下，内联方法其实等同于 `javascript` 的方法的赋值，将 `function` 赋值给一个变量，此时通过变量则丢失 `this`，见上面的 **2. 对象中的this**

### 8. setTimeout & setInterval

对于延时函数内部的回调函数（非箭头函数）的 `this` 指向全局对象window（当然我们可以通过bind方法改变其内部函数的 `this` 指向）, 箭头函数不绑定`this`, 捕获上下文的 `this`，关于箭头函数下一节详解

``` javascript
const obj = {
  val: 123,
  fn: function() {
    setTimeout(function(){
      console.log(this.val);
      return this;
    }, 1000)
  }
}

obj.fn();
// 一秒后输出：undefined window

// --------------------------------
const obj = {
  val: 123,
  fn: function() {
    setTimeout(function(){
      console.log(this.val);
      return this;
    }.bind(this), 1000)
  }
}

obj.fn();
// 一秒后输出：123 obj{...}

// --------------------------------
const obj = {
  val: 123,
  fn: function() {
    setTimeout(() => {
      console.log(this.val);
      return this;
    }, 1000)
  }
}

obj.fn();
// 一秒后输出：123 obj{...}
```

这里说一下 `setTimeout` 的表现，`this` 指向调用他的对象，延迟之后真正调用方法的对象已经变为window;

### 9. 箭头函数中的 this

箭头函数体内的 `this` 对象，就是定义该函数时所在的作用域指向的对象，而不是使用时所在的作用域指向的对象。

- `call()` / `apply()` / `bind()` 方法对于箭头函数来说只是传入参数，对它的 this 毫无影响。
- 考虑到 `this` 是词法层面上的，严格模式中与 `this` 相关的规则都将被忽略。（可以忽略是否在严格模式下的影响）

``` javascript
const obj = {
  val: 123,
  fn: function() {
    setTimeout(() => {
      console.log(this.val);
      return this;
    }, 1000)
  }
}

obj.fn();
// 一秒后输出：123 obj{...}

```

``` javascript
const obj = {
  val: 123,
  fn1: function() {
    console.log(this.val);
    return this;
  },
  fn2: () => {
    console.log(this.val);
    return this;
  }
}

obj.fn1(); // 123 obj{...}
obj.fn2(); // undefined window
```

上面方法的 `obj.fn2()` 输出 `undefined window` ，其所在的作用域其实是最外层的js环境，因为 **没有其他函数包裹** ；最外层的js环境指向的对象是 `window` 对象，所以这里的 `this` 指向的是 `window` 对象。

如下我们将方法进行修改，增加一个方法包裹 `fn2` 改变其作用域

``` javascript
const obj = {
  val: 123,
  fn2: function() {
    return (() => {
      console.log(this.val);
      return this;
    })();
  }
}

obj.fn2(); // 123 obj{...}
```

最后是使用箭头函数其他几点需要注意的地方

1. 不可以当作构造函数，也就是说，不可以使用 `new` 命令，否则会抛出一个错误。
2. 函数体内不存在 `arguments`, 可以用 `rest` 参数(...变量名)代替。
3. 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数。

## 参考文献

[React事件处理函数必须使用bind(this)的原因](https://blog.csdn.net/qq_34829447/article/details/81705977)

[ES6 箭头函数this详解](https://zhuanlan.zhihu.com/p/57204184)
