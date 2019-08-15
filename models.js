// 数据模型模块
const mongoose = require("mongoose");
// 连接数据库
db_str = "mongodb://localhost:27017/user-auth"; //连接字符串
mongoose.connect(db_str, { useNewUrlParser: true }, err => {
  if (err) {
    return console.log("数据库连接失败！" + err);
  }
  console.log(`数据库连接成功！`);
});

// 创建schema--设计表结构
let UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, //注意:设计表结构时，要考虑每个字段的设计参数项可以有哪些？比如类型、是否必须、索引唯一、默认值、setter、getter、等
  pass: {
    type: String,
    required: true,
    set(v) {
      //定义setter，即此字段值在存入数据库前，要进行的处理
      return require("bcrypt").hashSync(v, 10); //bcrypt的详细用法查npm官网；10是加密强度；这里用的同步方法，推荐异步！
    }
  }
});

// 创建数据模型
let UserModel = mongoose.model("MyUsers", UserSchema);    //MyUsers是生成的表名（集合名）；如果此处名称是英文单数，生成时会变成复数！

// 导出模型
module.exports = { UserModel };   //导出对象 ，便于导出多个数据模型
