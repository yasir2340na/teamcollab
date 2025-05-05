// routes/auth.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';

// @route   POST /api/auth/signup
// @desc    Register new user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'All fields required' });
  }
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already in use' });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'All fields required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
