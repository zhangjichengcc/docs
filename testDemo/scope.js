/*
 * @Author: zhangjicheng
 * @Date: 2022-11-17 23:58:13
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2022-11-19 00:51:24
 * @FilePath: /docs/testDemo/scope.js
 */
// function func1() {
//   const value1 = 'value1';
//   function func2() {
//     const value2 = 'value2';
//     function func3 () {
//       const value3 = 'value3';
//       console.log(value1);
//       console.log(value2);
//       console.log(value3);
//     }
//     return func3;
//   }
//   return func2;
// }

// const fn2 = func1();
// const fn3 = fn2();
// fn3();

// (function(){
//   function doSomething(value, fn){
//     fn(value);
//   }

//   function logName(name) {
//     console.log(name);
//     console.log(doSomething)
//     debugger
//   }

//   doSomething('tom', logName);
// })()

(function(){
  let a = 1;

  function fn1() {
    console.log(a);
  }

  function fn2() {
    a = 2;
    fn1();
  }
})()
