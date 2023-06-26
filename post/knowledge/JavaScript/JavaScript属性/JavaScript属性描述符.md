# JavaScript 属性描述符

## 前言

有如下一个商品类的示例，我们将一步一步的完善

``` javascript
var goods = {
  pic: '',
  title: '',
  desc: '',
  sellNumber: 0,
  favorRate: 0,
  price: 0,
}

class UIGoods {
  constructor(g) {
    this.data = g;
  }
}

var goods = new UIGoods(goods);
goods = 666;

// 失去了健壮性
goods
>> 666
```

## Object.getOwnPropertyDescriptor() 获取属性描述符

``` js
var desc = Object.getOwnPropertyDescriptor(goods, 'title');
desc
>> {value: '', writable: true, enumerable: true, configurable: true}
```

## Object.defineProperty() 设置属性描述符

``` js
Object.defineProperty(goods, 'title', {
  value: '', // 属性值
  writable: true | false, // 是否可重写
  enumerable: true | false, // 是否可遍历
  configurable: true | false, // 描述符能否修改
})

Object.defineProperty(goods, 'title', {
  value: 'a', // 属性值
  writable: false, // 是否可重写
  enumerable: false, // 是否可遍历
  configurable: false, // 描述符能否修改
})

goods.title
>> a

goods.title = 'b';
goods.title;
>> a

Object.keys(goods)
>> (5) ['pic', 'desc', 'sellNumber', 'favorRate', 'price']

for(let key in goods) {
  console.log(key);
}
>> pic
>> desc
>> sellNumber
>> favorRate
>> price

// 重写描述符
Object.defineProperty(goods, 'title', {
  value: 'a', 
  writable: true, 
})

>> Uncaught TypeError: Cannot redefine property: title // 无法重新定义
```

回到上面的问题，我们可以通过属性描述符来阻止对类的修改

``` js
class UIGoods {
  constructor(g) {
    // this.data = g;
    Object.defineProperty(this, 'data', {
      value: g,
      writbale: false,
      configurable: false,
    })
  }
}

var good = new UIGoods(goods);
good = 666;

good;
>> {
  title: ...
  ...
}
```

上述方法有一个优化点，当给 good 赋值的时候，感觉上是成功了，但实际并没有生效，所以此处最好有报错提示

## 访问器 `get() set()`

``` js
Object.defineProperty(obj, key, {
  // 访问器
  get: function() {}, // 读取器
  set: function() {}, // 设置器
})
```

!> ⚠️注意，使用时小心不要出现死循环的问题

!> 注意，访问器不能和上面的属性描述符同时出现！

```js
var obj = {
  a: 1,
}

Object.defineProperty(obj, 'a', {
    get: function() {
    return obj.a;
 },
  set: function(value) {
    obj.a = value;
  }
})

// 上面这段代码会报错，无限递归

// 其相当于

Object.defineProperty(obj, 'a', {
  get: function() {
    // return obj.a;
    return get();
 },
  set: function(value) {
    // obj.a = value;
    set();
  }
})

// 解决方案

var temp = undefined;
Object.defineProperty(obj, 'a', {
    get: function() {
    return temp;
 },
  set: function(value) {
    temp = value;
  }
})
```

回到上面的方法，我们可以优化报错信息

``` js
class UIGoods {
  constructor(g) {
    // this.data = g;
    Object.defineProperty(this, 'data', {
      get: function() {
        return g;
      },
      set: function() {
        throw new Error('兄弟，该属性无法重新赋值，你再考虑考虑')
      }
    })
  }
}

var good = new UIGoods(goods);
good;
>> {...}
good = 666;
>> Error: 兄弟，该属性无法重新赋值，你再考虑考虑
```

完善方法

``` js
class UIGoods {
  
  get totalPrice() {
    return this.data.price * this.choose;
  }
  
  get isChoose() {
    return this.choose > 0;
  }
  
  constructor(g) {
    Object.defineProperty(this, 'data', {
      configurable: false,
      get: function() {
        return g;
      },
      set: function() {
        throw new Error('兄弟，该属性无法重新赋值，你再考虑考虑');
      }
    });
    var internalChooseCount = 0;
    Object.defindProperty(this, 'choose', {
      configurable: false,
      get: function() {
        return internalChooseCount;
      },
      set: function(val) {
        if (typeof val !== 'number' || val < 0 || !Number.isInteger(val)) {
          throw new Error('选择数量【choose】必须为非负整数！');
        }
        internalChooseCount = val;
      }
    })
    // Object.defindProperty(this, 'totalPrice', {
    //   configurable: false,
    //   get: function() {
    //     return this.data.price * this.count;
    //   }
    // })
  }
}


```

## 扩展

### 冻结 `Object.freeze()`

无法修改和追加

``` js
var obj = {
 a: 1,
}

Object.freeze(obj);

obj.a = 2;
obj.b = 3;

obj;
> {a: 1}
```

注意，即使属性冻结，我们依旧可以通过 definedProperty 来访问和修改，因为其本质为函数而非属性

``` js
var internal;
Object.defineProperty(obj, 'a', {
  get: function() {
    return internal;
  },
  set: function(val) {
    internal = val;
  }
})

obj.a = 6;
obj.a;
> 6
```

### 密封 `Object.seal()`

可以修改，但无法追加

``` js
var obj = {
 a: 1,
}

Object.seal(obj);

obj.a = 2;
obj.b = 3;

obj;
> {a: 2}
```

## 参考文献

[defineProperties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

[defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
