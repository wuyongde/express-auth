// 入口js
const express = require("express");
const app = express();

// 配置body-parser以解析post请求体；默认express只能解析get查询参数；post请求中传参的几种方式（如json、text、raw、表单。。。）
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// express中 中间件的概念很重要！！非常有用，理解！

// 解决跨域
const cors = require("cors");
app.use(cors());

// 引入路由
let router = require("./router");
app.use(router);

// 启动应用并监听端口
app.listen(3000, () => {
  console.log("http://localhost:3000/");
});
