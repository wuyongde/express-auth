# 项目描述
这是一个基于expresss框架的简单的用户模块，这只是服务端
# 技术栈
node.js + express + mongodb

插件：

bcrypt----对存入数据库中的用户密码进行加密

jsonwebtoken---生成token
# 实现功能
- 注册
- 登录
- 查询所有用户
- 查询配置文件

# 使用方法
- 安装nodemon

 ```js
npm i -g nodemon
 ```
- 安装依赖包

进入项目根目录，安装依赖包

```
npm i 
```
- 安装mongodb并启动

项目依赖mongodb数据库，需安装默认即可，启动

安装mongodb请自行百度

- 启动服务

进入项目根目录，执行命令

```
nodemon server.js
```

- 测试接口

推荐postman，按接口代码的业务模型测试。。。

