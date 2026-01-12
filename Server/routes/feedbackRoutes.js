import express from 'express';
import Feedback from '../models/Feedback.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all feedbacks
router.get('/', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'name');
    res.json(feedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's feedbacks
router.get('/my-feedbacks', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id });
    res.json(feedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single feedback
router.get('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('userId', 'name');
    if (feedback) {
      res.json(feedback);
    } else {
      res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create feedback
router.post('/', protect, async (req, res) => {
  try {
    const feedback = await Feedback.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update feedback
router.put('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete feedback
router.delete('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;