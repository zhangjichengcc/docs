# object Object 和 {}

## object 类型

> object 类型是：TypeScript 2.2 引入的新类型，它用于表示**非原始类型**。

TypeScript的原始类型`（number、string、bigint、boolean、symbol、null、undefined、object）`对应的正是JavaScript定义的 8 种内置类型：`Number、String、BigInt、Boolean、Symbol、Null、Undefined、Object`。
当然，TypeScript还定义了其他重要的类型：`unknown、never、void、数组、元组、函数` 等
object **表示任何非原始值类型**，包括`对象、函数、数组`等。

``` js
// node_modules/typescript/lib/lib.es5.d.ts
interface ObjectConstructor {
  create(o: object | null): any;
  // ...
}

const proto = {};

Object.create(proto);     // OK
Object.create(null);      // OK
Object.create(undefined); // Error
Object.create(1337);      // Error
Object.create(true);      // Error
Object.create("oops");    // Error
```

### 实例

> JavaScript WeakMap 要求键必须是对象，TypeScript 在定义 WeakMap 时 使用的正是 object 约束键的类型

``` js
interface WeekMap<K extends object, V> {
  delete(key: K): boolean;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): this;
}
```

## Object

> Object 类型：它是所有 Object 类的实例的类型，它由以下两个接口来定义：

- Object 接口定义了 Object.prototype 原型对象上的属性；

  ``` js
  // node_modules/typescript/lib/lib.es5.d.ts
  interface Object {
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
    hasOwnProperty(v: PropertyKey): boolean;
    isPrototypeOf(v: Object): boolean;
    propertyIsEnumerable(v: PropertyKey): boolean;
  }
  ```

- ObjectConstructor 接口定义了 Object 类的属性。

  ``` js
  // node_modules/typescript/lib/lib.es5.d.ts
  interface ObjectConstructor {
    /** Invocation via `new` */
    new(value?: any): Object;
    /** Invocation via function calls */
    (value?: any): any;
    readonly prototype: Object;
    getPrototypeOf(o: any): any;
    // ···
  }

  declare var Object: ObjectConstructor;
  ```

**Object 类的所有实例都继承了 Object 接口中的所有属性。**

由于JavaScript的装箱拆箱机制，**基本类型有能力访问Object.prototype原型对象上的属性**。  
因此，在 TS `Object` 类型可以**同时接受引用类型和基本类型**（不包括undefined和null）。但 object 类型不能接受原始值。

``` js
let obj: object = 1; // 不能将类型“number”分配给类型“object”。ts(2322)
let Obj: Object = 1; // OK
```

因此，在约束类型为非原始值类型时，应当始终使用 object！

需要注意的是，如果Object类型的值对象属性名与Object接口定义的属性冲突，则TS编译报错。

``` js
let b: Object = { 
  /** 
   * 不能将类型“() => number”分配给类型“() => string”。
    * 不能将类型“number”分配给类型“string”。ts(2322)
    */
  toString() { return 123 }
  // OK
  toString() { return '123'}
};
```

而对于 object 类型来说，TypeScript 编译器不会提示任何错误：

``` js
let b: object = {
  toString() { return 123}; // OK
}
```

另外在处理 object 类型和字符串索引对象类型的赋值操作时，也要特别注意。比如：

``` js
let strictTypeHeaders: {[key: string]: string} = {};

let header:object = {};

header = strictTypeHeaders; // OK

/**
 * 不能将类型“object”分配给类型“{ [key: string]: string; }”。
  * 类型“{}”中缺少类型“string”的索引签名。
  */
strictTypeHeaders = header; // Error
```

> 在上述例子中，最后一行会出现编译错误，这是因为 { [key: string]: string } 类型相比 object 类型更加精确。而 header = strictTypeHeaders; 这一行却没有提示任何错误，是因为这两种类型都是非基本类型，object 类型比 { [key: string]: string } 类型更加通用。

## {}

> {} 类型描述了一个没有成员的对象。当你试图访问这样一个对象的任意属性时，TypeScript 会产生一个编译时错误。

``` js
// Type {}
const obj = {};

// Error: Property 'prop' does not exist on type '{}'.
obj.prop = "abc";
```

但是，你仍然可以使用在 Object 类型上定义的所有属性和方法，这些属性和方法可通过 JavaScript 的原型链隐式地使用：

``` js
// Type {}
const obj = {};

// "[object Object]"
obj.toString();
```

`{}` 也可以赋予原始值

```js
let foo: {};
foo = 3;    // OK
```

虽然 `Object` 和 `{}` 都可以接受基本类型的值，但并不包括 `null` 和 `undefined`。

``` js
// 不能将类型 null 分配给类型 {}
let foo: {} = null;  // error
// 不能将类型 undefined 分配给类型 Object
let bar: Object = undefined;  // error
```

可以明显感觉到，`{}` 与 `Object` 的效果几乎一样，即 `{} == Object`，但 `Object` 更规范。

`object` 则是一个宽泛的通用的非基本类型

``` js
let foo: { [key: string]: string } = {};
let bar: object = {};
bar = foo; // OK
// 不能将类型 object 分配给类型 { [key: string]: string; }
foo = bar; // Error
```

在 JavaScript 中创建一个表示二维坐标点的对象很简单

``` js
const point = {};

point.x = 3;
point.y = 4;
```

然而以上代码在 TypeScript 中，每个赋值语句都会产生错误

``` js
const point = {};

point.x = 3; // 类型“{}”上不存在属性“x”。ts(2339)
point.y = 4; // 类型“{}”上不存在属性“y”。ts(2339)
```

可以通过 断言或者声明时直接构建

``` javascript
// 断言
interface Point {
  x: number;
  y: number;
}
const point = {} as Point;
point.x = 3;
point.y = 4;

// 声明
const point = {
  x: 3,
  y: 4,
}
```
