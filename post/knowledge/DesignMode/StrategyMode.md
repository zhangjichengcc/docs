# 策略模式

> 策略（Strategy）模式的定义：该模式定义了一系列算法，并将每个算法封装起来，使它们可以相互替换，且算法的变化不会影响使用算法的客户。策略模式属于对象行为模式，它通过对算法进行封装，把使用算法的责任和算法的实现分割开来，并委派给不同的对象对这些算法进行管理。

策略模式的主要优点如下：

- 多重条件语句不易维护，而使用策略模式可以避免使用多重条件语句。
- 策略模式提供了一系列的可供重用的算法族，恰当使用继承可以把算法族的公共代码转移到父类里面，从而避免重复的代码。
- 策略模式可以提供相同行为的不同实现，客户可以根据不同时间或空间要求选择不同的。
- 策略模式提供了对开闭原则的完美支持，可以在不修改原代码的情况下，灵活增加新算法。
- 策略模式把算法的使用放到环境类中，而算法的实现移到具体策略类中，实现了二者的分离。

其主要缺点如下：

- 客户端必须理解所有策略算法的区别，以便适时选择恰当的算法类。
- 策略模式造成很多的策略类。

## 示例

表单验证

``` js
/**
 * 定义策略组
 */
const strategies = {
  isNonEmpty: function (value, errorMsg) {
    if (value === '' || value === null) return errorMsg;
  },
  isMobile: function (value, errorMsg) {
    if (!/^1[3|4|5|7|8][0-9]{9}$/.test(value)) return errorMsg;
  },
  minLength: function (value, length, errorMsg) {
    if (value.length < length) return errorMsg;
  },
};

function onSubmit(phoneNum, pwd) {



  const errorMsg =
    strategies.isNonEmpty(phoneNum, '手机号码不能为空！') ||
    strategies.isNonEmpty(pwd, '密码不能为空！') ||
    strategies.isMobile(phoneNum, '请输入正确手机号码！') ||
    strategies.minLength(pwd, 8, '密码不能小于8位');

  if (errorMsg) return errorMsg;

  //...
}
```

大量`if-else`

``` js
function demo(type, target) {
  if (type === 'weixin') {
    if (target === 'a') {
      console.log('type weixin, target a');
      return;
    }
    if (target === 'b') {
      console.log('type weixin, target b');
      return;
    }
    if (target === 'c') {
      console.log('type weixin, target c');
      return;
    }
  } else if (type === 'wxmin') {
    if (target === 'a') {
      console.log('type wxmin, target a');
      return;
    }
    if (target === 'b') {
      console.log('type wxmin, target b');
      return;
    }
    if (target === 'c') {
      console.log('type wxmin, target c');
      return;
    }
  } else if (type === 'web') {
    if (target === 'a') {
      console.log('type web, target a');
      return;
    }
    if (target === 'b') {
      console.log('type web, target b');
      return;
    }
    if (target === 'c') {
      console.log('type web, target c');
      return;
    }
  }
}

/**
 * 定义策略组
 */

type StrategiesType = 'weixin' | 'wxmin' | 'web';
type StrategiesTarget = 'a' | 'b' | 'c';

const strategies: Map<
  {
    type: StrategiesType;
    target: StrategiesTarget;
  },
  () => void
> = new Map([
  [
    {
      type: 'weixin',
      target: 'a',
    },
    () => console.log('type weixin, target a'),
  ],
  [
    {
      type: 'weixin',
      target: 'b',
    },
    () => console.log('type weixin, target b'),
  ],
  [
    {
      type: 'weixin',
      target: 'c',
    },
    () => console.log('type weixin, target c'),
  ],
  [
    {
      type: 'wxmin',
      target: 'a',
    },
    () => console.log('type wxmin, target a'),
  ],
  [
    {
      type: 'wxmin',
      target: 'b',
    },
    () => console.log('type wxmin, target c'),
  ],
  [
    {
      type: 'wxmin',
      target: 'c',
    },
    () => console.log('type wxmin, target c'),
  ],
  [
    {
      type: 'web',
      target: 'a',
    },
    () => console.log('type web, target a'),
  ],
  [
    {
      type: 'web',
      target: 'b',
    },
    () => console.log('type web, target b'),
  ],
  [
    {
      type: 'web',
      target: 'c',
    },
    () => console.log('type web, target c'),
  ],
]);

function execute(type: StrategiesType, target: StrategiesTarget) {
  const actions = [...strategies].filter(
    ([key]) => key.type === type && key.target === target
  );
  actions.forEach(([key, value]) => value.call(this));
};
```
