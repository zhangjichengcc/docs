# JavaScript 惰性函数

> 一个函数在调用一次之后，就确定该函数的状态

示例：

``` js
function copyClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

// 改为惰性函数

function copyClipboard(text) {
  if (navigator.clipboard) {
    copyClipboard = (text) => navigator.clipboard.writeText(text);
  } else {
    copyClipboard = (text) => {
      const input = document.createElement('input');
      input.setAttribute('value', text);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
  }
  copyClipboard(text);
}

// 优化

const copyClipboard = (function copyClipboard() {
  if (navigator.clipboard) {
    return (text) => navigator.clipboard.writeText(text);
  } else {
    return (text) => {
      const input = document.createElement('input');
      input.setAttribute('value', text);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
  }
})();
```
