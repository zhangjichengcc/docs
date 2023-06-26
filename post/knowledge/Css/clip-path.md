# clip-path

> **`clip-path`** [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性使用裁剪方式创建元素的可显示区域。区域内的部分显示，区域外的隐藏。

示例：

<html>
  <style>
    .main {
      width: 400px;
      height: 400px;
      background-color: rgba(255, 255, 255, .2);
      overflow: hidden;
    }
    .box {
      width: 100%;
      height: 100%;
      background: #00c8ff;
      -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
      clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
      transition: all ease .3s;
    }
    .box:hover {
      -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
  </style>
  <body>
    <h2>clip-path</h2>
    <div class="main">
      <div class="box">
      </div>
    </div>
    <script type="javascript/text">
      const dom = document.querySelector('.box');
      dom.innerText = `
        .box {
          width: 100%;
          height: 100%;
          background: #00c8ff;
          -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
          clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
          transition: all ease .3s;
        }
        .box:hover {
          -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      `
    </script>
  </body>
</html>

``` html
<html>
  <style>
    .main {
      width: 400px;
      height: 400px;
      background-color: rgba(255, 255, 255, .2);
      overflow: hidden;
    }
    .box {
      width: 100%;
      height: 100%;
      background: #00c8ff;
      -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
      clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
      transition: all ease .3s;
    }
    .box:hover {
      -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
  </style>
  <body>
    <h2>clip-path</h2>
    <div class="main">
      <div class="box">
      </div>
    </div>
    <script type="javascript/text">
      const dom = document.querySelector('.box');
      dom.innerText = `
        .box {
          width: 100%;
          height: 100%;
          background: #00c8ff;
          -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
          clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
          transition: all ease .3s;
        }
        .box:hover {
          -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      `
    </script>
  </body>
</html>
```

## 工具网站

[http://tools.jb51.net/code/css3path](http://tools.jb51.net/code/css3path)

## 参考资料

[clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
