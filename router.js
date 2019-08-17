// 路由模块

const express = require("express");
const router = express.Router(); //创建路由

// 引入数据模型
const { UserModel } = require("./models");

// 引入jsonwebtoken---生成token
const jwt = require("jsonwebtoken");
const SECRET = "hello world"; //密钥

// 写业务时：业务流程的梳理非常重要！！！，代码是根据业务流程来写的~

// 注册
router.post("/api/register", async (req, res) => {
  //注意async await的用法！
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
    //try...catch...是配合async...await使用的错误处理代码。。
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
  let users;
  try {
    //try里面只放可能出错的异步代码即可，其它代码不必放！
    users = await UserModel.find();
  } catch (error) {
    return res.json({
      code: -2,
      msg: "查询失败",
      err: error
    });
  }
  // 查询成功，返回数据
  res.set("Content-Type", "application/json");
  res.json({
    code: 0,
    msg: "查询成功",
    data: users
  });
});

// 删除用户(通过_id删除)
router.post("/api/del", async (req, res) => {
  let { _id } = req.body;
  if (!_id) {
    return res.json({
      code: -1,
      msg: "未提供_id"
    });
  }
  // 查_id并删除
  let user;
  try {
    user = await UserModel.findByIdAndRemove(
      { _id },
      { useFindAndModify: false }
    );
  } catch (error) {
    return res.json({
      code: -3,
      msg: `数据库错误：${error}`
    });
  }

  if (!user) {
    return res.json({
      code: -2,
      msg: "未找到用户"
    });
  }
  // 删除成功
  res.json({
    code: 0,
    msg: "用户已删除",
    user
  });
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
  let isPassOk = require("bcrypt").compareSync(pass, user.pass); //解密并比对
  if (isPassOk) {
    //   登录成功，生成token
    let token = jwt.sign({ _id: String(user._id) }, SECRET);
    res.json({
      code: 0,
      msg: "登录成功",
      user,
      token //响应数据中，带上token，以便前端收到后保存到本地localStorage或其它地方，后续访问其它页面资源时带上用以验证！！！
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
        //token不正确，通常前端收到此响应后应做其它操作：如跳转到登录页。。。
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
          data //通常，前端到收到响应后，会重新用用户数据渲染当前页面。。。
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

// 导出路由
module.exports = router;
