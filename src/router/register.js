const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prisma');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// 用户注册
router.post('/', async (req, res) => {
  const { phoneorEmail, password } = req.body;

  try {
    // Check if the phone number or email is already registered
    const user = await prisma.user.findUnique({
      where: {
        OR: [
          { phone_number: phoneorEmail },
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
        password_hash: password,
        email: phoneorEmail,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    // Return token to the user
    return res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
