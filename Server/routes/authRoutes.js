import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      name,
      role: role || 'user'
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
    console.log('Login attempt for email:', email);
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('Comparing password...');
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch);
      
      if (isMatch) {
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          token: generateToken(user._id)
        });
      } else {
        console.log('Password does not match');
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      console.log('User not found');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;