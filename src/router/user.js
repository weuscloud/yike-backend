const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prisma');

// 用户列表
router.get('/all', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
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
        id: user.id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// 更新用户
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, avatarUrl,email,phone,passwordHash } = req.body;
  if (!name && !avatarUrl && !email && !phone && !passwordHash) {
    return res.status(400).json({ message: 'Incomplete data' });
  }
  
  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        avatarUrl: avatarUrl,
        email: email,
        phone: phone,
        passwordHash: passwordHash
      },
    });
    res.status(200).json({ id:user.id,name, avatarUrl,email,phone,passwordHash });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


// 删除用户
router.delete('/:id', async (req, res) => {
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
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
router.get('/init',async(req,res)=>{
  const newUser = await prisma.user.create({
    data: {
      "name": "Administrator",
      "email": "weuscloud@gmail.com",
      "phone": null,
      "avatarUrl": "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
      "passwordHash": "e113b32bd1b133dd1c87011e8875821bfc9955924102bd15188e10f5169d0ca0",
    },
  });
})
module.exports = router;
