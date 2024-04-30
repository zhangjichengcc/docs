# Intersection Observer

> `MutationObserver` 接口提供了监视对 `DOM` 树所做更改的能力。它被设计为旧的 `Mutation Events` 功能的替代品，该功能是 `DOM3 Events` 规范的一部分。

## 语法

### 构造函数

``` js
var observer = new IntersectionObserver(callback[, options]);
```

#### 参数

[`callback`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver#callback)

当元素可见比例超过指定阈值后，会调用一个回调函数，此回调函数接受两个参数：

- [`entries`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver#entries)

  一个[`IntersectionObserverEntry`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry)对象的数组，每个被触发的阈值，都或多或少与指定阈值有偏差。

- [`observer`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver#observer)

  被调用的[`IntersectionObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)实例。

[`options`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver#options) 可选

一个可以用来配置 observer 实例的对象。如果`options`未指定，observer 实例默认使用文档视口作为 root，并且没有 margin，阈值为 0%（意味着即使一像素的改变都会触发回调函数）。你可以指定以下配置：

- [`root`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver#root)监听元素的祖先元素[`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)对象，其边界盒将被视作视口。目标在根的可见区域的任何不可见部分都会被视为不可见。
- [`rootMargin`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver#rootmargin)一个在计算交叉值时添加至根的边界盒 ([bounding_box (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Bounding_box)) 中的一组偏移量，类型为字符串 (string) ，可以有效的缩小或扩大根的判定范围从而满足计算需要。语法大致和 CSS 中的[`margin`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin) 属性等同; 可以参考 [intersection root 和 root margin](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API#the_intersection_root_and_root_margin) 来深入了解 margin 的工作原理及其语法。默认值是"0px 0px 0px 0px"。
- [`threshold`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver#threshold)规定了一个监听目标与边界盒交叉区域的比例值，可以是一个具体的数值或是一组 0.0 到 1.0 之间的数组。若指定值为 0.0，则意味着监听元素即使与根有 1 像素交叉，此元素也会被视为可见。若指定值为 1.0，则意味着整个元素都在可见范围内时才算可见。可以参考[阈值](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API#thresholds)来深入了解阈值是如何使用的。阈值的默认值为 0.0。

#### 返回值

个可以使用规定阈值监听目标元素可见部分与`root`交叉状况的新的[`IntersectionObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) 实例。调用自身的[`observe()`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/observe) 方法开始使用规定的阈值监听指定目标。

### 实例属性

[`IntersectionObserver.root`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/root) 只读

[`IntersectionObserver.rootMargin`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/rootMargin) 只读

[`IntersectionObserver.thresholds` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds) 只读

### 实例方法

[`IntersectionObserver.disconnect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/disconnect)

使 `IntersectionObserver` 对象停止监听目标。

[`IntersectionObserver.observe()`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/observe)

使 `IntersectionObserver` 开始监听一个目标元素。

[`IntersectionObserver.takeRecords()`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/takeRecords)

返回所有观察目标的 [`IntersectionObserverEntry`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry) 对象数组。

[`IntersectionObserver.unobserve(target)`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/unobserve)

使 `IntersectionObserver` 停止监听特定目标元素。

## 示例

<iframe height="300" style="width: 100%;" scrolling="no" title="IntersectionObserver" src="https://codepen.io/zhangjichengcc/embed/qBwwVGK?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/zhangjichengcc/pen/qBwwVGK">
  IntersectionObserver</a> by zhangjicheng (<a href="https://codepen.io/zhangjichengcc">@zhangjichengcc</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

``` html
<div class="container">
  <ul class="img-container">
  </ul>
<div>
```

``` js
const imgContainer = document.querySelector(".img-container");
const container = document.querySelector(".container");

// 创建图片列表
function init() {
  for (let i = 0; i < 100; i++) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.setAttribute('data-src', "https://home.zhangjc.cn/api/fileServer/20230611/WechatIMG63_1686417477299.jpeg");
    li.appendChild(img);
    imgContainer.appendChild(li);
  }
}

// 注册监听器
function observe() {
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(item => {
      const { 
        isIntersecting,
        target
      } = item;
      const data_src = target.getAttribute('data-src');
      if (isIntersecting) {
        target.setAttribute('src', data_src);
        intersectionObserver.unobserve(target);
      }
      isIntersecting && target.setAttribute('src', data_src);
      console.log(isIntersecting)
    })
  }, {
    root: container,
    // rootMargin: 0,
    threshold: 0,
  })

  const imgs = imgContainer.querySelectorAll('img[data-src]');
  imgs.forEach(img => {
    intersectionObserver.observe(img);
  });
}

init();
observe();
```

``` less
.container {
  width: 210px;
  height: 400px;
  margin: 0 auto;
  border: #999 solid 1px;
  padding: 10px;
  overflow-y: auto;
  ul {
    all: unset;
    display: flex;
    flex-direction: column;
  }
  li {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
  img {
    width: 200px;
    height: 150px;
    border: #eee solid 2px;
    background-color: #eee;
  }
}
```
