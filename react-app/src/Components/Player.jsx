import React from 'react';
import Unit from './Unit';

const Player = ({ player, onCreateUnit, isAI }) => {
  return (
    <div className="player">
      <h2>{isAI ? 'AI Player' : 'Player'}</h2>
      <div className="units">
        {player.units.map((unit, index) => (
          <Unit key={index} unit={unit} />
        ))}
      </div>
      <p>Resources: {player.resources}</p>
      <p>Health: {player.health}</p>
      {!isAI && (
        <>
          <button onClick={() => onCreateUnit('Soldier')}>Create Soldier</button>
          <button onClick={() => onCreateUnit('Archer')}>Create Archer</button>
        </>
      )}
    </div>
  );
};

export default Player;