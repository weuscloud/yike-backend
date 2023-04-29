const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prisma');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// 用户登录
router.post('/', async (req, res) => {
  const { username:phoneorEmail, password } = req.body;
  try {
    // Check if the user with provided email/phone exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phoneorEmail },
          { email: phoneorEmail },
        ],
      },
    });

    // If user does not exist, return 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided password is correct
    if (user.passwordHash !== password) {
      return res.status(401).json({ message: 'Incorrect password or account' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user: {
          name: user.name,
          avatarUrl: user.avatarUrl,
          id: user.id
        },
        ip:"",
        unixTimestamp: Math.floor(Date.now() / 1000)
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

module.exports = router;
