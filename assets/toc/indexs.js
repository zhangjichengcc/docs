/*
 * @Author: zhangjicheng
 * @Date: 2023-04-10 17:33:34
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2023-04-10 19:23:44
 * @FilePath: /docs/assets/toc/indexs.js
 */

const defaultOptions = {
  headings: 'h1, h2',
  scope: '.markdown-section',

  // To make work
  title: 'Contents',
  listType: 'ul',
};

/**
 * @description: 获取文章所有标题
 * @param {string} selector
 * @return {Array<dom>}
 */
function getHeaders(selector = 'article h1, h2, h3') {
  const headers = document.querySelectorAll(selector);
  return [].map.call(headers, (dom) => dom);
}

/**
 * @description: 获取标题级数
 * @param {*} headersStr
 * @return {*}
 */
function getLevel(headersStr) {
  const decs = headersStr.match(/\d/g) || 1;
  return Math.min.apply(null, decs);
}

/**
 * @description: 返回指定层级
 * @param {HTMLUListElement | HTMLLIElement} currentWrapper
 * @param {number} offset
 * @return {HTMLUListElement ｜ HTMLLIElement}
 */
function jumpBack(currentWrapper, offset) {
  while (offset--) {
    currentWrapper = currentWrapper.parentElement;
  }
  return currentWrapper;
}

/**
 * @description: 构建a标签
 * @param {HTMLHeadingElement} src
 * @return {HTMLAnchorElement}
 */
function aTag(src) {
  const a = document.createElement('a'),
    { href, innerHTML } = src.firstChild;
  a.href = href;
  a.innerHTML = innerHTML;
  a.setAttribute('class', 'anchor');
  return a;
}

function buildTOC() {}

/**
 * @typedef {Object} SpecialType - creates a new type named 'SpecialType'
 * @property {string} prop1 - a string property of SpecialType
 * @property {number} prop2 - a number property of SpecialType
 * @property {number|string} prop3 - an optional number property of SpecialType
 * @prop {number} [prop4] - an optional number property of SpecialType
 * @prop {number} [prop5=42] - an optional number property of SpecialType with default
 */

/** @type {SpecialType} */
var specialTypeObject;
specialTypeObject.prop3;
