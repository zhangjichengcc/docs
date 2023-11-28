# 函数重载

## JQuery 实现方式

``` js
export default function addMethod(obj, name, fn) {
  const old = obj[name];
  obj[name] = function (...args) {
    if (args.length === fn.length) {
      return fn.apply(this, args);
    } else if (typeof old === 'function') {
      return old.apply(this, args);
    }
  }
}
```

``` js
const searcher = {};

addMethod(searcher, 'getUsers', () => {
  console.log('all user');
})

addMethod(searcher, 'getUsers', (name) => {
  console.log(`get user's name: ${name}`);
})

addMethod(searcher, 'getUsers', (name, age) => {
  console.log(`get user's name: ${name}, user's age: ${age}`);
})

searcher.getUsers();
searcher.getUsers('张');
searcher.getUsers('张', 12);
```

?> JQuery 的实现方式有三个明显的缺陷

- 需要提供一个对象，用来挂载方法
- 由于 es6 提供的参数默认值，当我们重载的方法提供了默认值，则 `fn.length` 无法正确获取参数数量（会排出默认值及其后面的参数）
- 只支持参数长度的重载，当参数类型不同则无效

## 手动实现

``` js
// 实现
function createOverload() {
  const fnMap = new Map();

  function overload(...args) {
    const key = args.map((i) => typeof i).join(",");
    const fn = fnMap.get(key);
    if (!fn) {
      throw TypeError("无匹配方法");
    }
    return fn.call(this, ...args);
  }

  overload.addImpl = function (...args) {
    const fn = args.pop();
    if (typeof fn !== "function") {
      throw TypeError("最后一项必须为函数！");
    }
    const key = args.join(",");
    fnMap.set(key, fn);
  };
  return overload;
}

// 使用

const getUsers = createOverload();

getUsers.addImpl(() => {
  console.log('all user');
})
getUSers.addImp('string', (name) => {
  console.log(`get user's name: ${name}`);
})
getUSers.addImp('string', 'number', (name, age) => {
  console.log(`get user's name: ${name}, user's age: ${age}`);
})

```
