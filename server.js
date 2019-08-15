const express = require("express");
const app = express();

// 配置body-parser
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// 引路由
let router=require('./router')
app.use(router)



app.listen(3000, () => {
  console.log("http://localhost:3000/");
});
