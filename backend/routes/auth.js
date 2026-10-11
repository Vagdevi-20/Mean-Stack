const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');   // ✅ make sure filename matches (capital U)
const Expense = require('../models/Expense');  // ✅ your Expense model

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'SECRET_KEY';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader ? authHeader.split(' ') : [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'A valid bearer token is required' });
  }

  try {
    req.userId = jwt.verify(token, jwtSecret).id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, fullname, phone, email, role } = req.body;

    if (!username || !password || !fullname || !phone || !email || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      fullname,
      phone,
      email,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id.toString() }, jwtSecret, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Unable to log in right now' });
  }
});

router.get('/expenses', requireAuth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    return res.json(expenses);
  } catch (err) {
    console.error('Get expenses error:', err);
    return res.status(500).json({ message: 'Unable to load expenses' });
  }
});

router.post('/expenses', requireAuth, async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const category = typeof req.body.category === 'string' ? req.body.category.trim() : '';
    const date = req.body.date ? new Date(req.body.date) : new Date();

    if (!Number.isFinite(amount) || amount <= 0 || !category || Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Enter a valid amount, category, and date' });
    }

    const expense = await Expense.create({
      userId: req.userId,
      amount,
      category,
      date
    });
    return res.status(201).json(expense);
  } catch (err) {
    console.error('Create expense error:', err);
    return res.status(500).json({ message: 'Unable to save expense' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ message: 'Unable to load profile' });
  }
});

module.exports = router;
