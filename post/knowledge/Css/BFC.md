# BFC（块级格式化上下文）

## 1. BFC是什么？

``` bash
Block formatting context = block-level box + Formatting Context
```

?> `BFC(Block formatting context)` 直译为"块级格式化上下文"。它是一个独立的渲染区域，只有 `Block-level box` 参与， 它规定了内部的`Block-level Box` 如何布局，并且与这个区域外部毫不相干。

**Box: Box即盒子模型；**

*`block-level box` 即块级元素*

> `display` 属性为 `block, list-item, table` 的元素，会生成`block-level box`；并且参与 `block formatting context`；

*`inline-level box` 即行内元素*

> `display` 属性为 `inline, inline-block, inline-table` 的元素，会生成 `inline-level box`。并且参与 `inline formatting context`；

**Formatting context**

`Formatting context` 是W3C CSS2.1规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系、相互作用。最常见的 `Formatting context` 有 `Block formatting context` (简称BFC) 和 `Inline formatting context`(简称IFC)。

CSS2.1 中只有 **BFC**  和**IFC**, CSS3 中还增加了 **G(grid)FC** 和 **F(flex)FC**。

---

## 2. BFC的生成

上文提到 **BFC** 是一块渲染区域，那这块渲染区域到底在哪，它又是有多大，这些由生成 **BFC** 的元素决定，CSS2.1中规定**满足下列CSS声明之一**的元素便会生成 **BFC** 。

- 根元素
- `float` 的值不为 `none`.
- `overflow` 的值不为 `visible`.
- `display` 的值为 `inline-block`、`table-cell`、`table-caption`, `display：table` 也认为可以生成**BFC**，其实这里的主要原因在于 `Table` 会默认生成一个匿名的 `table-cell`，正是这个匿名的 `table-cell`生成了 **BFC**.
- `position` 的值为 `absolute` 或 `fixed`.

## 3. BFC的约束规则

- 内部的 `Box` 会在垂直方向上一个接一个的放置
- 垂直方向上的距离由 `margin` 决定。（完整的说法是：属于同一个BFC的两个相邻Box的margin会发生重叠（塌陷），与方向无关。）
- 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明**BFC**中子元素不会超出他的包含块，而**position** 为 `absolute` 的元素可以超出他的包含块边界）
- **BFC** 的区域不会与 `float` 的元素区域重叠
计算 **BFC** 的高度时，浮动子元素也参与计算
- **BFC** 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然.

## BFC在布局中的应用

### 4.1 防止margin重叠（塌陷）

两个相邻`Box`垂直方向`margin`重叠.

``` html
<style>
  p {
    color: #f55;
    background: #fcc;
    width: 200px;
    margin: 100px;
  }
</style>
<body>
  <p>Box1</p>
  <p>Box2</p>
</body>
```

我们可以在 `p` 外面包裹一层容器，并触发该容器生成一个新 BFC。那么两个 `P` 便不属于同一个 BFC，就不会发生 `margin` 重叠了。

``` html
<style>
  p {
    color: #f55;
    background: #fcc;
    width: 200px;
    margin: 100px;
  }

+ div {
+   overflow: hidden;
+ }

</style>

<body>

+ <div>
   <p>Box1</p>
+ </div>
  <p>Box2</p>
</body>
```

相邻Box水平方向margin重叠

``` html
<!doctype HTML>
<html>
<head>
<style type="text/css">

  div {
    margin: 10px;
    width: 100px;
    height: 100px;
+   display: inline-block;
  }

  #green {
    background: lightgreen;
  }
  #blue {
    background: lightblue;
  }
  #red {
    background: pink;
  }
  body {
    writing-mode: tb-rl;
  }

</style>
</head>
<body>

<div id="green"></div>
<div id="blue"></div>
<div id="red"></div>

</body>
</html>
```

https://github.com/zuopf769/notebook/blob/master/fe/BFC%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90/README.md