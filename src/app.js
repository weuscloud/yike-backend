require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');

const packageJson = require('../package.json');
const version = packageJson.version;
app.use(function(req, res, next) {
  res.set('Server', `My Custom Server ${version}`);
  res.set('X-Powered-By', `My Custom Server ${version}`);
  next();
});

const allowedOrigins = process.env.CORS.split(',');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // 如果请求没有 Origin 头，则默认允许
      callback(null, true);
    } else if (allowedOrigins.some(domain => origin.includes(domain))) {
      // 如果请求的 Origin 头在允许的地址列表中，则允许
      callback(null, true);
    } else {
      // 否则不允许
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));


// 解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

let requestsCount = 0;

setInterval(() => {
  console.log(`\u001b[32mAverage requests per minute: ${requestsCount}\u001b[0m`)
  requestsCount = 0;
}, 60000);
// 中间件函数，记录请求地址并输出到控制台
const logRequests = (req, res, next) => {
  requestsCount++;
  console.log(`Received a ${req.method} request for ${req.url}`);
  next();
};

// 将中间件函数应用到所有请求
app.use(logRequests);
app.use("/register", require("./router/register.js"));
app.use("/login", require("./router/login.js"));
app.use("/users", require("./router/user.js"));
app.use("/tags", require("./router/tag.js"));
app.use("/blogs", require("./router/blog.js"));
app.use('/uploads', require("./router/upload.js"));
// 启动服务器
app.listen(3000, () => {
  console.log("服务器已启动");
});
