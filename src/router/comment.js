const commentRouter = express.Router();

// 获取所有评论
commentRouter.get('/', (req, res) => {
  // 返回所有评论的信息
});

// 获取特定评论
commentRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  // 根据 id 返回特定评论的信息
});

// 创建评论
commentRouter.post('/', (req, res) => {
  const comment = req.body;
  // 在数据库中创建新的评论
});

// 更新评论信息
commentRouter.put('/:id', (req, res) => {
  const id = req.params.id;
  const comment = req.body;
  // 根据 id 更新评论信息
});

// 删除评论
commentRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  // 根据 id 删除评论
});

module.exports = commentRouter;
