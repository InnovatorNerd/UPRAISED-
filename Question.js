import React, { useState, useEffect } from 'react';

const Question = ({ question, onAnswerSubmit, setTimeTaken }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    // Reset the start time when the question changes
    setStartTime(Date.now());
    setSelectedAnswers([]);
  }, [question]);

  const handleSelectAnswer = (answer) => {
    if (question.isMultipleChoice) {
      // For multiple-choice questions, allow multiple selections
      if (selectedAnswers.includes(answer)) {
        setSelectedAnswers(selectedAnswers.filter(ans => ans !== answer));
      } else {
        setSelectedAnswers([...selectedAnswers, answer]);
      }
    } else {
      // For single-choice questions, only allow one selection at a time
      setSelectedAnswers([answer]);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) {
      alert('Please select at least one answer!');
      return;
    }

    const timeSpent = (Date.now() - startTime) / 1000; // Calculate time spent in seconds
    setTimeTaken(timeSpent);
    
    // Pass the selected answers to the parent component
    onAnswerSubmit(selectedAnswers);
  };

  return (
    <div className="question-container">
      <h2>{question.text}</h2>
      {question.image && <img src={question.image} alt="question illustration" />}
      <div className="options">
        {question.answers.map((answer) => (
          <div
            key={answer}
            className={`option ${selectedAnswers.includes(answer) ? 'selected' : ''}`}
            onClick={() => handleSelectAnswer(answer)}
          >
            {answer}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="submit-btn">Next</button>
    </div>
  );
};

export default Question;
