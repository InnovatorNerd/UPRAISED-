import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './Question';
import Result from './Result';

const App = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Fetch quiz data from API
    const fetchQuiz = async () => {
      const result = await axios.get('https://mockapi.io/quiz');
      setQuizData(result.data);
    };
    fetchQuiz();
  }, []);

  const handleAnswer = async (selectedAnswers) => {
    const currentQuestion = quizData[currentQuestionIndex];
    let questionScore = 0;

    if (currentQuestion.isMultipleChoice) {
      // For multiple-choice questions, calculate the score fractionally
      const correctAnswers = currentQuestion.correctAnswers;
      const correctSelected = selectedAnswers.filter(ans => correctAnswers.includes(ans)).length;
      const incorrectSelected = selectedAnswers.filter(ans => !correctAnswers.includes(ans)).length;
      if (incorrectSelected === 0) {
        questionScore = (correctSelected / correctAnswers.length); // Fractional score based on correct answers
      }
    } else {
      // For single-choice questions
      if (selectedAnswers[0] === currentQuestion.correctAnswer) {
        questionScore = 1; // Full point if correct
      }
    }

    // Update the total score
    setScore(prevScore => prevScore + questionScore);

    // Submit the selected answers along with time taken
    await axios.post('https://mockapi.io/submit-answer', {
      questionId: currentQuestion.id,
      selectedAnswers,
      timeTaken,
      questionScore,
    });

    // If it's the last question, show result, else move to next question
    if (currentQuestionIndex === quizData.length - 1) {
      const response = await axios.post('https://mockapi.io/finish-quiz', {
        totalScore: score + questionScore, // Final total score
      });
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  if (showResult) {
    return <Result score={score} restartQuiz={() => window.location.reload()} />;
  }

  return (
    <div className="quiz-app">
      {quizData.length > 0 && (
        <Question
          question={quizData[currentQuestionIndex]}
          onAnswerSubmit={handleAnswer}
          setTimeTaken={setTimeTaken}
        />
      )}
    </div>
  );
};

export default App;
