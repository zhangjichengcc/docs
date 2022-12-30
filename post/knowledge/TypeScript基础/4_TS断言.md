# TS断言

> 有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

## 1.类型断言

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用。

类型断言有两种形式：

### 1.1 "尖括号" 语法

``` js
const str: any = "hello world";
const strLength: number = (<string>str).length;
```

### 1.2 as 语法

``` javascript
const str: any = "hello world";
const strLength: number = (str as string).length;
```

## 2. 非空断言

> 在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 `null` 和非 `undefined` 类型。具体而言，`x!` 将从 `x` 值域中排除 `null` 和 `undefined` 。

### 实例

1. 忽略 `undefined` 和 `null` 类型

  ``` js
  function fn(value: string | undefined | null) {
    /**
     * 不能将类型“string | null | undefined”分配给类型“string”。
     * 不能将类型“undefined”分配给类型“string”。ts(2322)
     */
    const onlyString: string = value; // Error
    const ignoreUndefinedAndNull: string = value!; // OK
  }
  ```

2. 调用函数时忽略 `undefined` 类型

  ``` js
  type NumGenerator = () => number;

  function fn(numberGenerator: NumGenerator | null) {
    numberGenerator(); // Error 不能调用可能是 "null" 的对象。ts(2721)
    numberGenerator!(); // OK
  }
  ```

  因为 `!` 非空断言操作符会从编译生成的 JavaScript 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：

  ``` js
  const num: number | undefined = undefined;

  const value: number = num!;
  ```

  以上 TS 代码会编译生成以下 ES5 代码：

  ``` js
  "use strict";
  const num = undefined;
  const value = num;
  ```

  虽然在 TS 代码中，我们使用了非空断言，使得 `const value: number = num!;` 语句可以通过 TypeScript 类型检查器的检查。但在生成的 ES5 代码中，`!` 非空断言操作符被**移除了**，所以在浏览器中执行以上代码，在控制台会输出 `undefined`。

3. 确定赋值断言

> 在 TypeScript 2.7 版本中引入了确定赋值断言，即允许**在实例属性和变量声明后面放置一个 ! 号**，从而告诉 TypeScript 该属性会被明确地赋值。

为了更好地理解它的作用，我们来看个具体的例子：

``` js
let x: number;
initialize();
// 在赋值前使用了变量“x”。ts(2454)
console.log(2 * x); // Error

function initialize() {
  x = 10;
}
```

使用确定赋值断言：

``` js
let x!: number;
initialize();
// 在赋值前使用了变量“x”。ts(2454)
console.log(2 * x); // Error

function initialize() {
  x = 10;
}
```

最后还是要注意，断言相当于打破了TS本身的校验，故在使用断言时一定要保证自己的代码是安全的！
