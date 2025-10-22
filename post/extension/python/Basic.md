# 基础

**1. Python 的代码结构**

**缩进**

​	•	Python 使用缩进表示代码块，而非花括号 {}。

​	•	缩进推荐使用 **4 个空格**。

​	•	缩进不一致会报错。

``` python
if True:
    print("Condition is True")  # 缩进 4 个空格
else:
    print("Condition is False")
```

**2. 变量与数据类型**

**2.1 变量**

​	•	无需声明变量类型，Python 是动态类型语言。

​	•	变量名区分大小写，推荐使用小写字母和下划线。

``` python
x = 10          # 整数
name = "Alice"  # 字符串
is_valid = True # 布尔值
```

**2.2 数据类型**

Python 常见数据类型包括：

​	•	**数字类型**：

​	•	整数 (int): x = 10

​	•	浮点数 (float): y = 3.14

​	•	复数 (complex): z = 1 + 2j

​	•	**字符串 (**str**)**：

​	•	单引号或双引号：s = 'hello' 或 s = "hello"

​	•	**布尔值 (**bool**)**：

​	•	True, False。

​	•	**空值 (**NoneType**)**：

​	•	None 表示空值：x = None

``` python
a = 10          # 整数
b = 3.14        # 浮点数
c = "Hello"     # 字符串
d = True        # 布尔值
e = None        # 空值
```

**3. 输入与输出**

**3.1 输出**

​	•	使用 print() 函数输出内容：

``` python
name = "Alice"
age = 25
print("Name:", name)
print(f"Name: {name}, Age: {age}")  # 格式化字符串
```

**3.2 输入**

​	•	使用 input() 函数接收用户输入：

``` python
name = input("Enter your name: ")
print(f"Hello, {name}")
```

**4. 运算符**

**4.1 算术运算符**

​	•	加减乘除：+, -, *, /。

​	•	幂运算：**。

​	•	取整除：//。

​	•	取余：%。

``` python
x = 10
y = 3
print(x + y)  # 13
print(x ** y) # 1000
```

**4.2 比较运算符**

​	•	等于：==

​	•	不等于：!=

​	•	大于/小于：>，<

​	•	大于等于/小于等于：>=，<=

``` python
print(10 > 5)  # True
```

**4.3 逻辑运算符**

​	•	与：and

​	•	或：or

​	•	非：not

``` python
x = True
y = False
print(x and y)  # False
print(x or y)   # True
```

**5. 控制语句**

**5.1 条件语句**

​	•	使用 if-elif-else 表达逻辑分支。

``` python
x = 10
if x > 0:
    print("Positive")
elif x == 0:
    print("Zero")
else:
    print("Negative")
```

**5.2 循环语句**

**(1) for 循环**

​	•	用于遍历序列或迭代器。

``` python
for i in range(5):  # range(5) 生成 [0, 1, 2, 3, 4]
    print(i)
```

**(2) while 循环**

​	•	根据条件循环执行。

``` python
x = 0
while x < 5:
    print(x)
    x += 1
```

**6. 数据结构**

**6.1 列表 (list)**

​	•	有序，可变。

``` python	
numbers = [1, 2, 3]
numbers.append(4)       # 添加元素
numbers.remove(2)       # 删除元素
print(numbers)          # [1, 3, 4]
```

**6.2 元组 (tuple)**

​	•	有序，不可变。

``` py	
coordinates = (1, 2)
```

**6.3 字典 (dict)**

​	•	键值对存储。

``` python
person = {"name": "Alice", "age": 25}
print(person["name"])   # Alice
```

**6.4 集合 (set)**

​	•	无序，元素唯一。

``` python
unique_numbers = {1, 2, 3, 3}
print(unique_numbers)   # {1, 2, 3}
```

**7. 函数**

**7.1 定义函数**

​	•	使用 def 关键字。

``` python
def add(a, b):
    return a + b

print(add(3, 5))  # 8
```

**7.2 函数参数**

​	•	默认参数、可变参数。

``` python
def greet(name="Guest"):
    print(f"Hello, {name}")

greet()             # Hello, Guest
greet("Alice")      # Hello, Alice
```

**8. 异常处理**

​	•	使用 try-except 处理错误。

``` python
try:
    x = 1 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
```

