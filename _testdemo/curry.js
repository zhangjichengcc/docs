/*
 * @Author: zhangjicheng
 * @Date: 2022-11-25 15:22:04
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2022-11-25 17:12:18
 * @FilePath: \docs\_testdemo\curry.js
 */
// function curry(fn, ...argArray) {
//   const that = this;
//   return function() {
//     argArray = [...argArray, ...arguments];
//     if (argArray.length === fn.length) {
//       return fn.call(that, ...argArray);
//     }
//     return curry.bind(this, fn, ...argArray);
//   }
// }

function curry(fn, ...args) {
  const _this = this;
  return function() {
    const argArray = [...args, ...arguments].slice(0);
    if (argArray.length === fn.length) {
      // ! 注意此处如果使用curry的this，则
      return fn.call(_this, ...argArray);
      return fn.call(this, ...argArray);
    }
    return curry.call(this, fn, ...argArray);
  }
}

function add(x, y, z) {
  return x+y+z;
}

const f = curry(add);



debugger
