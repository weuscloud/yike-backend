const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// 定义一个自定义的存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // 使用原始文件名来构造文件名，从而保留完整文件名
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
// 处理上传的图片，并返回图片的访问路径
router.post('/image', upload.single('image'), (req, res) => {
  // 获取上传的图片文件名
  let fileName = req.file.filename;
  // 获取上传的图片文件的原始扩展名
  const extension = path.extname(req.file.originalname);
  // 如果上传的图片文件没有扩展名，则使用原始扩展名作为文件扩展名
  if (!extension) {
    fileName += path.extname(req.file.mimetype);
  }

  // 构造图片的访问路径
  const imageUrl = `/api/uploads/${fileName}`;
  // 返回图片的访问路径
  res.json({ success: true, data: imageUrl });
});
router.post('/video', upload.single('video'), (req, res) => {
  // 获取上传的图片文件名
  let fileName = req.file.filename;
  // 获取上传的图片文件的原始扩展名
  const extension = path.extname(req.file.originalname);
  // 如果上传的图片文件没有扩展名，则使用原始扩展名作为文件扩展名
  if (!extension) {
    fileName += path.extname(req.file.mimetype);
  }

  // 构造图片的访问路径
  const imageUrl = `${req.protocol}://${req.hostname}:${req.protocol === 'http' ? 80 : 443}/api/uploads/${fileName}`;
  // 返回图片的访问路径
  res.json({ success: true, data: imageUrl });
});
// 处理获取上传的图片的 GET 请求
router.get('/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../public/uploads', req.params.filename);
  const readStream = fs.createReadStream(filePath);
  readStream.on('error', () => {
    res.status(404).send('File not found');
  });
  readStream.pipe(res);
});
module.exports = router;
