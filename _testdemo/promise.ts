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
      // 当回调函数不是基本数据类型
      if (callback instanceof Object) {
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
        // 值穿透，当回调函数不为方法时，直接返回结果
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

/**
 * 延迟函数
 * @param t
 * @returns
 */
function sleep(t: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}

new MyPromise((resolve) => {
  resolve(1);
})
  .then()
  .then((res) => {
    debugger;
  });

// var p1 = () =>
//   new MyPromise((resolve, reject) => {
//     sleep(4000).then((res) => {
//       reject('delay 4s p1');
//     });
//   });

// var p2 = () =>
//   new MyPromise((resolve) => {
//     sleep(4000).then((res) => {
//       resolve('delay 4s p2');
//     });
//   });

// MyPromise.allSelected([p1(), p2()]).then((res) => {
//   debugger;
// });

// p1()
//   .then()
//   .catch((res) => {
//     debugger;
//   });

// MyPromise.all([p1(), p2()])
//   .then(
//     (res) => {
//       debugger;
//     },
//     (err) => {
//       debugger;
//     }
//   )
//   .catch((err) => {
//     debugger;
//   });

// p.then((res) => {
//   console.log(res);
// });

// p.then((res) => {
//   return new MyPromise((resolve) => resolve(res));
// })
//   .then(async (res) => {
//     return new MyPromise(async (resolve) => {
//       await sleep(3000);
//       resolve(`delay 3s ${res}`);
//     });
//   })
//   .then((res) => {
//     console.log(res);
//   });
