# JavaScript 类型判断

## JavaScript 数据类型

> ECMAScript包括两个不同类型的值：**基本类型**和**引用类型**。

- 基本数据类型（原始类型/值类型）由于其占据空间固定，是简单的数据段，为了便于提升变量查询速度，将其存储在**栈(stack)**中，即按值访问。：

  `Number`、 `String`、 `Boolean`、 `Null`、 `Undefined`、`Symbol`、`BigInt`

- 引用数据类型 其值的大小会改变，所以不能将其存放在栈中，否则会降低变量查询速度，因此，其值存储在 **堆(heap)** 中，而存储在变量处的值，是一个指针，指向存储对象的内存处，即按址访问。：

  `Object` 在 js 中除了基本数据类型，其他都是引用数据类型；

  `Object`(狭义对象)、 `Function`、 `Array`、 `ExgExp`、 `Date`、 `Map`、 `WeekMap`、 `Set`、 `WeekSet` ...

而我们常用判断数据类型的方法包括：

- typeof
- instanceof
- constructor
- Object.prototype.toString.call()
- isArray

---

## typeof

> `typeof` 一般被用于判断一个变量的类型，我们可以利用 `typeof` 来判断`number`,  `string`,  `object`,  `boolean`,  `function`, `undefined`,  `symbol` 这七种类型，这种判断能帮助我们搞定一些问题，比如在判断不是 object 类型的数据的时候，`typeof`能比较清楚的告诉我们具体是哪一类的类型。

缺点：

- 对于基本类型，因为历史遗留的原因。`typeof null` 尝试返回为`null`失败了，所以要记住，`typeof null`返回的是 `object`。除 `null` 以外，均可以返回正确的结果。

- 对于引用类型，除 `function` 以外，一律返回 `object` 类型。

其中，`null` 有属于自己的数据类型 `Null` ， 引用类型中的 数组、日期、正则 也都有属于自己的具体类型，而 `typeof` 对于这些类型的处理，只返回了处于其原型链最顶端的 `Object` 类型，没有错，但不是我们想要的结果。

``` js
const str = new String('abc');

typeof str === 'object'; // true

typeof null; // object
```

原理：

js 在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

但是，对于 `null` 和 `undefined` 来说：

- `null`：所有机器码均为0
- `undefined`：用 −2^30 整数来表示

!> 由于 `null` 的所有机器码均为0，因此直接被当做了对象来看待。

?> 因此在用 `typeof` 来判断变量类型的时候，我们需要注意，最好是用 `typeof` 来判断基本数据类型（包括`symbol`），避免对 null 的判断。

## instanceof

> `A instanceof B` 用来判断 `A` 是否为 `B` 的实例，需要注意的是：**instanceof 检测的是原型**

``` js
let person = function () {
}
let nicole = new person()
nicole instanceof person // true
```

当然，`instanceof` 也可以判断一个实例是否是其父类型或者祖先类型的实例。

``` js
let person = function () {
}
let programmer = function () {
}
// 原型链继承
programmer.prototype = new person()
let nicole = new programmer()
nicole instanceof person // true
nicole instanceof programmer // true
```

## 参考文献

[浅谈 instanceof 和 typeof 的实现原理](https://juejin.cn/post/6844903613584654344)

