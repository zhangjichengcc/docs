# Array

## 过滤掉数组中的 falsy 值

``` js
var arr = [1, 2, 3, NaN, null, false, undefined, ''];
arr.filter(Boolean); // [1, 2, 3, NaN]
```

## 过滤数组空值

``` js
var arr = new Array(5).fill('a', 1); // [empty, 'a', 'a', 'a', 'a']
arr.flat(); // ['a', 'a', 'a', 'a']
arr.filter(Boolean); // ['a', 'a', 'a', 'a']
```

## `splice` 删除，插入，替换 数组指定项

delete

``` js
var arr = [0, 1, 2, 3, 4];
arr.splice(1, 2); // 从下标1开始，删除两位
arr // [0, 3, 4]
```

insert

``` js
var arr = [0, 1, 2, 3, 4];
arr.splice(1, 0, 'a'); // 下标1开始，删除0位，替换为 ‘a'
arr // [0, 1, 'a', 2, 3, 4]
```

replace

``` js
var arr = [0, 1, 2, 3, 4];
arr.splice(1, 2, 'a', 'b'); // 下标1开始，删除2位，替换为 ‘a', 'b'
arr // [0, 'a', 'b', 3, 4]
```

## 解构 `...` 应用

- 条件添加数组项

``` js
var isAdmin = false;
var authority = [
  'read',
  'insert',
  ... isAdmin
  ? ['update', 'delete']
  : [],
]
```

- 条件添加对象

``` js
var isAdmin = false;
var user = {
  id: '978',
  name: 'tom',
  age: 18,
  ... isAdmin && {
    authority: 'read, insert, delete, update'
  }
}
```
