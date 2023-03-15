/*
 * @Author: zhangjicheng
 * @Date: 2023-01-31 11:44:55
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2023-01-31 15:30:10
 * @FilePath: \docs\post\knowledge\JavaScript基础\JavaScript缓存机制\demo\service.js
 */
var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {

  console.log(req.url)

  if (req.url === '/' || req.url === '' || req.url === '/index.html') {
    fs.readFile('./index.html', function (err, file) {
      console.log(req.url)
      // ! 对主文档设置缓存，无效果
      res.setHeader('Cache-Control', "no-cache, max-age=" + 5);
      res.setHeader('Content-Type', 'text/html');
      res.writeHead('200', "OK");
      res.end(file);
    });
  }

  // if (req.url === '/cache.png') {
  //   fs.readFile('./cache.png', function (err, file) {
  //     res.setHeader('Cache-Control', "max-age=" + 5); //缓存五秒
  //     res.setHeader('Content-Type', 'images/png');
  //     res.writeHead('200', "Not Modified");
  //     res.end(file);
  //   });
  // }

  if (req.url === '/cache.png') {
    fs.readFile('./cache.png', function (err, file) {
      console.log(req.headers);
      console.log(req.url)
      if (!req.headers['if-none-match']) {
        res.setHeader('Cache-Control', "max-age=" + 5);
        res.setHeader('Content-Type', 'images/png');
        res.setHeader('Etag', "ffff");
        res.writeHead('200', "Not Modified");
        res.end(file);
      } else {
        if (req.headers['if-none-match'] === 'ffff') {
          res.writeHead('304', "Not Modified");
          res.end();
        } else {
          res.setHeader('Cache-Control', "max-age=" + 5);
          res.setHeader('Content-Type', 'images/png');
          res.setHeader('Etag', "ffff");
          res.writeHead('200', "Not Modified");
          res.end(file);
        }
      }

    });
  }

}).listen(8999);