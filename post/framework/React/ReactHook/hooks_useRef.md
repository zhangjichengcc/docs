<!--
 * @Author: zhangjicheng
 * @Date: 2021-05-21 16:00:21
 * @LastEditTime: 2021-07-01 19:53:56
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \my-note\src\4_框架\React\hooks_useRef.md
 * 可以输入预定的版权声明、个性签名、空行等
-->

# useRef

> `useRef` 返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 `ref` 对象在组件的整个生命周期内保持不变。
> 请记住，当 `ref` 对象内容发生变化时，`useRef` 并不会通知你。变更 `.current` 属性不会引发组件重新渲染。如果想要在 `React` 绑定或解绑 `DOM` 节点的 `ref` 时运行某些代码，则需要使用回调 `ref` 来实现;

`useRef()` 比 `ref` 属性更有用。它可以很方便地保存任何可变值，其类似于在 `class` 中使用实例字段的方式。

因此，`useRef` 可以用来代替 `useState` 来存储一些不需要副作用的变量；

- useState： 值变化，组件会重新渲染；组件渲染，值不变；
- useRef： 值变化，组件不会重新渲染；组件渲染，值不变；
- 普通js对象：值变化，组件不会重新渲染；组件渲染，值丢失；

注意： 当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

## 回调Ref

> React 也支持另一种设置 refs 的方式，称为“回调 refs”。它能助你更精细地控制何时 refs 被设置和解除。

不同于传递 createRef() 创建的 ref 属性，你会传递一个函数。这个函数中接受 React 组件实例或 HTML DOM 元素作为参数，以使它们能在其他地方被存储和访问。

React 将在组件 **挂载时** ，会调用 `ref` 回调函数并传入 `DOM` 元素，当 **卸载时** 调用它并传入 `null`。

``` js
function Demo() {
  const setTextInputRef = useCallback((e) { // 此时的 useCallback 为优化使用
    e.focus();
  }, []);

  return (
    <div>
      <input type="text" ref={setTextInputRef}>
    </div>
  )
}
```

## useRef 存值

``` js
const tmp = useRef(null);

tmp.current = xxx;
```

## useRef 绑定dom

> 如果你将 ref 对象以 `<div ref={myRef} />` 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 .current 属性设置为相应的 DOM 节点。

``` jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

## useRef & useImperativeHandle 暴露实例给父级

> `useRef` 配合 `useImperativeHandle`

### useImperativeHandle

> `useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。

``` js
useImperativeHandle(ref, createHandle, [deps])
```

基础用法

``` js
// 子组件
function Children(props) {

  // 接收父组件传递的 cRef 
  const { cRef } = props;

  function getName() {
    return 'children';
  }

  // 通过 useImperativeHandle 将指定对象暴露给父组件
  useImperativeHandle(cRef, () => ({
    getName,
  }))

  return (
    <span>children<span>
  )
}
```

``` jsx
// 父组件
function Parent() {

  const cRef = useRef(null);

  function getName() {
    return cRef.current.getName();
  }

  return (
    <div>
      <button onClick={getName}>getName</button>
      { // 注意此处不能使用ref，ref不能直接传递给子组件 }
      <Children cRef={cRef} />
    </div>
  )
}
```

官方推荐
> `useImperativeHandle` 与 `forwardRef` 一起使用

### forwardRef

> forwardRef 主要用来实现ref的转发
> Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件。

上面实例我们使用cRef来进行参数传递，而非使用ref，这是因为：
**常规函数和 class 组件不接收 ref 参数，且 props 中也不存在 ref**

``` jsx
// 子组件
function Children(props, ref) {

  function getName() {
    return 'children';
  }

  // 通过 useImperativeHandle 将指定对象暴露给父组件
  useImperativeHandle(ref, () => ({
    getName,
  }))

  return (
    <span>children<span>
  )
}
// React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
Children = forwardRef(Children);
```

``` jsx
// 父组件
function Parent() {

  const cRef = useRef(null);

  function getName() {
    return cRef.current.getName();
  }

  return (
    <div>
      <button onClick={getName}>getName</button>
      { // 此时可以直接获取子元素的 ref 属性}
      <Children ref={cRef} />
    </div>
  )
}
```

以下是对上述示例发生情况的逐步解释：

- 我们通过调用 useRef 创建了一个 cRef 并将其赋值给 ref 变量。
- 我们通过指定 ref 为 JSX 属性，将其向下传递给 <Children ref={cRef}>。
- React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
- 我们向下转发该 ref 参数到 <Children ref={ref}>，将其指定为 JSX 属性。
- 当 ref 挂载完成，ref.current 将指向 <Children> DOM 节点。

> **注意**  
> 第二个参数 ref 只在使用 React.forwardRef 定义组件时存在。常规函数和 class 组件不接收 ref 参数，且 props 中也不存在 ref。
>Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 class 组件实例中。

## 参考文献

[forwarding-refs](https://zh-hans.reactjs.org/docs/forwarding-refs.html)

<https://react.docschina.org/docs/hooks-reference.html#useimperativehandle>

<https://www.cnblogs.com/guanghe/p/14178951.html>

<https://zhuanlan.zhihu.com/p/91725031>

<https://www.jianshu.com/p/cd27473d7542>
