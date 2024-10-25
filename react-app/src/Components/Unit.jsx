import React from 'react';

const Unit = ({ unit }) => {
  return (
    <div
      className="unit"
      style={{
        left: `${unit.position}%`,
      }}
    >
      <p>{unit.name}</p>
      <p>Health: {unit.health}</p>
      <p>Attack: {unit.attack}</p>
    </div>
  );
};

export default Unit;