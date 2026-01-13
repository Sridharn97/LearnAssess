import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: function () {
      return !this.file; // Content is required only if no file is uploaded
    }
  },
  file: {
    type: String, // Local file path for PDF uploads
    required: false
  },
  fileName: {
    type: String, // Original filename
    required: false
  },
  fileSize: {
    type: Number, // File size in bytes
    required: false
  },
  contentType: {
    type: String,
    enum: ['text', 'pdf'],
    default: 'text'
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'programming', 'design', 'science', 'math', 'history']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Material = mongoose.model('Material', materialSchema);
export default Material;