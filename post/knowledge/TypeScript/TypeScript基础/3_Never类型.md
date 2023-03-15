# Never 类型

> never 类型表示的是那些永不存在的值的类型。 例如，never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。

``` js
// 返回never的函数必须存在无法达到的终点

// 函数永远抛出错误
function error(message: string): never {
  throw new Error(message);
}

// 函数永远不会有返回值
function infiniteLoop(): never {
  while (true) {}
}
```

与 `void` 的差异
> `void` 和 `never` 都是表示一个函数没有返回值，但是他们之间最大的区别是，`void` 表示可以被赋值的类型，`never` 表示其他任何类型也不能被赋值给它，它只能是 `never`

在 TypeScript 中，可以利用 never 类型的特性来实现全面性检查，具体示例如下：

``` js
type Value = string | number;

function controlFlowAnalysisWithNever(value: Value) {
  if (typeof value === 'number') {
    // 这里 foo 被收窄为 number 类型
    // ...
  } else if (typeof value === 'string') {
    // 这里 foo 被收窄为 string 类型
    // ...
  } else {
    // value 此时应为 never 类型
    const check: never = value;
  }
}
```

注意在 `else` 分支里面，我们把收窄为 `never` 的 `value` 赋值给一个显示声明的 `never` 变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天你的同事修改了 `Value` 的类型：

``` js
type Value = string | number | boolean;
```

然而他忘记同时修改 `controlFlowAnalysisWithNever` 方法中的控制流程，这时候 `else` 分支的 `Value` 类型会被收窄为 `boolean` 类型，导致无法赋值给 `never` 类型，这时就会产生一个编译错误。通过这个方式，我们可以确保 `controlFlowAnalysisWithNever` 方法总是穷尽了 `Value` 的所有可能类型。 通过这个示例，我们可以得出一个结论：**使用 `never` 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码**

``` js
type Value = string | number | boolean; // 添加 boolean 类型

function controlFlowAnalysisWithNever(value: Value) {
  if (typeof value === 'number') {
    // 这里 foo 被收窄为 number 类型
    // ...
  } else if (typeof value === 'string') {
    // 这里 foo 被收窄为 string 类型
    // ...
  } else {
    // value 此时应为 never 类型
    const check: never = value;  // 不能将类型“boolean”分配给类型“never”。ts(2322)
  }
}
```
