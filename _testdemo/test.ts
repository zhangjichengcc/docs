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

// class EventEmitter {
//   events: {};

//   constructor() {
//     this.events = {};
//   }

//   on(name: string, cb: (...args) => unknown) {
//     const callbacks = this.events[name] || [];
//     callbacks.push(cb);
//     this.events[name] = callbacks;
//   }

//   emit(name: string, ...args) {
//     const callbacks = this.events[name] || [];
//     callbacks.forEach((cb) => cb(args));
//   }

//   off(name: string, cb: (...args) => unknown) {
//     const callbacks = this.events[name] || [];
//     this.events[name] = !!cb
//       ? callbacks.filter((fn) => fn !== cb && fn.initialCallback !== cb)
//       : [];
//   }

//   once(name: string, cb: (...args) => unknown) {
//     const one: any = (...args: string[]) => {
//       cb(...args);
//       this.off(name, one);
//     };
//     one.initialCallback = cb;
//     this.on(name, one);
//   }
// }

// // 观察者
// class Observer {
//   cb: () => unknown;

//   constructor(cb) {
//     this.cb = cb;
//   }

//   update() {
//     this.cb();
//   }
// }

// // 目标对象
// class Subject {
//   observers: Array<Observer>;

//   constructor() {
//     this.observers = [];
//   }

//   addObserver(observer) {
//     this.observers.push(observer);
//   }

//   notify() {
//     this.observers.forEach((observer) => observer.update());
//   }
// }

// const observer1 = new Observer(() => console.log('notify 1'));
// const observer2 = new Observer(() => console.log('notify 2'));
// const observer3 = new Observer(() => console.log('notify 3'));

// const subject = new Subject();
// subject.addObserver(observer1);
// subject.addObserver(observer2);
// subject.addObserver(observer3);

// subject.notify();

// class User {
//   username: string;
//   menuAuth: Array<string>;
//   constructor(name, menuAuth) {
//     this.username = name;
//     this.menuAuth = menuAuth;
//   }
// }

// type RoleType = 'admin' | 'user';

// class UserFactory extends User {
//   constructor(...props: [string, Array<string>]) {
//     super(...props);
//   }

//   static create(role: RoleType) {
//     const roleCollection: Map<RoleType, () => UserFactory> = new Map([
//       ['admin', () => new UserFactory('admin', ['homepage', 'userCenter'])],
//       ['user', () => new UserFactory('user', ['homepage'])],
//     ]);

//     return roleCollection.get(role)?.();
//   }
// }

// const admin = UserFactory.create('admin');
// const user = UserFactory.create('user');

type Department = '基础研发部' | '业务交付部' | '人事部';
class User {
  department: string;

  constructor(department) {
    this.department = department;
  }
}

class Development extends User {
  name: string;
  role: Array<string>;

  constructor(name: string, role: Array<string>) {
    super('基础研发部');
    this.name = name;
    this.role = role;
  }
}

class Personnel extends User {
  name: string;
  responsibility: string;

  constructor(name: string, responsibility: string) {
    super('人事部');
    this.name = name;
    this.responsibility = responsibility;
  }
}

const user1 = new Development('tom', ['开发', '架构']);
const user2 = new Personnel('sam', '招聘');
debugger;
