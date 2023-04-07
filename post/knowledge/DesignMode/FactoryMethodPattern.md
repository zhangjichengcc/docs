# 工厂方法模式

> 工厂方法模式（英语：Factory method pattern）是一种实现了“工厂”概念的面向对象设计模式。就像其他创建型模式一样，它也是处理在不指定对象具体类型的情况下创建对象的问题。工厂方法模式的实质是“定义一个创建对象的接口，但让实现这个接口的类来决定实例化哪个类。工厂方法让类的实例化推迟到子类中进行。”

工厂模式根据抽象程度可分为三种，分别为**简单工厂、工厂方法和抽象工厂**。其核心在于将创建对象的过程封装其他，然后通过同一个接口创建新的对象。 简单工厂模式又叫静态工厂方法，用来创建某一种产品对象的实例，用来创建单一对象。

## 示例

简单工厂

``` js
class Factory {
  username: string;
  password: string;
  userRole: Array<string>;
  constructor(user, pwd, role) {
    this.username = user;
    this.password = pwd;
    this.userRole = role;
  }
}

class CreateFactory {
  static create(user: string, pwd: string, role: Array<string>) {
    return new Factory(user, pwd, role);
  }
}

const user = CreateFactory.create('tom', '12345', ['admin']);
```

在实际工作中，各用户角色所具备的能力是不同的，因此简单工厂是无法满足的，这时候就可以考虑使用工厂方法来代替。工厂方法的本意是将实际创建对象的工作推迟到子类中。

``` js
class User {
  username: string;
  menuAuth: Array<string>;
  constructor(name, menuAuth) {
    this.username = name;
    this.menuAuth = menuAuth;
  }
}

type RoleType = 'admin' | 'user';

class UserFactory extends User {
  constructor(...props: [string, Array<string>]) {
    super(...props);
  }

  static create(role: RoleType) {
    const roleCollection: Map<RoleType, () => UserFactory> = new Map([
      ['admin', () => new UserFactory('admin', ['homepage', 'userCenter'])],
      ['user', () => new UserFactory('user', ['homepage'])],
    ]);

    return roleCollection.get(role)?.();
  }
}

const admin = UserFactory.create('admin');
const user = UserFactory.create('user');
```

随着业务形态的变化，一个用户可能在多个平台上同时存在，显然工厂方法也不再满足了，这时候就要用到抽象工厂。抽象工厂模式是对类的工厂抽象用来创建产品类簇，不负责创建某一类产品的实例。

``` js
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
```
