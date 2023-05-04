// 用户认证中间件
function requireAdmin(req, res, next) {
  const { user } = req.token.user;
  if (!user) return res.status(401).send("Unauthorized"); // 非管理员用户
  
  const { id } = user;
  if (id !== 1) {
    return res.status(401).send("Unauthorized"); // 非管理员用户
  }

  next(); // 通过认证，继续执行路由处理程序
}

module.exports = requireAdmin;
