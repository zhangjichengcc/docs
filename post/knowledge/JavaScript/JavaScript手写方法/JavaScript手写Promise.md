# Javascript 手写Promise

## 实现Promsie

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
