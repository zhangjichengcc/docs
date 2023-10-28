# grid 布局

[测试demo](https://cssgrid-generator.netlify.app/)

## 使用 min-width 解决 Flex 或 Grid 布局时容器被撑大的问题

在使用 **Flex** 或 **Grid** 布局时，经常会遇到内容溢出容器或者将容器撑大的情况

例如在 **grid布局** 中元素尺寸为 `1fr`，或者 **flex布局** 中元素 `flex-grow: 1`时，想使用 **Echarts** 画图和布局中的文本省略显示时发现并没有达到预期的效果，容器被内容撑大了

想要解决这个问题，首先需要知道容器为什么会被撑大。

我们知道块级元素默认宽度为容器的 100%，除了自动得来的宽度之外，控制宽度的属性有`width、min-width、max-width`，实际操作会发现设置 `width` 也并不能解决我们说到的问题，这就关系到CSS中宽度属性的优先级：

> `min-width` 属性为给定元素设置最小宽度。它可以阻止 `width` 属性的应用值小于 `min-width` 的值。

> `min-width` 的值会同时覆盖 `max-width` 和 `width`。

上面是MDN文档中对 `min-wdith` 的解释，可以看到设置宽度的属性当中 `min-width` 才是优先级最高的（更准确的说是`min-width` 大于 `width` 和 `max-width` 时会覆盖 `width` 和 `max-width`），也就是说我们设置 `width` 没起作用是因为 `width` 的值被 `min-width` 覆盖了。

了解这点之后，我们自然会想到那当前 `min-width` 的值是什么？继续查看文档可以看到：

> `auto` 用于弹性元素的默认最小宽度。相比其他布局中以 `0` 为默认值，`auto` 能为弹性布局指明更合理的默认表现。

在弹性元素中，`min-width` 默认为 `auto`，也就是内容所需要的宽度，所以弹性盒子自然被撑大了。

?> 所以该类问题的解决方案便是：重设 `min-width = 0`（或任何小于 `width` 的值），让 `width`v属性重新拿到元素宽度的控制权，因为 `width` 属性默认为内容区域的宽度，所以会自适应弹性盒子宽度，不会撑开容器。

高度也是同理，使用 `min-height: 0` 解决

<iframe height="600" style="width: 100%;" scrolling="no" title="test" src="https://codepen.io/zhangjichengcc/embed/KKJdYNa?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/zhangjichengcc/pen/KKJdYNa">
  test</a> by zhangjicheng (<a href="https://codepen.io/zhangjichengcc">@zhangjichengcc</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
