# react-dom

## createPortal

用于在非当前节点插入dom，例如全局弹窗等；

``` js
import {FC, useEffect, useRef} from 'react';
import { createPortal } from 'react-dom';

const PopOver: FC = () => {

  // 创建容器
  const content = useRef(document.createElement('div'))

  useEffect(() => {
    // 在 body 下插入容器
    document.body.appendChild(content.current);
    return () => {
      // 组件销毁时删除容器
      document.body.removeChild(content.current);
    }
  }, [])

  // 将目标写入容器
  return createPortal(<div>children</div>, content.current);
}

export default PopOver;
```

## React hooks 子组件 props 变化不触发组件更新

> React hooks 父组件传值变化（props）不触发子组件更新

``` js
type DataProps = {
  name: string,
  age: string,
}

const Parents: FC = () => {
  const [data, setData] = useState<DataProps>({
    name: '',
    age: '',
  });

  function onChildChange(value) {
    setData(value);
  }

  <Child data={data} onChange={onChildChange} />
}

interface ChildProps {
  onChange: <T extends DataProps>(value: T) => T;
  value: DataProps;
}

const Child: FC<ChildProps> = (props) => {
  const {
    onChange,
    value,
  } = props;

  function onHandleChange(e, key) {
    const { value: _value } = e.target;

    // 父组件onchange后，子组件不更新
-   value[key] = _value;
-   onChange(value);

    // 解构赋值，用新的变量传递
+   const newValue = {
+     ...value,
+     [key]: _value,
    }
+   onChange(newValue);

    // 深拷贝对象
+   value[key] = _value;
+   onChange(deepClone(value));
  }

  return <div>
    name: <input onChange={e => onHandleChange(e, 'name')} />
    <br />
    age: <input onChange={e => onHandleChange(e, 'age')} />
  </div>
}

```

## React.Children.map

> 为什么要使用 `React.Children.map(props.children, ()=> {})` 而不是 `props.children.map(() => {})` ?

因为不能保证 `props.children` 将是一个数组。

``` js
<Parent>
  <Children />
</Parent>

// Parent.jsx

props.children.map(...) // error props.children is Children, not a array
React.Children.map(props.children, child => { // success
  ...
})
```

`props.children` 根据children数量，并非一定是数组

`React.Children.map(props.children, item ⇒ {...})` 则一定是数组

