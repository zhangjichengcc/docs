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
> 3. `value`：指`resolve`出来的值，可以是任何合法的JS值(包括 `undefined` , thenable 和 promise等)
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

1. 参数可选

  `onFulfilled` 和 `onRejected` 都是可选参数。
    - 如果 `onFulfilled` 不是函数，其必须被忽略
    - 如果 `onRejected` 不是函数，其必须被忽略

2. `onFulfilled` 特性

  如果 `onFulfilled` 是函数：  
    - 当 `promise` 执行结束后其必须被调用，其第一个参数为 `promise` 的终值`value`  
    - 在 `promise` 执行结束前其不可被调用  
    - 其调用次数不可超过一次

3. `onRejected` 特性

  如果 `onRejected` 是函数：  
    - 当 `promise` 被拒绝执行后其必须被调用，其第一个参数为 `promise` 的据因`reason`  
    - 在 `promise` 被拒绝执行前其不可被调用  
    - 其调用次数不可超过一次  

4. `then` 可以对同一个 `Promise` 进行多次调用。
    - 当 `promise` 成功执行时，所有 `onFulfilled` 需按照其注册顺序依次回调.
    - 当 `promise` 被拒绝执行时，所有的 `onRejected` 需按照其注册顺序依次回调.

5. 返回值

  `then` 必须返回一个 `Promise`
    ``` js
    promise2 = promise1.then(onFulfilled, onRejected);
    ```
    - 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行 **Promise 解决过程**：`[[Resolve]](promise2, x)`
    - 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，则 `promise2` 必须拒绝执行，并返回拒因 `e`
    - 如果 `onFulfilled` 不是函数且 `promise1` 成功执行， `promise2` 必须成功执行并返回相同的值
    - 如果 `onRejected` 不是函数且 `promise1` 拒绝执行， `promise2` 必须拒绝执行并返回相同的据因

## 实现Promise

``` js
/** 状态类型 */
enum PromiseState {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

/**
 * 成功调用
 */
type Resolve = (value: unknown) => void;
/**
 * 失败调用
 */
type Reject = (reason?: any) => void;

/**
 * 构造函数入参
 */
type Executor = (resolve: Resolve, reject: Reject) => void;

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
  // 缓存请求
  onFulfilled: OnFulfilled;
  onRejected: OnRejected;
  resolve: Resolve;
  reject: Reject;
};

/**
 * Promise 类
 */
class MyPromise {
  /** 当前状态 */
  #state: PromiseState = PromiseState.PENDING;
  /** 暂存方法 */
  #handlers: Handler[] = [];
  /** 成功返回值 */
  #value: unknown = undefined;
  /** 失败返回值 */
  #reason: unknown = undefined;

  constructor(executor: Executor) {
    // ? 为什么不写在原型链上？ 因为this指向的问题，resolve和reject 是在外部调用，而方法需要this来获取class内部属性，若写在原型上，this会指向调用者，而无法获取内部属性
    const resolve: Resolve = (value) => {
      this.#state = PromiseState.FULFILLED;
      this.#value = value;
      // ？这里调用run，【是针对异步情况】当then在状态改变前执行
      this.#run();
    };
    const reject: Reject = (reason) => {
      this.#state = PromiseState.REJECTED;
      this.#reason = reason;
      this.#run();
    };
    try {
      // 立即执行，将 resolve 和 reject 函数传给使用者
      executor(resolve, reject);
    } catch (error) {
      // 发生异常时执行失败逻辑
      reject(error);
    }
  }

  /**
   * 工具方法，从暂存栈中取出方法执行
   * @returns
   */
  #run() {
    // 当状态为pending时，不执行
    if (this.#state === PromiseState.PENDING) return;
    // 取出暂存方法执行
    while (this.#handlers.length) {
      const handler = this.#handlers.shift();
      const { resolve, reject, onFulfilled, onRejected } = handler!;
      // 成功或失败的回调函数
      const callback = {
        [PromiseState.FULFILLED]: onFulfilled,
        [PromiseState.REJECTED]: onRejected,
      }[this.#state];
      // 返回promise的入参函数
      const settled = {
        [PromiseState.FULFILLED]: resolve,
        [PromiseState.REJECTED]: reject,
      }[this.#state];
      // 成功或失败的原因
      const data = {
        [PromiseState.FULFILLED]: this.#value,
        [PromiseState.REJECTED]: this.#reason,
      }[this.#state];
      /**
       * 这里处理 then 的返回值
      */
      // 当回调函数是函数
      if (typeof callback === 'function') {
        try {
          const res = callback(data);
          // 若回调函数返回值为 promise，则返回该promise
          if (res instanceof MyPromise || res instanceof Promise) {
            res.then(resolve, reject);
            // 否则将结果给promise
          } else {
            settled(res);
          }
        } catch (err) {
          reject(err);
        }
        // 否则直接透传
      } else {
        settled(data);
      }
    }
  }

  /**
   * @description 接受两个回调函数，onfulfilled、onrejected，对应成功和失败的回调
   * @param onfulfilled 成功回调
   * @param onrejected 失败回调
   * @returns MyPromise
   */
  then(onfulfilled?: OnFulfilled, onrejected?: OnRejected) {
    // 链式调用，每次 then 返回一个 promise
    return new MyPromise((resolve, reject) => {
      // 将成功和失败的触发&回调函数压入任务栈，待状态改变后触发
      this.#handlers.push({
        // 值穿透，当回调函数不为方法时，直接返回结果，这里在 #run 方法中进行处理了，此处注释掉
        // onFulfilled: typeof onfulfilled === 'function' ? onfulfilled : (v) => v,
        // onRejected: typeof onrejected === 'function' ? onrejected : (v) => v,
        onFulfilled: onfulfilled,
        onRejected: onrejected,
        resolve,
        reject,
      });

      // ？这里调用run，【是针对同步情况】执行then的时候，状态已经改变
      this.#run();
    });
  }

  catch(onrejected: OnRejected) {
    // catch 方法其实是 then 方法的语法糖
    return this.then(null, onrejected);
  }

  static resolve(value: unknown): MyPromise {
    if (value instanceof MyPromise) return value;
    // resolve 方法返回一个已经 resolved 的 Promise
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason?: unknown) {
    // reject 方法返回一个已经 rejected 的 Promise
    return new MyPromise((_, reject) => reject(reason));
  }

  /**
   * 当所有的promise均成功时调用resolve，否则调用reject
   * @description 这里当所有promise均完成后，再执行resolve或reject，可以使用async await进行异步处理，但如此会导致执行时间变长，因为任务是一个接着一个执行的，如下
   * @param promises
   * @returns
   */
  static asyncAll(promises: MyPromise[]) {
    promises = Array.from(promises);
    // ? 这里当所有promise均完成后，再执行resolve或reject，可以使用async await进行异步处理，但如此会导致执行时间变长，因为任务是一个接着一个执行的
    return new MyPromise(async (resolve, reject) => {
      const result: unknown[] = [];
      while (promises.length) {
        const promise = promises.shift();
        await promise?.then(
          (res) => {
            result.push(res);
          },
          (err) => {
            reject(err);
            return;
          }
        );
      }
      resolve(result);
      console.timeEnd('promise.asyncAll');
    });
  }

  /**
   * 当所有的promise均成功时调用resolve，否则调用reject
   * @description 同步方式执行，通过记录promise执行数量来判断是否所有promise均完成
   * @param promises
   * @returns
   */
  static all(promises: MyPromise[]) {
    promises = Array.from(promises);
    // ? 同步方式执行，通过记录promise执行数量来判断是否所有promise均完成
    return new MyPromise((resolve, reject) => {
      // 记录结果数组
      const result: unknown[] = [];
      // 记录当前完成数
      let completedCount = 0;
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then(
          (res) => {
            result[i] = res;
            // 若已完成数等于promise数，则所有promise状态均改变
            if (++completedCount === promises.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }

  /**
   * 当所有promises中，有一个状态发生改变则直接回调
   * @param promises
   */
  static race(promises: MyPromise[]) {
    promises = Array.from(promises);
    return new MyPromise((resolve, reject) => {
      while (promises.length) {
        const promise = promises.shift();
        promise?.then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }

  static asyncAllSelected(promises: MyPromise[]) {
    promises = Array.from(promises);
    const result: unknown[] = [];
    return new Promise(async (resolve) => {
      while (promises.length) {
        const promise = promises.shift();
        await promise?.then(
          (res) => {
            result.push({
              status: PromiseState.FULFILLED,
              value: res,
            });
          },
          (err) => {
            result.push({
              status: PromiseState.REJECTED,
              result: err,
            });
          }
        );
      }
      resolve(result);
    });
  }

  static allSelected(promises: MyPromise[]) {
    promises = Array.from(promises);
    const result: unknown[] = [];
    let completedCount = 0;
    return new Promise((resolve) => {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then(
          (res) => {
            result[i] = {
              status: PromiseState.FULFILLED,
              value: res,
            };
            if (++completedCount === promises.length) resolve(result);
          },
          (err) => {
            result[i] = {
              status: PromiseState.REJECTED,
              value: err,
            };
            if (++completedCount === promises.length) resolve(result);
          }
        );
      }
    });
  }
}
```

## 参考文献

[promises-spec](https://github.com/promises-aplus/promises-spec)  
[面试官：“你能手写一个 Promise 吗”](https://juejin.cn/post/6850037281206566919)
