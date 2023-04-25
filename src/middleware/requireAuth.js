const jwt = require("jsonwebtoken");

// 拦截未登录请求的中间件
function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // 未提供 token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // token 不合法或已过期
    }

    req.user = user;
    next(); // 通过认证，继续执行路由处理程序
  });
}

module.exports = requireAuth;
