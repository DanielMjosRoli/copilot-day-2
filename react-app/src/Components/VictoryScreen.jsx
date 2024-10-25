import React from 'react';

const VictoryScreen = ({ winner, onPlayAgain }) => {
  return (
    <div className="victory-screen">
      <h1>{winner} Wins!</h1>
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};

export default VictoryScreen;