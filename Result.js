import React from 'react';

const Result = ({ score, restartQuiz }) => {
  return (
    <div className="result-container">
      <h1>Your Result</h1>
      <div className="score-display">
        <p>Your total score is: <strong>{(score * 100).toFixed(2)}%</strong></p> {/* Score as percentage */}
      </div>
      <div className="action-buttons">
        <button onClick={restartQuiz} className="restart-btn">Start Again</button>
      </div>
    </div>
  );
};

export default Result;
