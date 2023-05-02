const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prisma');
// 获取文章列表
router.get('/all', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
    });
    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// 获取文章详情
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
        tags: true,
      },
    });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// 创建文章
router.post('/:time', async (req, res) => {
  const { title, description, content, authorId, tags } = req.body;
  if (!title || !content || !authorId) {
    return res.status(400).json({ message: 'Incomplete data' });
  }
  try {
    const article = await prisma.article.create({
      data: {
        title: title,
        description: description,
        content: content,
        authorId: authorId,
      },
      include: {
        author: true,
        tags: true,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
//文章添加tag
router.put('/:articleId/tags/:tagId', async (req, res) => {
  const { articleId, tagId } = req.params;

  try {
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(tagId) },
    });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    const article = await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        tags: {
          connect: {
            id: parseInt(tagId),
          },
        },
      },
    });

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
//取消文章与tag的连接
router.delete('/:articleId/tags/:tagId', async (req, res) => {
  const { articleId, tagId } = req.params;
  
  try {
    const article = await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        tags: {
          disconnect: {
            id: parseInt(tagId),
          },
        },
      },
    });
    
    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to disconnect tag from article' });
  }
});

// 更新文章
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, content, published, tags } = req.body;
  try {
    const article = await prisma.article.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        content: content,
        published: published,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        author: true,
        tags: true,
      },
    });
    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// 删除文章
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const article = await prisma.article.delete({
      where: {
        id: id,
      },
    });
    res.status(204).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// 初始化创建一篇文章
router.get('/init', async (req, res) => {
    const { title, description, content, authorId } = req.body;
  
    try {
      const article = await prisma.article.create({
        data: {
          title: title,
          description: description,
          content: content,
          authorId: 1,
          published: true,
        },
      });
      res.status(200).json(article);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
module.exports = router;
