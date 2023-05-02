require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(express.json())// 解析x-www-form-urlencoded格式的请求体
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// 中间件函数，记录请求地址并输出到控制台
const logRequests = (req, res, next) => {
  console.log(`Received a ${req.method} request for ${req.url}`);
  next();
};

// 将中间件函数应用到所有请求
app.use(logRequests);
app.use("/register", require("./router/register.js"));
app.use("/login", require("./router/login.js"));
app.use("/users", require("./router/user.js"));
app.use("/tags", require("./router/tag.js"));
app.use("/bogs", require("./router/blog.js"));
// 启动服务器
app.listen(3000, () => {
  console.log("服务器已启动");
});
