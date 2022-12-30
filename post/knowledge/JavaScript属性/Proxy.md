# Proxy 和 Reflect

> `Proxy` 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

## 语法

``` js
const proxy = new Proxy(target, handler);
```

参数:

- `target`: 要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
- `handler`: 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。

| 内部方法                | Handler 方法               | 何时触发                                                     |
| ----------------------- | -------------------------- | ------------------------------------------------------------ |
| `[[Get]]`               | `get`                      | 读取属性                                                     |
| `[[Set]]`               | `set`                      | 写入属性                                                     |
| `[[HasProperty]]`       | `has`                      | `in` 运算符                                                  |
| `[[Delete]]`            | `deleteProperty`           | `delete` 操作                                                |
| `[[Call]]`              | `apply`                    | proxy 对象作为函数被调用                                     |
| `[[Construct]]`         | `construct`                | `new` 操作                                                   |
| `[[GetPrototypeOf]]`    | `getPrototypeOf`           | [Object.getPrototypeOf](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FgetPrototypeOf) |
| `[[SetPrototypeOf]]`    | `setPrototypeOf`           | [Object.setPrototypeOf](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FsetPrototypeOf) |
| `[[IsExtensible]]`      | `isExtensible`             | [Object.isExtensible](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FisExtensible) |
| `[[PreventExtensions]]` | `preventExtensions`        | [Object.preventExtensions](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FpreventExtensions) |
| `[[DefineOwnProperty]]` | `defineProperty`           | [Object.defineProperty](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FdefineProperty), [Object.defineProperties](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FdefineProperties) |
| `[[GetOwnProperty]]`    | `getOwnPropertyDescriptor` | [Object.getOwnPropertyDescriptor](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FgetOwnPropertyDescriptor), `for..in`, `Object.keys/values/entries` |
| `[[OwnPropertyKeys]]`   | `ownKeys`                  | [Object.getOwnPropertyNames](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FgetOwnPropertyNames), [Object.getOwnPropertySymbols](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FgetOwnPropertySymbols), `for..in`, `Object/keys/values/entries` |

!> Proxy 是一种特殊的“奇异对象”。它没有自己的属性。如果 handler 为空，则透明地将操作转发给 target。

``` js
const user = {};

const userProxy = new Proxy(user, {});

userProxy.name = 'tom';

user.name; // tom
```

## 钩子函数

### \[[get\]]

> `handler.get()` 方法用于拦截对象的读取属性操作。

``` js
var p = new Proxy(target, {
  get: function(target, property, receiver) {
  }
});
```

- `this` 上下文绑定在 `handler` 对象上。
- `target` 目标对象。
- `property` 被捕获的属性名
- `receiver` Proxy 或者继承 Proxy 的对象

### \[[set\]]

> `handler.set()` 方法是设置属性值操作的捕获器。

``` js
const p = new Proxy(target, {
  set: function(target, property, value, receiver) {
  }
});
```

- `target` 目标对象。
- `property` 将被设置的属性名或 `Symbol`。
- `value` 新属性值。
- `receiver` 最初被调用的对象。通常是 `proxy` 本身，但 `handler` 的 `set` 方法也有可能在原型链上，或以其他方式被间接地调用（因此不一定是 `proxy` 本身）。

!> 注意： 假设有一段代码执行 `obj.name = "jen"`， `obj` 不是一个 `proxy`，且自身不含 `name` 属性，但是它的原型链上有一个 `proxy`，那么，那个 `proxy` 的 `set()` 处理器会被调用，而此时，`obj` 会作为 `receiver` 参数传进来。

`set()` 方法应当返回一个布尔值。

返回 `true` 代表属性设置成功。  
在严格模式下，如果 `set()` 方法返回 `false`，那么会抛出一个 `TypeError` 异常.

应用场景：

``` js
let numbers = [];

numbers = new Proxy(numbers, { // (*)
  set(target, prop, val) { // 拦截写入操作
    if (typeof val == 'number') {
      target[prop] = val;
      return true;
    } else {
      return false;
    }
  }
});

numbers.push(1); // 添加成功
numbers.push(2); // 添加成功
numbers.push("test"); // Uncaught TypeError （proxy 的 `set` 操作返回 false）
```

!> `Array` 的内建方法依然生效！ 值使用 `push` 方法添加入数组。添加值时，`length` 属性会自动增加。我们的代理对象 `Proxy` 不会破坏任何东西。

### \[[ownKeys\]]

> `Object.keys，for..in` 循环和大多数其他遍历对象属性的方法都使用 `[[OwnPropertyKeys]]`内部方法（由 `ownKeys` 钩子拦截) 来获取属性列表。

- `Object.getOwnPropertyNames(obj)` 返回非 Symbol 键。
- `Object.getOwnPropertySymbols(obj)` 返回 symbol 键。
- `Object.keys/values()` 返回带有 `enumerable` 标记的非 Symbol 键值对（属性标记在章节 属性标志和属性描述符 有详细描述).
- `for..in` 循环遍历所有带有 `enumerable` 标记的非 Symbol 键，以及原型对象的键。

在下面的示例中，我们使用 `ownKeys` 钩子拦截 `for..in` 对 `user` 的遍历，还使用 `Object.keys` 和 `Object.values` 来跳过以下划线 `_` 开头的属性：

``` js
let user = {
  name: "John",
  age: 30,
  _password: "***"
};

user = new Proxy(user, {
  ownKeys(target) {
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// "ownKeys" 过滤掉 _password
for(let key in user) alert(key); // name，然后是 age

// 对这些方法同样有效：
alert( Object.keys(user) ); // name,age
alert( Object.values(user) ); // John,30
```

如果我们返回对象中不存在的键，Object.keys 并不会列出该键：

``` js
let user = { };

user = new Proxy(user, {
  ownKeys(target) {
    return ['a', 'b', 'c'];
  }
});

alert( Object.keys(user) ); // <empty>
```

?> 原因很简单：`Object.keys` 仅返回带有 `enumerable` 标记的属性。为了检查它， 该方法会对每个属性调用 `[[GetOwnProperty]]` 来获得属性描述符。在这里，由于没有属性，其描述符为空，没有 `enumerable` 标记，因此它将略过.

那么如何使其正常返回？ 我们可以使用钩子 `getOwnPropertyDescriptor` 来实现

### \[[getOwnPropertyDescriptor\]]

> `handler.getOwnPropertyDescriptor()` 方法是 `Object.getOwnPropertyDescriptor()` 的钩子。

!> `getOwnPropertyDescriptor` 方法必须返回一个 `object` 或 `undefined`。

``` js
var p = new Proxy(target, {
  getOwnPropertyDescriptor: function(target, prop) {
  }
});
```

为了让 `Object.keys` 返回一个属性，我们要么需要将该属性及 `enumerable` 标记存入对象，或者我们可以拦截对它的调用 `[[GetOwnProperty]]` (钩子`getOwnPropertyDescriptor` 会执行此操作)，并返回描述符 `enumerable: true`。

``` js
let user = { };

user = new Proxy(user, {
  ownKeys(target) { // 一旦被调用，就返回一个属性列表
    return ['a', 'b', 'c'];
  },

  getOwnPropertyDescriptor(target, prop) { // 被每个属性调用
    return {
      enumerable: true,
      configurable: true
      /* 其他属性，类似于 "value:..." */
    };
  }

});

Object.keys(user); // a, b, c
```

### \[[deleteProperty\]]

**`handler.deleteProperty()`** 方法用于拦截对对象属性的 [`delete`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete) 操作。

``` js
var p = new Proxy(target, {
  deleteProperty: function(target, property) {
  }
});
```

`deleteProperty` 必须返回一个 [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 类型的值，表示了该属性是否被成功删除。

有一个普遍的约定，即下划线 `_` 前缀的属性和方法是内部的。不应从对象外部访问它们。

``` js
let user = {
  name: "John",
  _password: "secret"
};

user._password; // secret
```

让我们使用代理来防止对以 `_` 开头的属性的任何访问。

我们需要以下钩子：

- `get` 读取此类属性时抛出错误，
- `set` 写入属性时抛出错误，
- `deleteProperty` 删除属性时抛出错误，
- `ownKeys` 在使用 `for..in` 和类似 `Object.keys` 的方法时排除以 `_` 开头的属性。

``` js
let user = {
  name: "John",
  _password: "***",
  checkPassword() {
    return this._password;
  }
};

user = new Proxy(user, {
  get(target, prop) {
    if (prop.startsWith('_')) {
      throw new Error("Access denied");
    }
    let value = target[prop];
    // !注意：此处绑定target是为了规避 `checkPassword` 访问this的时候触发get钩子，导致_password无法访问；将方法绑定到targe上可以防止触发get
    return (typeof value === 'function') ? value.bind(target) : value; // (1)
  },
  set(target, prop, val) { // 拦截写入操作
    if (prop.startsWith('_')) {
      throw new Error("Access denied");
    } else {
      target[prop] = val;
      return true;
    }
  },
  deleteProperty(target, prop) { // 拦截属性删除
    if (prop.startsWith('_')) {
      throw new Error("Access denied");
    } else {
      delete target[prop];
      return true;
    }
  },
  ownKeys(target) { // 拦截读取属性列表
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// “get” 不允许读取 _password
try {
  console.log(user._password); // Error: Access denied
} catch(e) { console.log(e.message); }

//  “set” 不允许写入 _password
try {
  user._password = "test"; // Error: Access denied
} catch(e) { console.log(e.message); }

// “deleteProperty” 不允许删除 _password 属性
try {
  delete user._password; // Error: Access denied
} catch(e) { console.log(e.message); }

// “ownKeys” 过滤排除 _password
for(let key in user) console.log(key); // name
```

!> 注意：方法中(1)解决了方法中`this`绕过代理的方法，该解决方案通常可行，但并不理想，因为一种方法可能会将未代理的对象传递到其他地方，然后我们会陷入困境：原始对象在哪里，代理的对象在哪里？

!> 此外，一个对象可能会被代理多次（多个代理可能会对该对象添加不同的“调整”），并且如果我们将未包装的对象传递给方法，则可能会产生意想不到的后果。因此，在任何地方都不应使用这种代理。

?> 现代 Javascript 引擎原生支持私有属性，其以 # 作为前缀。但是，此类属性有其自身的问题。特别是，它们是**不可继承的**。

## \[[has\]]

> `handler.has()` 方法是针对 `in` 操作符的代理方法。

``` js
var p = new Proxy(target, {
  has: function(target, prop) {
  }
});
```

应用场景：

我们想使用 `in` 运算符来检查数字是否在 `range` 范围内。

``` js
let range = {
  begin: 1,
  end: 10,
}

range = new Proxy(range, {
  has(target, prop) {
    return prop >= target.begin && prop <= target.end;
  }
})

console.log(0 in range); // false
console.log(5 in range); // true
```

## 总结

钩子内的 `this` 指向的是 `handle`.

## 参考文献

[MDN | Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

[Proxy 规范](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)

[Proxy 和 Reflect](https://juejin.cn/post/6844904090116292616)
