import React, { useState } from 'react';
import Button from '../common/Button';
import { Plus, Trash2 } from 'lucide-react';
import './QuizForm.css';

const QuizForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'general',
    timeLimit: initialData?.timeLimit || 30,
    questions: initialData?.questions || [
      {
        id: '1',
        text: '',
        options: [
          { id: '1', text: '', isCorrect: false },
          { id: '2', text: '', isCorrect: false },
          { id: '3', text: '', isCorrect: false },
          { id: '4', text: '', isCorrect: false }
        ]
      }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e, questionIndex) => {
    const { value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      text: value
    };
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedQuestions[questionIndex].options.map((option, idx) => {
        if (idx === optionIndex) {
          return { ...option, text: value };
        }
        return option;
      })
    };
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedQuestions[questionIndex].options.map((option, idx) => {
        return { ...option, isCorrect: idx === optionIndex };
      })
    };
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      text: '',
      options: [
        { id: `${Date.now()}-1`, text: '', isCorrect: false },
        { id: `${Date.now()}-2`, text: '', isCorrect: false },
        { id: `${Date.now()}-3`, text: '', isCorrect: false },
        { id: `${Date.now()}-4`, text: '', isCorrect: false }
      ]
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (formData.questions.length <= 1) return;

    const updatedQuestions = formData.questions.filter((_, idx) => idx !== questionIndex);
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean up the data to match backend expectations
    const quizData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      timeLimit: parseInt(formData.timeLimit),
      questions: formData.questions.map(question => ({
        text: question.text,
        options: question.options.map(option => ({
          text: option.text,
          isCorrect: option.isCorrect
        }))
      }))
    };
    onSubmit(quizData);
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Quiz Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          required
        ></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="general">General</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="science">Science</option>
            <option value="math">Mathematics</option>
            <option value="history">History</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="timeLimit">Time Limit (minutes)</label>
          <input
            type="number"
            id="timeLimit"
            name="timeLimit"
            value={formData.timeLimit}
            onChange={handleChange}
            min="1"
            max="120"
            required
          />
        </div>
      </div>

      <h3 className="questions-title">Questions</h3>

      {formData.questions.map((question, questionIndex) => (
        <div key={question.id} className="question-card">
          <div className="question-header">
            <h4>Question {questionIndex + 1}</h4>
            <button
              type="button"
              className="remove-question-btn"
              onClick={() => removeQuestion(questionIndex)}
              disabled={formData.questions.length <= 1}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="form-group">
            <label htmlFor={`question-${questionIndex}`}>Question</label>
            <textarea
              id={`question-${questionIndex}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(e, questionIndex)}
              rows="2"
              required
            ></textarea>
          </div>

          <div className="options-container">
            <p className="options-label">Options (select the correct answer)</p>

            {question.options.map((option, optionIndex) => (
              <div key={option.id} className="option-row">
                <input
                  type="radio"
                  id={`option-${questionIndex}-${optionIndex}`}
                  name={`correct-${questionIndex}`}
                  checked={option.isCorrect}
                  onChange={() => handleCorrectOptionChange(questionIndex, optionIndex)}
                  required
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(e, questionIndex, optionIndex)}
                  placeholder={`Option ${optionIndex + 1}`}
                  required
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="add-question-container">
        <Button
          type="button"
          variant="ghost"
          onClick={addQuestion}
          className="add-question-btn"
        >
          <Plus size={16} />
          <span>Add Question</span>
        </Button>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary">
          {initialData ? 'Update Quiz' : 'Create Quiz'}
        </Button>
      </div>
    </form>
  );
};

export default QuizForm;