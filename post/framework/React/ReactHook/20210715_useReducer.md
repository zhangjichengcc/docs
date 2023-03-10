# useReducer

> `useReducer` 是 `react-hooks` 提供的能够在无状态组件中运行的类似 `redux` 的功能 api 。

``` javascript
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

`useState` 的替代方案。它接收一个形如 `(state, action) => newState` 的 `reducer`，并返回当前的 `state` 以及与其配套的 `dispatch` 方法。（如果你熟悉 `Redux` 的话，就已经知道它如何工作了。）

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 `state` 逻辑较复杂且包含多个子值，或者下一个 `state` 依赖于之前的 `state` 等。并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 `dispatch` 而不是回调函数 。

计数器

``` js
const initialState = { count: 0 };

function reducer(state, action) {
  switch(action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      return {count: state.count};
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <span>{state.count}</span>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </div>
  )
}
```

注意：`React` 会确保 `dispatch` 函数的标识是稳定的，并且不会在组件重新渲染时改变。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `dispatch`。

Reducer + useContext 实现 Redux

``` javascript
/**
 * Context.js
 */

import React, { ReactDOM } from 'react';

const store = { count: 0 }

const Context = React.createContext(store);

function reducer(state, action) {
  switch(action.type) {
    case 'setCount':
      return {...state, {count: action.payload}};
    default:
      return state;
  }
}

export default Context;

export { reducer, store };
```

``` javascript
/**
 * App.jsx
 */

import React, {useReducer} from 'react';
import Context, { reducer, store } from './Context';
import Decrement from './Decrement';
import Increment from './Increment';

function App() {
  const [state, dispatch] = useReducer(reducer, store);
  const value = {state, dispatch}

  return (
    <Context.Provider value={value}>
      <Decrement />
      <Increment />
    </Context.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```

``` javascript
/**
 * Decrement
 */

import React, { useContext } from 'react';
import Context from './Context';

function Decrement() {
  const {state, dispatch} = useContext(Context);

  function handleClick() {
    dispatch({type: 'setCount', payload: state.count - 1});
  }

  return (
    <button onClick={handleClick}>-</button>
  )
}
```

``` javascript
/**
 * Increment.jsx
 */

import React, { useContext } from 'react';
import Context from './Context';

function Increment() {
  const {state, dispatch} = useContext(Context);

  function handleClick() {
    dispatch({type: 'setCount', payload: state.count + 1});
  }

  return (
    <button onClick={handleClick}>+</button>
  )
}

export default Increment;
```

`createContext, useContext` 用于存储作用域及传值， `reducer` 用于实现读写操作.

## 指定初始化

> 将初始 state 作为第二个参数传入 useReducer

``` javascript
const [state, dispatch] = useReducer(reducer, initialState)
```

> 注意  
React 不使用 state = initialState 这一由 Redux 推广开来的参数约定。有时候初始值依赖于 props，因此需要在调用 Hook 时指定。如果你特别喜欢上述的参数约定，可以通过调用 useReducer(reducer, undefined, reducer) 来模拟 Redux 的行为，但我们不鼓励你这么做。

## 惰性初始化

将 init 函数作为 useReducer 的第三个参数传入，这样初始 state 将被设置为 init(initialArg)。

这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利：

``` javascript
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

## 跳过 dispatch

如果 Reducer Hook 的返回值与当前 state 相同，React 将跳过子组件的渲染及副作用的执行。（React 使用 Object.is 比较算法 来比较 state。）

需要注意的是，React 可能仍需要在跳过渲染前再次渲染该组件。不过由于 React 不会对组件树的“深层”节点进行不必要的渲染，所以大可不必担心。如果你在渲染期间执行了高开销的计算，则可以使用 useMemo 来进行优化。
