# 原型模式

> 原型模式是创建型模式的一种，其特点在于通过“复制”一个已经存在的实例来返回新的实例,而不是新建实例。被复制的实例就是我们所称的“原型”，这个原型是可定制的。

原型模式多用于创建复杂的或者耗时的实例，因为这种情况下，复制一个已经存在的实例使程序运行更高效；或者创建值相等，只是命名不一样的同类数据。

对于前端来说，原型模式在常见不过了。当新创建的对象和已有对象存在较大共性时，可以通过对象的复制来达到创建新的对象，这就是原型模式。

## 示例

`Object.create()` 实现原型模式

``` js
const user = {
  name: 'tom',
  age: 18,
}

let user2 = Object.create(user);

user2.__proto__; // {name: 'tom', age: 18}
```

类的继承，原型链方式

``` js
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class Admin extends User {
  constructor(name: string) {
    super(name);
  }

  setName(name: string) {
    this.name = name;
  }
}

const admin = new Admin('admin');

admin.name // 'admin'
admin.__proto__ // User {constructor: ƒ, setName: ƒ}
admin.__proto__.proto__ // {constructor: ƒ, getName: ƒ}
```
