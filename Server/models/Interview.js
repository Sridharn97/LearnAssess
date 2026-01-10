import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  tips: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  result: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;