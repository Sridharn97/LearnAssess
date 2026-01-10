import express from 'express';
import Interview from '../models/Interview.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all interviews
router.get('/', protect, async (req, res) => {
  try {
    const interviews = await Interview.find().populate('userId', 'name');
    res.json(interviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's interviews
router.get('/my-interviews', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id });
    res.json(interviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single interview
router.get('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('userId', 'name');
    if (interview) {
      res.json(interview);
    } else {
      res.status(404).json({ message: 'Interview not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create interview
router.post('/', protect, async (req, res) => {
  try {
    const interview = await Interview.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update interview
router.put('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedInterview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedInterview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete interview
router.delete('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await interview.deleteOne();
    res.json({ message: 'Interview removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;