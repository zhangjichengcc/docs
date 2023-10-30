# Flip 动画

## 什么是 flip 动画

Flip是一种动画思路，专门针对上述场景

它由四个单词组成，分别是：

First
Last
Invert
Play

用代码实现大体过程如下

``` js
// ① First
record(container); // 记录容器中每个子元素的起始坐标
// 改变元素顺序
change();
// ② Last + ③ Invert + ④ Play
move(container); // 让元素真正实现移动

```

## 简单实现

<iframe height="300" style="width: 100%;" scrolling="no" title="Flip 动画" src="https://codepen.io/zhangjichengcc/embed/PoVNbgK?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/zhangjichengcc/pen/PoVNbgK">
  Flip 动画</a> by zhangjicheng (<a href="https://codepen.io/zhangjichengcc">@zhangjichengcc</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 参考文献

[https://juejin.cn/post/7016912165789515783](https://juejin.cn/post/7016912165789515783)
