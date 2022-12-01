/*
 * @Author: zhangjicheng
 * @Date: 2022-12-01 10:44:36
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2022-12-01 10:45:05
 * @FilePath: \docs\_testdemo\eventloop.js
 */
console.log('1');

setTimeout(function() {
  console.log('2');
  new Promise(function(resolve) {
    console.log('3');
    resolve();
  }).then(function() {
    console.log('4')
  })
  setTimeout(function() {
    console.log('5');
    new Promise(function(resolve) {
      console.log('6');
      resolve();
    }).then(function() {
      console.log('7')
    })
  })
  console.log('14');
})

new Promise(function(resolve) {
  console.log('8');
  resolve();
}).then(function() {
  console.log('9')
})

setTimeout(function() {
  console.log('10');
  new Promise(function(resolve) {
    console.log('11');
    resolve();
  }).then(function() {
    console.log('12')
  })
})
console.log('13')