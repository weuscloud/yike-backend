require("dotenv").config();
const express = require("express");
const app = express();
const usersRouter = require("./router/users.js");
const loginRouter = require("./router/login.js");
const registerRouter = require("./router/register.js");
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter);
// 启动服务器
app.listen(3000, () => {
  console.log("服务器已启动");
});
