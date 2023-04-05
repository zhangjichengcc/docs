// const strategies = {
//   isNonEmpty: function (value, errorMsg) {
//     if (value === '' || value === null) return errorMsg;
//   },
//   isMobile: function (value, errorMsg) {
//     if (!/^1[3|4|5|7|8][0-9]{9}$/.test(value)) return errorMsg;
//   },
//   minLength: function (value, length, errorMsg) {
//     if (value.length < length) return errorMsg;
//   },
// };

// function onSubmit(phoneNum, pwd) {

//   const errorMsg =
//     strategies.isNonEmpty(phoneNum, '手机号码不能为空！') ||
//     strategies.isNonEmpty(pwd, '密码不能为空！') ||
//     strategies.isMobile(phoneNum, '请输入正确手机号码！') ||
//     strategies.minLength(pwd, 8, '密码不能小于8位');

//   if (errorMsg) return errorMsg;

//   //...
// }

// // onSubmit(123241, 'jsdf23');

// function demo(type, target) {
//   if (type === 'weixin') {
//     if (target === 'a') {
//       console.log('type weixin, target a');
//       return;
//     }
//     if (target === 'b') {
//       console.log('type weixin, target b');
//       return;
//     }
//     if (target === 'c') {
//       console.log('type weixin, target c');
//       return;
//     }
//   } else if (type === 'wxmin') {
//     if (target === 'a') {
//       console.log('type wxmin, target a');
//       return;
//     }
//     if (target === 'b') {
//       console.log('type wxmin, target b');
//       return;
//     }
//     if (target === 'c') {
//       console.log('type wxmin, target c');
//       return;
//     }
//   } else if (type === 'web') {
//     if (target === 'a') {
//       console.log('type web, target a');
//       return;
//     }
//     if (target === 'b') {
//       console.log('type web, target b');
//       return;
//     }
//     if (target === 'c') {
//       console.log('type web, target c');
//       return;
//     }
//   }
// }

// type StrategiesType = 'weixin' | 'wxmin' | 'web';
// type StrategiesTarget = 'a' | 'b' | 'c';

// const strategies: Map<
//   {
//     type: StrategiesType;
//     target: StrategiesTarget;
//   },
//   () => void
// > = new Map([
//   [
//     {
//       type: 'weixin',
//       target: 'a',
//     },
//     () => console.log('type weixin, target a'),
//   ],
//   [
//     {
//       type: 'weixin',
//       target: 'b',
//     },
//     () => console.log('type weixin, target b'),
//   ],
//   [
//     {
//       type: 'weixin',
//       target: 'c',
//     },
//     () => console.log('type weixin, target c'),
//   ],
//   [
//     {
//       type: 'wxmin',
//       target: 'a',
//     },
//     () => console.log('type wxmin, target a'),
//   ],
//   [
//     {
//       type: 'wxmin',
//       target: 'b',
//     },
//     () => console.log('type wxmin, target c'),
//   ],
//   [
//     {
//       type: 'wxmin',
//       target: 'c',
//     },
//     () => console.log('type wxmin, target c'),
//   ],
//   [
//     {
//       type: 'web',
//       target: 'a',
//     },
//     () => console.log('type web, target a'),
//   ],
//   [
//     {
//       type: 'web',
//       target: 'b',
//     },
//     () => console.log('type web, target b'),
//   ],
//   [
//     {
//       type: 'web',
//       target: 'c',
//     },
//     () => console.log('type web, target c'),
//   ],
// ]);

// function execute(type: StrategiesType, target: StrategiesTarget) {
//   const actions = [...strategies].filter(
//     ([key]) => key.type === type && key.target === target
//   );
//   actions.forEach(([key, value]) => value.call(this));
// };

// execute('web', 'a');

class EventEmitter {
  events: {};

  constructor() {
    this.events = {};
  }

  on(name, cb) {
    const callbacks = this.events[name] || [];
    callbacks.push(cb);
    this.events[name] = callbacks;
  }

  emit(name, ...args) {
    const callbacks = this.events[name] || [];
    callbacks.forEach((cb) => cb(args));
  }

  off(name, cb) {
    const callbacks = this.events[name] || [];
    this.events[name] = !!cb ? callbacks.filter((item) => item !== cb) : [];
  }

  once(eventName, callback) {
    const one = (...args) => {
      callback(...args);
      this.off(eventName, one);
    };
    one.initialCallback = callback;
    this.on(eventName, one);
  }
}
