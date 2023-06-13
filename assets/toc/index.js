/*
 * @Author: zhangjicheng
 * @Date: 2023-04-10 17:33:34
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2023-06-13 17:03:17
 * @FilePath: /docs/assets/toc/index.js
 */

const defaultOptions = {
  headings: 'h1, h2, h3,',
  scope: '.markdown-section',
  title: 'Contents',
};

/** 滚动高亮锁 控制是否允许页面滚动时高亮TOC */
let enableScrollEvent = true;

// 函数节流
function throttle(fn, ms = 300) {
  let timer = 0;
  return function () {
    if (timer) return;
    fn.call(this, ...arguments);
    timer = setTimeout(function () {
      clearTimeout(timer);
      timer = 0;
    }, ms);
  };
}

// 函数防抖
function debounce(fn, ms = 300) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, ms);
  };
}

/**
 * @description: 获取文章所有标题
 * @param {string} scope
 * @param {string} headers
 * @return {Array<dom>}
 */
function getHeaders(scope = 'article', headers = 'h1, h2, h3') {
  const _headers = document.querySelector(scope).querySelectorAll(headers);
  return [].map.call(_headers, (dom) => dom);
}

/**
 * @description: 获取标题级数
 * @param {string} headersStr
 * @return {number} level
 */
function getLevel(headersStr) {
  const decs = headersStr.match(/\d/g) || 1;
  return Math.min.apply(null, decs);
}

/**
 * @description: 构建a标签
 * @param {HTMLHeadingElement} src
 * @return {HTMLAnchorElement}
 */
function aTag(src) {
  const a = document.createElement('a'),
    { href, innerHTML, textContent } = src.firstChild;
  a.href = href;
  a.innerHTML = innerHTML;
  a.setAttribute('class', 'anchor');
  a.setAttribute('data-toc', textContent);
  a.onclick = onTocClick;
  return a;
}

/**
 * @description: 返回指定层级
 * @param {HTMLLIElement} wrapper
 * @param {number} offset
 * @return {HTMLUListElement | HTMLLIElement}
 */
function jumpBack(wrapper, offset) {
  if (offset === 0) return wrapper;
  // 每次跳出需要跳出一个 ul 或者 <ul><li><ul></ul></li></ul> 一个ul + 一个ul、li ==》 1,3,5 故 offset * 2 - 1
  offset = Math.abs(offset * 2) - 1;
  while (offset--) {
    wrapper = wrapper.parentElement;
  }
  return wrapper;
}

/**
 * @description: 下钻指定层级
 * @param {HTMLLIElement} wrapper
 * @param {number} offset
 * @return {HTMLUListElement | HTMLLIElement}
 */
function jumpIn(wrapper, offset) {
  if (offset === 0) return wrapper;
  while (offset--) {
    wrapper = wrapper.appendChild(document.createElement('ul'));
    if (offset) wrapper = wrapper.appendChild(document.createElement('li'));
  }
  return wrapper;
}

/**
 * @description: 构建列表
 * @return {*}
 */
function buildList(wrapper, offset) {
  return offset > 0 ? jumpIn(wrapper, offset) : jumpBack(wrapper, offset);
}

/**
 * @description: 构建目录
 * @param {*} options
 * @return {*}
 */
function buildTOC(options) {
  const { scope, headings } = options;
  const toc = document.createElement('ul'),
    headers = getHeaders(scope, headings);
  headers.reduce(
    function (prev, curr) {
      const currentLevel = getLevel(curr.tagName),
        offset = currentLevel - prev.level,
        li = document.createElement('li');
      li.appendChild(aTag(curr));
      prev.wrapper = buildList(prev.wrapper, offset);
      prev.wrapper.appendChild(li);
      return {
        level: currentLevel,
        wrapper: prev.wrapper,
      };
    },
    {
      level: getLevel(headings),
      wrapper: toc,
    }
  );

  return toc;
}

/** ------------------------------------------------------------------------------------ */

/**
 * @description: 设置激活目录
 * @param {string} title 标题内容 === data-toc
 * @return {*}
 */
function setActiveAnchor(title) {
  const anchors = document.querySelectorAll('.page_toc .anchor');
  [].forEach.call(anchors, function (anchor) {
    anchor.setAttribute('class', 'anchor');
  });

  document
    .querySelector(`[data-toc="${title}"]`)
    ?.setAttribute('class', 'anchor active');
}

/**
 * @description: 点击目录触发
 * @param {Event} e
 * @return {*}
 */
function onTocClick(e) {
  // 点击目录跳转时，锁住滚动的高亮监听
  enableScrollEvent = false;
  const {
    target: { textContent },
  } = e;
  setActiveAnchor(textContent);
}

/** 设置滚动结束事件 */
const scrollEnd = debounce(function () {
  // 滚动结束，解锁
  enableScrollEvent = true;
}, 400);

/** 触发目录高亮 */
function highlight() {
  // 通过函数防抖来捕获滚动结束
  scrollEnd();

  // 滚动锁
  if (!enableScrollEvent) return;

  const articleDom = document.querySelector('article'),
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

  setActiveAnchor(active_node.textContent);
}

/** ------------------------------------------------------------------------------------ */

// Docsify plugin functions
function plugin(hook, vm) {
  var userOptions = vm.config.toc;

  hook.mounted(function () {
    var content = window.Docsify.dom.find('.content');
    if (content) {
      var nav = window.Docsify.dom.create('aside', '');
      window.Docsify.dom.toggleClass(nav, 'add', 'nav');
      window.Docsify.dom.before(content, nav);
    }
  });

  hook.doneEach(function () {
    var nav = document.querySelectorAll('.nav')[0];
    var t = Array.from(document.querySelectorAll('.nav'));

    if (!nav) {
      return;
    }

    const toc = buildTOC(userOptions);

    // Just unset it for now.
    if (!toc.innerHTML) {
      nav.innerHTML = null;
      return;
    }

    // Fix me in the future
    var title = document.createElement('p');
    title.innerHTML = userOptions.title;
    title.setAttribute('class', 'title');

    var container = document.createElement('div');
    container.setAttribute('class', 'page_toc');

    container.appendChild(title);
    container.appendChild(toc);

    // Existing TOC
    var tocChild = document.querySelectorAll('.nav .page_toc');

    if (tocChild.length > 0) {
      tocChild[0].parentNode.removeChild(tocChild[0]);
    }

    nav.appendChild(container);

    const fn = throttle(highlight);
    window.addEventListener('scroll', fn);
  });
}

// Docsify plugin options
window.$docsify['toc'] = Object.assign(defaultOptions, window.$docsify['toc']);
window.$docsify.plugins = [].concat(plugin, window.$docsify.plugins);
