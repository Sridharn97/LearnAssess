import express from 'express';
import QuizResult from '../models/QuizResult.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get quiz results for current user
router.get('/', protect, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
      .populate('quizId', 'title category')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get quiz result by user and quiz (most recent)
router.get('/user/:userId/quiz/:quizId', protect, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      userId: req.params.userId,
      quizId: req.params.quizId
    })
      .populate('quizId', 'title category')
      .sort({ createdAt: -1 });

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Quiz result not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Submit quiz result
router.post('/', protect, async (req, res) => {
  try {
    const result = await QuizResult.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all quiz results (admin only)
router.get('/all', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const results = await QuizResult.find()
      .populate('userId', 'name email')
      .populate('quizId', 'title category')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;