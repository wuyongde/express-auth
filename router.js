const express = require("express");
const router = express.Router();

// 引入数据模型
const { UserModel } = require("./models");

// 引入jsonwebtoken
const jwt = require("jsonwebtoken");
const SECRET = "hello world"; //密钥

// 注册
router.post("/api/register", async (req, res) => {
  let { name, pass } = req.body;
  // 判断是否name和pass都传了
  if (!name || !pass) {
    return res.json({
      code: -1,
      msg: "用户名与密码必须都有"
    });
  }
  // 此处，说明name与pass都上传了,保存数据
  try {
    const user = await UserModel.create({
      name,
      pass
    });
    res.json({
      code: 0,
      msg: "注册成功",
      data: user
    });
  } catch (error) {
    res.json({
      code: -2,
      msg: "注册失败",
      err: error
    });
  }
});

// 查询所有用户
router.get("/api/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json({
      code: 0,
      msg: "查询成功",
      data: users
    });
  } catch (error) {
    res.json({
      code: -2,
      msg: "查询失败",
      err: error
    });
  }
});

// 登录
router.post("/api/login", async (req, res) => {
  let { name, pass } = req.body;
  // 判断是否name和pass都传了
  if (!name || !pass) {
    return res.json({
      code: -1,
      msg: "用户名与密码必须都有"
    });
  }
  //   判断用户名是否存在
  const user = await UserModel.findOne({ name });
  if (!user) {
    //用户名不存在
    return res.json({
      code: -2,
      msg: "用户名不存在"
    });
  }
  //   判断密码是否正确
  let isPassOk = require("bcrypt").compareSync(pass, user.pass);
  if (isPassOk) {
    //   登录成功，生成token
    let token = jwt.sign({ _id: String(user._id) }, SECRET);
    res.json({
      code: 0,
      msg: "登录成功",
      user,
      token
    });
  } else {
    res.json({
      code: -3,
      msg: "密码错误"
    });
  }
});

// 查看用户配置
router.get("/api/profile", (req, res) => {
  let { token } = req.query;
  // 解码
  jwt.verify(token, SECRET, (err, data) => {
    if (err) {
     return res.json({
        code: -1,
        msg: "token不正确，请重新登录"
      });
    }
    // 解码正确
    let _id = data._id;
    // 响应
    UserModel.findOne({ _id })
      .then(data => {
        res.json({
          code: 0,
          msg: "找到用户，你已登录",
          data
        });
      })
      .catch(err => {
        res.json({
          code: -2,
          msg: "用户未找到" + err
        });
      });
  });
});

module.exports = router;
