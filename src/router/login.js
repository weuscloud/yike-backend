const express = require("express");
const router = express.Router();
// 用户登录
router.post("/", (req, res) => {
  const { username, hash } = req.body;
  // 进行登录逻辑处理
  res.send("登录成功");
});
module.exports = router;