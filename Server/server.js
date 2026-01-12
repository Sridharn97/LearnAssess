import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import quizResultRoutes from './routes/quizResultRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'materials');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-results', quizResultRoutes);
app.use('/api/feedbacks', feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});