# 迭代器模式

> 迭代器模式是一种设计模式，是一种最简单也最常见的设计模式。它可以让用户透过特定的接口巡访容器中的每一个元素而不用了解底层的实现。

迭代器模式号称 “遍历专家”，它提供一种方法顺序访问一个聚合对象中的各个元素，且不暴露该对象的内部表示。迭代器又分内部迭代器（`jquery.each/for...of`）和外部迭代器（`es6 yield`）。
在 es6 之前，直接通过 `forEach` 遍历 DOM NodeList 和函数的 `arguments` 对象，都会直接报错，其原因都是因为他们都是类数组对象。对此 jquery 很好的兼容了这一点。
在 es6 中，它约定只要数据类型具备 `Symbol.iterator` 属性，就可以被 `for...of` 循环和迭代器的 `next` 方法遍历。

## 示例

iterator

``` js
const arr = [1,2,3,4,5];

function iteratorGenerator(arr) {
  return arr[Symbol.iterator]();
}

const iterator = iteratorGenerator(arr);
```

es5 实现

``` js
function iteratorGenerator(arr) {
  var idx = 0,
  length = arr.length;
  return {
    next() {
      var done = idx >= length;
      var value = done ? undefined : arr[idx++];
      return {
        done,
        value,
      }
    }
  }
}
```

Generator 参数

``` js
function * gene() {
  var a = yield 'a';
  console.log("a====", a);
  var b = yield 'b';
  console.log("b====", a,b);
  return 'completed';
}

const g = gene();

g.next();
// => {value: 'a', done: false}

g.next('aaa');
// => a==== aaa
// => {value: 'b', done: false}

g.next('bbb');
// => b==== bbb
// => {value: 'completed', done: false}
```
