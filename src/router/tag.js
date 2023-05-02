const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prisma');

//get top 5
router.get('/top', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      take: 5,
      orderBy: { id: 'asc' },
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
// 获取所有标签
router.get('/all', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器出错' });
  }
});
// 获取单个标签
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await prisma.tag.findUnique({ where: { id: parseInt(id) } });
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器出错' });
  }
});

// 创建新标签
router.post('/:time', async (req, res) => {
  const { tagName } = req.body;
  if (!tagName) {
    return res.status(401).json({ message: 'Incorrect tag' });
  }
  try {
    const tag = await prisma.tag.create({ data: { name:tagName } });
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器出错' });
  }
});

// 更新标签
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tagName } = req.body;
  if (!tagName) {
    return res.status(401).json({ message: 'Incorrect tag' });
  }
  try {
    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: { name: tagName },
    });
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器出错' });
  }
});
// 初始化标签
router.get('/init', async (req, res) => {
  try {
    const tags = await prisma.tag.createMany({
      data: [
        { name: 'react' },
        { name: 'antd' },
        { name: 'axios' },
        { name: 'redux' },
        { name: 'JavaScript' },
      ],
      skipDuplicates: true,
    });
    res.json({ message: '初始化成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器出错' });
  }
});
// 删除所有标签
router.delete('/all', async (req, res) => {
  try {
    await prisma.tag.deleteMany();
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器出错' });
  }
});
// 删除标签
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await prisma.tag.findUnique({ where: { id: parseInt(id) } });
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }
    await prisma.tag.delete({ where: { id: parseInt(id) } });
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器出错' });
  }
});
module.exports = router;
