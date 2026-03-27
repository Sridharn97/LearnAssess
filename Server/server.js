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
const allowedOriginsFromEnv = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
 
  if (!origin) return true;


  if (origin.includes('localhost')) return true;

  if (origin.endsWith('.vercel.app')) return true;

  if (origin.includes('learnassess.onrender.com')) return true;

  if (allowedOriginsFromEnv.includes(origin)) return true;

  return false;
};

const corsOptions = {
  origin: function (origin, callback) {
    return callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

const uploadsDir = path.join(process.cwd(), 'uploads', 'materials');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    dbReadyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI env var. Database connection will not be established.');
} else {
  mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 10 })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}


app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-results', quizResultRoutes);
app.use('/api/feedbacks', feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
