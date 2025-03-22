'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';

export default function JoinGamePanel() {
  const { gameState, joinGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [gameJoined, setGameJoined] = useState(false);

  // Update UI based on game state changes
  useEffect(() => {
    if (gameState.gameId && gameState.gameMode === 'join') {
      setGameJoined(true);
    }
  }, [gameState.gameId, gameState.gameMode]);

  const handleJoinGame = () => {
    if (!playerName.trim() || !gameId.trim()) {
      alert('Please enter both your name and the game ID');
      return;
    }
    joinGame(gameId.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className='w-full'>
      {!gameJoined ? (
        <>
          <input
            type='text'
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder='Enter your nickname'
            maxLength={15}
            className='w-full p-3 my-2.5 rounded border border-gray-300 focus:outline-none focus:border-primary'
          />
          <input
            type='text'
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder='Enter Game ID'
            className='w-full p-3 my-2.5 rounded border border-gray-300 focus:outline-none focus:border-primary'
          />
          <button
            onClick={handleJoinGame}
            className='w-full bg-secondary text-white border-none py-3 px-6 text-base rounded cursor-pointer my-2.5 hover:opacity-90'
          >
            Join Game
          </button>
        </>
      ) : (
        <div className='w-full'>
          <div className='text-left my-4'>
            <h3 className='font-bold mb-2'>Players in room:</h3>
            <ul className='list-disc pl-5'>
              {gameState.players.map((player) => (
                <li key={player.id} style={{ color: player.color }}>
                  {player.name} {player.isHost ? '(Host)' : ''}
                </li>
              ))}
            </ul>
          </div>
          <p className='text-gray-500 italic mt-2'>
            Waiting for host to start the game...
          </p>
        </div>
      )}
    </div>
  );
}
