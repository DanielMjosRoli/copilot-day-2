import { useState, useEffect, useRef } from 'react';
import Player from './Player';
import VictoryScreen from './VictoryScreen';
import '../Style/Game.css';

const Game = () => {
  const initialPlayerState = { units: [], resources: 100, health: 100 };
  const [player1, setPlayer1] = useState(initialPlayerState);
  const [player2, setPlayer2] = useState(initialPlayerState);
  const [winner, setWinner] = useState(null);
  const aiUnitCreationTimer = useRef(0); // Timer for AI unit creation

  useEffect(() => {
    if (winner) return; // Stop the interval if there's a winner

    const gameInterval = setInterval(() => {
      aiActions();
      automateCombat();
      checkVictory();
    }, 1000); // Game actions every 1 second

    return () => clearInterval(gameInterval);
  }, [player1, player2, winner]);

  const createUnit = (player, setPlayer, unitType) => {
    if (player.resources >= 10) {
      let newUnit;
      if (unitType === 'Soldier') {
        newUnit = { name: 'Soldier', health: 100, attack: 20, position: player === player1 ? 0 : 90 }; // Increased soldier damage
      } else if (unitType === 'Archer') {
        newUnit = { name: 'Archer', health: 80, attack: 15, position: player === player1 ? 0 : 90 };
      }
      const updatedPlayer = {
        ...player,
        units: [...player.units, newUnit],
        resources: player.resources - 10,
      };
      setPlayer(updatedPlayer);
      console.log(`${unitType} created for ${player === player1 ? 'Player 1' : 'Player 2'}`);
      console.log('Updated Player:', updatedPlayer);
    }
  };

  const automateCombat = () => {
    const moveUnits = (player, setPlayer, direction) => {
      const updatedUnits = player.units.map(unit => ({
        ...unit,
        position: unit.position + direction * 1, // Move units by 1 unit per interval
      }));
      setPlayer({ ...player, units: updatedUnits });
    };

    const combat = (attacker, defender, setDefender, attackerAreaStart, attackerAreaEnd) => {
      if (attacker.units.length > 0 && defender.units.length > 0) {
        const attackerUnit = attacker.units[0];
        const defenderUnit = defender.units[0];

        if (Math.abs(attackerUnit.position - defenderUnit.position) < 5) { // Small hitbox
          let totalDamage = 0;

          // Calculate damage from the first three units
          for (let i = 0; i < Math.min(3, attacker.units.length); i++) {
            const unit = attacker.units[i];
            if (i === 0) {
              totalDamage += unit.attack;
            } else if (unit.name === 'Archer') {
              totalDamage += unit.attack;
            }
          }

          defenderUnit.health -= totalDamage;

          if (defenderUnit.health <= 0) {
            defender.units.shift();
          }

          setDefender({ ...defender, units: [...defender.units] });
        }
      } else if (attacker.units.length > 0) {
        // Attack player directly if no enemy units and unit is in the opponent's area
        const attackerUnit = attacker.units[0];
        if (attackerUnit.position >= attackerAreaStart && attackerUnit.position <= attackerAreaEnd) {
          defender.health -= attackerUnit.attack;
          setDefender({ ...defender });
        }
      }
    };

    moveUnits(player1, setPlayer1, 1); // Move player 1's units to the right
    moveUnits(player2, setPlayer2, -1); // Move player 2's units to the left

    combat(player1, player2, setPlayer2, 50, 100); // Player 1 can attack in the right half
    combat(player2, player1, setPlayer1, 0, 50); // Player 2 can attack in the left half
  };

  const checkVictory = () => {
    if (player1.health <= 0) {
      setWinner('Player 2');
    } else if (player2.health <= 0) {
      setWinner('Player 1');
    }
  };

  const aiActions = () => {
    if (player2.health > 0) {
      aiUnitCreationTimer.current += 1; // Increment the timer
      console.log('AI Timer:', aiUnitCreationTimer.current); // Debugging log
      console.log('AI Resources:', player2.resources); // Debugging log

      // AI creates a unit every 5 seconds if it has enough resources
      if (aiUnitCreationTimer.current >= 5 && player2.resources >= 10) {
        console.log('AI is creating a unit'); // Debugging log
        createUnit(player2, setPlayer2, 'Soldier');
        aiUnitCreationTimer.current = 0; // Reset the timer
      }
    }
  };

  const handlePlayAgain = () => {
    setPlayer1(initialPlayerState);
    setPlayer2(initialPlayerState);
    setWinner(null);
    aiUnitCreationTimer.current = 0; // Reset the timer
  };

  if (winner) {
    return <VictoryScreen winner={winner} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <div className="game">
      <div className="player-section player1">
        <Player
          player={player1}
          onCreateUnit={(unitType) => createUnit(player1, setPlayer1, unitType)}
        />
      </div>
      <div className="player-section player2">
        <Player
          player={player2}
          isAI={true}
        />
      </div>
    </div>
  );
};

export default Game;