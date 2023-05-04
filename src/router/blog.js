const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prisma');
const auth = require('../middleware/requireAuth');

//get all articles 
router.get('/', auth, async (req, res) => {
  const userId = parseInt(req.token.user.id);

  try {
    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      select: {
        id: true,
      },
    });

    if (!articles) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
// 获取文章列表
router.get('/all', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: true,
        tags: true,
      },
    });
    if (!articles) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
//get 5 popular articles
router.get('/pop', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      take: 5,
      orderBy: { id: 'asc' },
      select: {
        id: true,
      },
    });
    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
//id
router.get('/tags/:tagId', async (req, res) => {
  const { tagId } = req.params;

  const articles = await prisma.article.findMany({
    where: {
      tags: {
        some: {
          id: parseInt(tagId),
        },
      },
    },
    select: {
      id: true,
    },
  });

  const articleIds = articles.map(article => ({ id: article.id }));
  res.json(articleIds);
});
// 获取文章详情
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (typeof id !== 'number')
    return res.status(404).json({ message: 'Article not found' });

  !req.query.q ? req.query.q = '' : undefined;

  try {
    // 将请求参数中的需要的字段列表解析为数组
    const fields = req.query.q.split(',');
    
    const viewed=fields.includes('viewed')?true:false;
    // const viewed = ['content'].every(field => fields.includes(field));

    const select = {
      id: true,
      views: true,
      avatarUrl: fields.includes('avatarUrl'),
      title: fields.includes('title'),
      content: fields.includes('content'),
      description: fields.includes('description'),
      authorId: true,
      likes: fields.includes('likes'),
      shares: fields.includes('shares'),
      favorites: fields.includes('favorites'),
      commentsCount: fields.includes('commentsCount'),
      createdAt: fields.includes('createdAt'),
      updatedAt: fields.includes('updatedAt'),
      tags: fields.includes('tags'),
    };
    let article = await prisma.article.findUnique({
      where: {
        id
      },
      select
    })

    article = viewed ? await prisma.article.update({
      where: {
        id
      },
      select,
      data: {
        views: article.views + 1,
      },
    }) : article;

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
router.post('/', auth, async (req, res) => {
  const { title, description, content, avatarUrl, tags } = req.body;

  // 查询tagIds对应的tag对象是否存在
  const tagIds = tags.map(tag => tag.id);
  const foundTags = await prisma.tag.findMany({
    where: {
      id: { in: tagIds },
    },
  });
  const foundTagIds = foundTags.map(tag => tag.id);

  // 筛选出不存在的tagId
  const notFoundTagIds = tagIds.filter(tagId => !foundTagIds.includes(tagId));

  // 如果存在不存在的tagId，则抛出错误
  if (notFoundTagIds.length > 0) {
    return res.status(400).json({ error: `Tag(s) with id ${notFoundTagIds.join(', ')} not found` });
  }

  try {
    // 创建文章并关联标签
    const newArticle = await prisma.article.create({
      data: {
        title,
        description,
        content,
        avatarUrl,
        author: {
          connect: { id: req.token.user.id },
        },
        tags: {
          connect: tags.map(tag => ({ id: tag.id })),
        },
      },
    });

    return res.status(201).json(newArticle);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create article' });
  }
});



// 更新文章
router.put('/:id', auth, async (req, res) => {
  const { title, description, content, avatarUrl, tags } = req.body;
  const { id: articleId } = req.params;
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      include: { tags: true },
    });

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    const existingTagIds = article.tags.map(tag => tag.id);
    const disconnectTags = article.tags.filter(tag => !tags.some(t => t.id === tag.id));
    const newTags = tags.filter(tag => !existingTagIds.some(t => t === tag.id))

    await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        title,
        description,
        content,
        avatarUrl,
        tags: {
          connect: newTags.map(tag => ({ id: tag.id })),
          disconnect: disconnectTags.map(tag => ({ id: tag.id })),
        },
        published: true,
      },
    });

    res.status(201).json({id:articleId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});
// 删除文章
router.delete('/:id', auth, async (req, res) => {
  const { id: userId } = req.token.user;
  const id = parseInt(req.params.id);
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
      select: {
        authorId: true
      }
    });
    if (!article) {
      return res.status(404).send('Article not found');
    }
    if (article.authorId !== parseInt(userId)) {
      return res.status(401).send('Unauthorized');
    }
    const articleDeleted = await prisma.article.delete({
      where: {
        id: id,
      }
    });
    res.status(204).json(articleDeleted);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// 初始化创建一篇文章
router.get('/init', async (req, res) => {
  try {
    const article = await prisma.article.create({
      data: {
        title: "My first blog",
        description: "it is first blog.",
        content: "<h2>hello world!</h2>",
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
