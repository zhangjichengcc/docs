# typeScript 映射类型应用

## 应用场景

你用过 `Partial、Required、Pick` 和 `Readonly` 这些工具类型吗？

``` js
type Partial<T> = {
  [K in keyof T]?: T[K];
}

type Required<T> = {
  [k in keyof T]-?: T[K];
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}

type Readonly<T> = {
  readonly [K in keyof T]: T[K];
}

type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

## 应用

为对象类型生成对应的 Getter 类型

``` js
type Person = {
  name: string;
  age: number;
  location: string;
}

// type GetPerson = {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
}

type GetPerson = Getters<Person>;
```

此外，在对键进行重新映射的过程中，我们可以通过返回 never 类型对键进行过滤：

``` js
/** 判断两个类型是否相同 */
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;

type Obj = {
  a: number;
  b: string;
  c: Array<string>;
};

// 实现 Exclude
type MyExclude<T, U> = T extends U ? never : T;

type ExcludeRes = Equal<Exclude<keyof Obj, 'a'>, MyExclude<keyof Obj, 'a'>>; // true

// 实现 Omit

// 使用 Exclude
type MyOmit1<T, U> = {
  [K in Exclude<keyof T, U>]: T[K];
};

type MyOmit1Res = Equal<Omit<Obj, 'a'>, MyOmit1<Obj, 'a'>>; // true

// 不使用 Exclude
type MyOmit2<T, U> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};

type MyOmit2Res = Equal<Omit<Obj, 'a'>, MyOmit2<Obj, 'a'>>; // true
```
