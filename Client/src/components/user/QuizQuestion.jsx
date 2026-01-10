import React from 'react';
import './QuizQuestion.css';

const QuizQuestion = ({ 
  question, 
  questionNumber, 
  selectedOption, 
  setSelectedOption,
  showResults = false,
}) => {
  const handleOptionSelect = (optionIndex) => {
    if (!showResults) {
      setSelectedOption(optionIndex);
    }
  };

  const getOptionClass = (option, index) => {
    if (!showResults) {
      return selectedOption === index ? 'selected' : '';
    }
    
    if (option.isCorrect) {
      return 'correct';
    } else if (selectedOption === index && !option.isCorrect) {
      return 'incorrect';
    }
    
    return '';
  };

  return (
    <div className="quiz-question">
      <h3 className="question-number">Question {questionNumber}</h3>
      <p className="question-text">{question.text}</p>
      
      <div className="options-list">
        {question.options.map((option, index) => (
          <div 
            key={index}
            className={`option ${getOptionClass(option, index)}`}
            onClick={() => handleOptionSelect(index)}
          >
            <div className="option-selector">
              {selectedOption === index ? (
                <div className="option-selector-inner"></div>
              ) : null}
            </div>
            <span className="option-text">{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;