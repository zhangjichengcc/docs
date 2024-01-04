# SVG 动画

|公共属性|作用|
|-|-|
|fill|背景颜色|
|stroke|边框颜色|
|stroke-width|宽度|
|stroke-dasharray|用于创建虚线|
|viewBox|viewBox的四个参数分别代表：最小X轴数值；最小y轴数值；宽度；高度。 前两个暂时用不到，个人理解除非要对内部svg做整体位移，否则一般都是0 0，暂时先不做解释，重点关注后两个参数。|
|尺寸介绍|在svg种默认是px,可以是英寸、厘米、%....|

## SVG 描边动画

> 要实现描边动画，首先我们需要了解 SVG 中实现描边动画的三个相关属性：分别是 [stroke](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke)、[stroke-dasharray](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke-dasharray)、[stroke-dashoffset](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke-dashoffset)。这三个属性作为外观显示属性，都可以作为 CSS 属性来使用。

``` css
.content {
  font-size: 100px;
}
path {
  fill: transparent;
  stroke-dasharray: var(--stroke-length);
  stroke-dashoffset: var(--stroke-length);
  stroke-linecap: round;
  stroke-width: 10;
  stroke: #f00;
  animation: offset 2s linear infinite;
}

@keyframes offset {
  0% {
    fill: opacity;
  }
  80% {
    fill: #fff;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
    fill: #f00;
  }
}

```

``` js
const paths = [];
document.querySelectorAll('.icon').forEach(item => {
  item.querySelectorAll('path').forEach(path => paths.push(path));
})    
paths.forEach(node => {
  const len = node.getTotalLength();
  node.style.setProperty('--stroke-length', len + 1);
})
```

<iframe height="300" style="width: 100%;" scrolling="no" title="svg " src="https://codepen.io/zhangjichengcc/embed/mdodmyN?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/zhangjichengcc/pen/mdodmyN">
  svg </a> by zhangjicheng (<a href="https://codepen.io/zhangjichengcc">@zhangjichengcc</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 变形动画

> 通过 `transition` 设定动画，修改 `path`

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/zhangjichengcc/embed/jOJPKWP?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/zhangjichengcc/pen/jOJPKWP">
  Untitled</a> by zhangjicheng (<a href="https://codepen.io/zhangjichengcc">@zhangjichengcc</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## animate

> [animate](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/animate) 动画元素放在形状元素的内部，用来定义一个元素的某个属性如何踩着时点改变。在指定持续时间里，属性从开始值变成结束值。

``` html
<svg width="100%" height="100%" viewBox="0 0 100% 100%">
  <line
    stroke="#000"
    strokeWidth="2"
    x1="15"
    y1="8"
    x2="15"
    y2="22"
  >
    <animate
      attributeName="y1"
      values="8; 15; 8"
      dur="1s"
      begin="0s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="y2"
      // to="15"
      values="22; 15; 22"
      dur="1s"
      begin="0s"
      repeatCount="indefinite"
    />
  </line>
  <line
    stroke="#000"
    strokeWidth="2"
    x1="20"
    y1="8"
    x2="20"
    y2="22"
  >
    <animate
      attributeName="y1"
      values="8; 15; 8"
      dur="1s"
      begin="0.2s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="y2"
      // to="15"
      values="22; 15; 22"
      dur="1s"
      begin="0.2s"
      repeatCount="indefinite"
    />
  </line>
  <line
    stroke="#000"
    strokeWidth="2"
    x1="25"
    y1="8"
    x2="25"
    y2="22"
  >
    <animate
      attributeName="y1"
      values="8; 15; 8"
      dur="1s"
      begin="0.4s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="y2"
      // to="15"
      values="22; 15; 22"
      dur="1s"
      begin="0.4s"
      repeatCount="indefinite"
    />
  </line>
  <line
    stroke="#000"
    strokeWidth="2"
    x1="30"
    y1="8"
    x2="30"
    y2="22"
  >
    <animate
      attributeName="y1"
      values="8; 15; 8"
      dur="1s"
      begin="0.2s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="y2"
      // to="15"
      values="22; 15; 22"
      dur="1s"
      begin="0.2s"
      repeatCount="indefinite"
    />
  </line>
  <line
    stroke="#000"
    strokeWidth="2"
    x1="35"
    y1="8"
    x2="35"
    y2="22"
  >
    <animate
      attributeName="y1"
      values="8; 15; 8"
      dur="1s"
      begin="0s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="y2"
      // to="15"
      values="22; 15; 22"
      dur="1s"
      begin="0s"
      repeatCount="indefinite"
    />
  </line>
</svg>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="svg-animate" src="https://codepen.io/zhangjichengcc/embed/ExMVqdj?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/zhangjichengcc/pen/ExMVqdj">
  svg-animate</a> by zhangjicheng (<a href="https://codepen.io/zhangjichengcc">@zhangjichengcc</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 其他技巧

- 当我们希望 `svg` 能够跟随其父级改变颜色的时候，通常使用 `currentColor` 来指定颜色，如:

  ``` html
  <!-- 设定填充及描边颜色继承父级 -->
  <svg fill="currentColor" stroke="currentColor">
    <path>...</path>
  </svg>
  ```

- 当我们希望 `svg` 大小可控，则可以通过设置 `svg` 的 `width`、`height` 属性来实现

  ```html
  <svg width="100" height="200" fill="currentColor" stroke="currentColor">
    <path>...</path>
  </svg>

  <!-- 👇 -->

  <svg width="1em" height="2em" fill="currentColor" stroke="currentColor">
    <path>...</path>
  </svg>
  ```

  此时我们可以通过设置父级的 `font-size` 属性，来控制 `svg` 的大小;

  需要注意的是，通常我们希望 `path` 可以根据我们设置的宽高进行缩放，此时我们需要设置 `viewBox`, **`viewBox` 定义了一个用户坐标系统和视口之间的映射。**

  ``` html
  <svg width="1em" height="2em" viewBox="0 0 100 200" fill="currentColor" stroke="currentColor">
    <path>...</path>
  </svg>
  ```

  这里保证 `viewBox` 对应 `svg` 原始大小，而 `viewBox` 将确保路径的比例保持不变。

## 参考文献

[你要知道的svg的常用标签属性](https://juejin.cn/post/6997581167272656932)  
[GSAP svg绘制api](https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/)
