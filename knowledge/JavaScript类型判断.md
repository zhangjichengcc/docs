# JavaScript 类型判断

## JavaScript 数据类型

> ECMAScript包括两个不同类型的值：**基本类型**和**引用类型**。

- 基本数据类型（原始类型/值类型）由于其占据空间固定，是简单的数据段，为了便于提升变量查询速度，将其存储在**栈(stack)**中，即按值访问。：

  `Number`、 `String`、 `Boolean`、 `Null`、 `Undefined`、`Symbol`、`BigInt`

- 引用数据类型：

  `Object` 在 js 中除了基本数据类型，其他都是引用数据类型；

  `Object`(狭义对象)、 `Function`、 `Array`、 `ExgExp`、 `Date`、 `Map`、 `WeekMap`、 `Set`、 `WeekSet` ...

### BigInt

> `BigInt` 是JavaScript于2019.7.22正式公布，并成为第八个基本数据类型。

`BigInt` 数据类型出现的目的是为了支持比 `Number` 数据类型支持的范围更大的整数值。使整数溢出不再是问题。

!> 由于JS存在数值限制，整数范围是 **[-2^53, 2^53]** ，即 **[-9007199254740991,9007199254740991]** 在这个范围之外就是失真。

``` js
Number.MAX_SAFE_INTEGER
// ↪ 9007199254740991
Number.MIN_SAFE_INTEGER
// ↪ -9007199254740991


Number.isSafeInteger(9007199254740991); // true
Number.isSafeInteger(9007199254740992); // false
```

> `BigInt` 是一个新的数据类型，可以用任意精度表示整数。使用 `BigInt` ，即使超出 `Number` 的安全整数限制，也可以安全地存储和操作大整数。

创建一个 `BigInt` 类型的方法，在数字后面添加 `n` 即可，也可以使用 `BigInt()` 将 `Number` 转换为 `BigInt`.

``` js
const a = 100n;
const b = BigInt(100);

a === b; // true
```

`BigInt` 的运算操作以及支持的运算符与 `Number` 一致，包括二元运算符：`+、-、*、**、/、%`，位运算：`|，&，>>，<<`；
但是 `>>>` （无符号右移）不能用于 `BigInt`。

!> 为了兼容 asm.js，`BigInt` 不支持单目 `(+)` 运算符，支持单目 `(-)` 运算符。

!> `‘/’` 操作符对于整数的运算也没问题。可是因为这些变量是 `BigInt` 而不是 `BigDecimal` ，该操作符结果会向零取整，也就是说不会返回小数部分。

``` js
5n / 2n;
// ↪ 2n
```

!> 不能使用 `Math` 内置对象

### 常用判断数据类型的方法

- typeof
- instanceof
- constructor
- toString
- isArray

---

## typeof

> `typeof` 一般被用于判断一个变量的类型，我们可以利用 `typeof` 来判断`number`,  `string`,  `object`,  `boolean`,  `function`, `undefined`,  `symbol` 这七种类型，这种判断能帮助我们搞定一些问题，比如在判断不是 object 类型的数据的时候，`typeof`能比较清楚的告诉我们具体是哪一类的类型。

缺点：

- `typeof` 在判断一个 object的数据的时候只能告诉我们这个数据是 object, 而不能细致的具体到是哪一种 object
- `typeof` 无法识别 `null` 

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

---

## instanceof

> `instanceof` 主要的作用就是判断一个实例是否属于某种类型

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

我们可以通过手写一个 `instanceof` 来研究其实现原理

``` js
function myInstanceof(leftValue, rightValue) {
  let left = leftValue.__proto__;
  const right = rightValue.prototype;
  // 当隐式原型不为null时，一直查找
  while(left) {
    if (left === right) return true;
    // 继续查找原型
    left = left.__proto__;
  }
  return false;
}

myInstanceof(1, Number); // true

function Person() {};

myInstanceof(new Person, Person); // true
myInstanceof(new Person, Object); // true
myInstanceof(new Person, Number); // false
```

---

## constructor

``` js
function Fn() {};

Fn.prototype.constructor === Fn; // true

const fn = new Fn();

fn.__proto__.constructor === Fn; // true
fn.constructor === Fn.prototype.constructor; // true
fn.constructor === Fn; // true
```

当一个函数 `Fn` 被定义时，JS引擎会为 `Fn` 添加 `prototype` 原型，然后再在 `prototype` 上添加一个 `constructor` 属性，并让其指向 `Fn` 的引用。

当执行 `const fn = new Fn()` 时，`Fn` 被当成了构造函数，`fn` 是 `Fn` 的实例对象，此时 `Fn` 原型上的 `constructor` 传递到了 `fn` 上，因此 `fn.constructor === Fn`;

可以看出，`Fn` 利用原型对象(`prototype`)上的 `constructor` 引用了自身，当 `Fn` 作为构造函数来创建对象时，原型上的 `constructor` 就被遗传到了新创建的对象(`fn`)上， 从原型链角度讲，构造函数 `Fn` 就是新对象的类型。这样做的意义是，**让新对象在诞生以后，就具有可追溯的数据类型**。

JavaScript 中的内置对象在内部构建时也是这样做的，借用此原理可以用来对js对象类型进行判断：

``` javascript
''.constructor === String;                   // true
new Number(1).constructor === Number;        // true
true.constructor === Boolean;                // true
new Function().constructor === Function;     // true
new Date().constructor === Date;             // true
new Error().constructor === Error;           // true
new WeakMap().constructor === WeakMap        // true
[].constructor === Array;                    // true
document.constructor === HTMLDocument;       // true
window.constructor === Window;               // true
```

!> `null` 和 `undefined` 是无效对象，不存在 `constructor`, 故无法通过此方法判断

!> 函数的 `constructor` 极不稳定，这个主要体现在自定义对象上，当开发者重写 `prototype` 后，原有的 `constructor` 引用会丢失，`constructor` 会默认为 `Object`

因此，为了规范开发，在重写对象原型时一般都需要重新给 `constructor` 赋值，以保证对象实例的类型不被篡改。

---

## toString

?> `toString()` 是 `Object` 的原型方法，调用该方法，默认返回当前对象的 `[[Class]]` 。这是一个内部属性，其格式为 `[object Xxx]` ，其中 `Xxx` 就是对象的类型。

!> 对于 `Object` 对象，直接调用 `toString()`  就能返回 `[object Object]` 。而对于其他对象，则需要通过 `call / apply` 来调用才能返回正确的类型信息。

``` js
new Object().toString();                          // [object Object]
Object.prototype.toString.call('');               // [object String]
Object.prototype.toString.call(1);                // [object Number]
Object.prototype.toString.call(4n)                // [object BigInt]
Object.prototype.toString.call(true);             // [object Boolean]
Object.prototype.toString.call(Symbol());         // [object Symbol]
Object.prototype.toString.call(undefined);        // [object Undefined]
Object.prototype.toString.call(null);             // [object Null]
Object.prototype.toString.call(new Function());   // [object Function]
Object.prototype.toString.call(new Date());       // [object Date]
Object.prototype.toString.call([]);               // [object Array]
Object.prototype.toString.call(new RegExp());     // [object RegExp]
Object.prototype.toString.call(new Error());      // [object Error]
Object.prototype.toString.call(new Map());        // [object Map]
Object.prototype.toString.call(new WeakMap())     // [object WeakMap]
Object.prototype.toString.call(new Set());        // [object Set]
Object.prototype.toString.call(new WeakSet())     // [object WeakSet]
Object.prototype.toString.call(document);         // [object HTMLDocument]
Object.prototype.toString.call(window);           // [object global] window 是全局对象 global 的引用
```

## 参考文献

[JS判断数据类型](https://note.zhangjc.cn/src/1_JS%E5%9F%BA%E7%A1%80/20211026_JS%E5%88%A4%E6%96%AD%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B.html)

[浅谈 instanceof 和 typeof 的实现原理](https://juejin.cn/post/6844903613584654344)

[如何判断JS类型](https://zhuanlan.zhihu.com/p/89238840)  

[判断JS数据类型的四种方法](https://www.cnblogs.com/onepixel/p/5126046.html)

