# JavaScript 继承

## 1. 原型链继承

``` js
function Parent () {
  this.name = 'kevin';
}

Parent.prototype.getName = function () {
  console.log(this.name);
}

function Child () {}

// 子类原型指向父类实例
Child.prototype = new Parent();

var child1 = new Child();

console.log(child1.getName()) // kevin
```

问题：

1.引用类型的属性被所有实例共享，举个例子：

``` js
function Parent () {
  this.names = ['kevin', 'daisy'];
}

function Child () {}

Child.prototype = new Parent();

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy", "yayu"]
```

2.在创建 `Child` 的实例时，不能向 `Parent` 传参.

---

## 2.借用构造函数(经典继承)

使用父类的构造函数来增强子类实例，等同于复制父类的实例给子类（不使用原型）

``` js
function Parent () {
  this.names = ['kevin', 'daisy'];
}

function Child () {
  // 创建子类实例时调用 Parent 构造函数，于是 Child 的每个实例都会将 Parent 中的属性复制一份。
  Parent.call(this);
}

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy"]
```

优点：

1.避免了引用类型的属性被所有实例共享

2.可以在 Child 中向 Parent 传参

举个例子：

``` js
function Parent (name) {
  this.name = name;
}

function Child (name) {
  Parent.call(this, name);
}

var child1 = new Child('kevin');

console.log(child1.name); // kevin

var child2 = new Child('daisy');

console.log(child2.name); // daisy
```

缺点：

- 方法都在构造函数中定义，每次创建实例都会创建一遍方法。
- 只能继承父类的实例属性和方法，不能继承原型属性/方法 (因为是直接调用，并绑定this，并不是new，所以不会继承原型方法属性)

``` js
function Parent (name) {
  this.name = name;
}

Parent.prototype.fn = function(){
  console.log(this.name);
}

function Child (name) {
  Parent.call(this, name);
}

var child = new Child('tom');

child.name // tom
child.fn // undefined
```

---

## 3.组合继承

原型链继承和经典继承双剑合璧。

``` js
function Parent () {
  this.name = kevin;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child (age) {
  // 继承属性, 此时实例属性优先于原型链上的实例属性，引用类型属性不会被共享
  // 第二次调用 Parent
  Parent.call(this);
    
  this.age = age;

}

// 继承原型和实例，此时实例中引用数据类型会被共享
// 第一次调用 Parent
Child.prototype = new Parent();
// 重写constructor, 指回子类自己
Child.prototype.constructor = Child;

var child1 = new Child('18');

child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('20');

console.log(child2.name); // kevin
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。

缺点：

- 并未解决借用构造函数继承，每次创建实例都会创建一遍方法的问题
  
- 两次调用父类（`Child.prototype = new Parent(); Parent.call(this)`）会导致子类实例会存在两份相同的属性/方法

![image-20221116190209056](../assets/img/interview-javascript-继承.png)

<!-- todo -->
https://github.com/mqyqingfeng/Blog/issues/16
https://juejin.cn/post/6844903696111763470