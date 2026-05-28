import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register user - only allows 'user' role by default
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Validate required fields
    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Always set role to 'user' for security - admins must be created separately
    const user = await User.create({
      username,
      email,
      password,
      name,
      role: 'user' // Fixed role for registration
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create user with specific role
router.post('/admin/create-user', protect, admin, async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      name,
      role
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Admin: Update user role
router.put('/admin/users/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Get all users
router.get('/admin/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;