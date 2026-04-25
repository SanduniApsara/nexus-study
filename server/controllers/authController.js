const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @route  POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, university, degree, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, university, degree, year });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        university: user.university,
        degree:     user.degree,
        year:       user.year,
        targetGPA:  user.targetGPA,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        university: user.university,
        degree:     user.degree,
        year:       user.year,
        targetGPA:  user.targetGPA,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @route  PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, university, degree, year, targetGPA } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, university, degree, year, targetGPA },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile };
