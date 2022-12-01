# JavaScript 函数柯里化

> In mathematics and computer science, currying is the technique of translating the evaluation of a function that takes multiple arguments (or a tuple of arguments) into evaluating a sequence of functions, each with a single argument.

翻译为中文

?> 在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

举个例子：

``` js
function add(a, b) {
  return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 curry 函数可以做到柯里化
var addCurry = curry(add);
addCurry(1)(2) // 3
```

## 用途

我们会讲到如何写出这个 `curry` 函数，并且会将这个 `curry` 函数写的很强大，但是在编写之前，我们需要知道柯里化到底有什么用？

参数复用 （提高适用性）

!> 【通用函数】解决了兼容性问题，但同时也会带来使用的不便利性，不同的应用场景往，要传递很多参数，以达到解决特定问题的目的。有时候应用中，同一种规则可能会反复使用，这就可能会造成代码的重复性。

?> 我们缩小了函数的适用范围，但同时提高函数的适性。当然，也有扩展函数适用范围的方法-- **反柯里化**

``` js
// 示意而已
function ajax(type, url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  xhr.send(data);
}

// 虽然 ajax 这个函数非常通用，但在重复调用的时候参数冗余
ajax('POST', 'www.test.com', "name=kevin")
ajax('POST', 'www.test2.com', "name=kevin")
ajax('POST', 'www.test3.com', "name=kevin")

// 利用 curry
var ajaxCurry = curry(ajax);

// 以 POST 类型请求数据
var post = ajaxCurry('POST');
post('www.test.com', "name=kevin");

// 以 POST 类型请求来自于 www.test.com 的数据
var postFromTest = post('www.test.com');
postFromTest("name=kevin");
```

``` js
// 正则验证字符串
function test(reg, string) {
  return reg.test(string);
}

// 柯里化
const testCurry = curry(test);

const hasNumber = testCurry(/\d+/g);
const hasLetter = testCurry(/[a-zA-z]+/g);
```

## 实现

``` js
function curry(fn, ...argArray) {
  return function() {
    // 累计参数
    argArray = [...argArray, ...arguments];
    // 参数数量 = fn入参数量，则执行方法
    if (argArray.length === fn.length) {
      return fn.call(this, ...argArray);
    }
    // 否则继续回调累加
    return curry.call(this, fn, ...argArray);
  }
}
```

## 参考文献

[JavaScript专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42)

[详解JS函数柯里化](https://www.jianshu.com/p/2975c25e4d71)
