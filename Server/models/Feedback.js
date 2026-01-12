import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Bug Report', 'Feature Request', 'Content Quality', 'General Inquiry', 'Other'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;