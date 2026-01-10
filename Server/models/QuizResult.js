import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  selectedAnswers: {
    type: Map,
    of: Number, // Maps question index to selected option index
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one result per user per quiz (allow multiple attempts)
quizResultSchema.index({ userId: 1, quizId: 1, createdAt: -1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export default QuizResult;