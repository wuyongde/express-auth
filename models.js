// 数据模型模块
const mongoose = require("mongoose");
// 连接数据库
db_str = "mongodb://localhost:27017/user-auth";
mongoose.connect(db_str, { useNewUrlParser: true });

// 创建schema
let UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  pass: {
    type: String,
    required: true,
    set(v) {
      return require("bcrypt").hashSync(v, 10);
    }
  }
});

// 创建数据模型
let UserModel = mongoose.model("MyUsers", UserSchema);

// 导出模型
module.exports = { UserModel };
