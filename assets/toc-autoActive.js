/*
 * @Author: zhangjicheng
 * @Date: 2023-03-28 16:06:16
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2023-03-28 18:56:59
 * @FilePath: /docs/assets/toc-autoActive.js
 */

function throttle(fn, ms = 300) {
  let timer = 0;
  return function () {
    if (timer) return;
    fn.call(arguments);
    timer = setTimeout(function () {
      clearTimeout(timer);
      timer = 0;
    }, ms);
  };
}

function highlight() {
  const articleDom = document.querySelector('article'),
    toc_anchors =
      document.querySelector('.page_toc')?.querySelectorAll('a') || [],
    article_anchors = articleDom.querySelectorAll('.anchor') || [],
    doc = document.documentElement,
    top = (doc && doc.scrollTop) || document.body.scrollTop;

  let active_node = null;

  for (let node of article_anchors) {
    if (node.offsetTop > top) {
      if (!active_node) active_node = node;
      break;
    } else {
      active_node = node;
    }
  }

  toc_anchors.forEach((node) => {
    const { innerHTML } = node.childNodes[0];
    node.classList.remove('active');
    if (innerHTML === active_node.getAttribute('data-id')) {
      node.classList.add('active');
    }
  });
}

export default function () {
  const fn = throttle(highlight);
  window.addEventListener('scroll', fn);
}
