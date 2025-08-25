const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, firstname, lastname });
    await user.save();

    const token = jwt.sign({ userId: user._id, firstname: user.firstname, lastname: user.lastname }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, firstname: user.firstname, lastname: user.lastname });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, firstname: user.firstname, lastname: user.lastname }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, firstname: user.firstname, lastname: user.lastname });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  } 
});

module.exports = router; 