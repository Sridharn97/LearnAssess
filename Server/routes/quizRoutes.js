import express from 'express';
import Quiz from '../models/Quiz.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all quizzes
router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name');
    res.json(quizzes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single quiz
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create quiz (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const quiz = await Quiz.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update quiz (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
      quiz.title = req.body.title || quiz.title;
      quiz.description = req.body.description || quiz.description;
      quiz.category = req.body.category || quiz.category;
      quiz.timeLimit = req.body.timeLimit || quiz.timeLimit;
      quiz.questions = req.body.questions || quiz.questions;

      const updatedQuiz = await quiz.save();
      res.json(updatedQuiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete quiz (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
      await quiz.deleteOne();
      res.json({ message: 'Quiz removed' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;