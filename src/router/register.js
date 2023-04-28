const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prisma');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// 用户注册
router.post('/', async (req, res) => {
  const { username:phoneorEmail, password } = req.body;
  try {
    if(!/\S+@\S+\.\S+/.test(phoneorEmail)&&!/^\d{11}$/.test(phoneorEmail) ){
      return res.status(403).json({ message: 'Not email or phone' });
    }
    // Check if the phone number or email is already registered
    const user = await prisma.user.findFirst ({
      where: {
        OR: [
          { phone: phoneorEmail },
          { email: phoneorEmail },
        ],
      },
    });

    if (user) {
      return res.status(409).json({ message: 'Phone number or email is already registered' });
    }

    // Create a new user record
    const newUser = await prisma.user.create({
      data: {
        passwordHash: password,
        email: /\S+@\S+\.\S+/.test(phoneorEmail) ? phoneorEmail : null,
        phone: /^\d{11}$/.test(phoneorEmail) ? phoneorEmail : null,
        name:generateRandomString(10)
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        user: {
          name: newUser.name,
          avatarUrl: newUser.avatarUrl,
          id: newUser.id
        },
        ip:""
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    // Return token to the user
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
function generateRandomString(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += generateRandomLetter();
  }
  return result;
}
function generateRandomLetter() {
  // 生成 0 到 25 之间的随机整数
  const randomInt = Math.floor(Math.random() * 26);
  // 将 ASCII 码值转换为字母
  const randomLetter = String.fromCharCode(97 + randomInt);
  return randomLetter;
}

module.exports = router;
