# Javascript 手写Promise

## 前序

`Promise/A+`规范: [https://github.com/promises-aplus/promises-spec](https://github.com/promises-aplus/promises-spec)

`Promise/A+`测试工具: [https://github.com/promises-aplus/promises-tests](https://github.com/promises-aplus/promises-tests)

- `Promise`其实是一个发布订阅模式
- `then` 方法对于还在pending的任务，其实是将回调函数 `onFulfilled` 和 `onRejected` 塞入了两个数组
- `Promise` 构造函数里面的 `resolve` 方法会将数组 `onFulfilledCallbacks` 里面的方法全部拿出来执行，这里面是之前 `then` 方法塞进去的成功回调
- 同理，`Promise` 构造函数里面的 `reject` 方法会将数组 `onRejectedCallbacks` 里面的方法全部拿出来执行，这里面是之前 `then` 方法塞进去的失败回调
- `then` 方法会返回一个新的 `Promise` 以便执行链式调用
- `catch` 和 `finally` 这些实例方法都必须返回一个新的 `Promise` 实例以便实现链式调用

## Promise/A+ 规范

### 术语

> 1. `promise`：是一个拥有 `then` 方法的对象或函数，其行为符合本规范
> 2. `thenable`：是一个定义了 `then` 方法的对象或函数。这个主要是用来兼容一些老的Promise实现，只要一个Promise实现是thenable，也就是拥有`then`方法的，就可以跟Promises/A+兼容。
> 3. `value`：指`reslove`出来的值，可以是任何合法的JS值(包括 `undefined` , thenable 和 promise等)
> 4. `exception`：异常，在Promise里面用`throw`抛出来的值
> 5. `reason`：拒绝原因，是`reject`里面传的参数，表示`reject`的原因

Promise总共有三个状态:

> 1. `pending`: 一个promise在resolve或者reject前就处于这个状态。
> 2. `fulfilled`: 一个promise被resolve后就处于`fulfilled`状态，这个状态不能再改变，而且必须拥有一个**不可变**的值(`value`)。
> 3. `rejected`: 一个promise被reject后就处于`rejected`状态，这个状态也不能再改变，而且必须拥有一个**不可变**的拒绝原因(`reason`)。

### then方法

一个promise必须拥有一个`then`方法来访问他的值或者拒绝原因。`then`方法有两个参数：

```javascript
promise.then(onFulfilled, onRejected)
```

#### 参数可选

`onFulfilled` 和 `onRejected` 都是可选参数。

- 如果 `onFulfilled` 不是函数，其必须被忽略
- 如果 `onRejected` 不是函数，其必须被忽略

#### `onFulfilled` 特性

如果 `onFulfilled` 是函数：

- 当 `promise` 执行结束后其必须被调用，其第一个参数为 `promise` 的终值`value`
- 在 `promise` 执行结束前其不可被调用
- 其调用次数不可超过一次

#### `onRejected` 特性

如果 `onRejected` 是函数：

- 当 `promise` 被拒绝执行后其必须被调用，其第一个参数为 `promise` 的据因`reason`
- 在 `promise` 被拒绝执行前其不可被调用
- 其调用次数不可超过一次

#### 多次调用

`then` 方法可以被同一个 `promise` 调用多次

- 当 `promise` 成功执行时，所有 `onFulfilled` 需按照其注册顺序依次回调
- 当 `promise` 被拒绝执行时，所有的 `onRejected` 需按照其注册顺序依次回调











## 实现Promise

``` javascript
/** 
 * 定义状态
 */
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/** 状态类型 */
type State = typeof PENDING | typeof FULFILLED | typeof REJECTED;

/**
 * 成功调用
 */
type Resolve = (value: unknown) => void;
/**
 * 失败调用
 */
type Reject = (reason?: any) => void;

/**
 * 回调处理
 */
type Callback =
  | ((value: unknown) => unknown | PromiseLike<void>)
  | null
  | undefined;

/**
 * 成功后回调
 */
type OnFulfilled = Callback;

/**
 * 失败后回调
 */
type OnRejected = Callback;

/**
 * 处理方法
 */ 
type Handler = {
  onFulfilled: OnFulfilled;
  onRejected: OnRejected;
  resolve: Resolve;
  reject: Reject;
};

/**
 * Promise 类
 */
class Promise {
  #state: State = PENDING;
  #handlers = Handler[];
  #data: unknown = undefined;
}

```
