const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const prisma = require('../../prisma/prisma');
// 用户列表
router.get('/all', requireAdmin, (req, res) => {
  res.send('获取用户列表');
});

// 获取指定用户
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).send(`User with ID ${id} not found`);
    }
    res.status(200).json({
      user: {
        name: user.name,
        avatarUrl: user.avatarUrl,
        id: user.id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
// 更新用户
router.put('/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  res.send(`更新用户 ${id}`);
});

// 删除用户
router.delete('/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  res.send(`删除用户 ${id}`);
});



module.exports = router;
