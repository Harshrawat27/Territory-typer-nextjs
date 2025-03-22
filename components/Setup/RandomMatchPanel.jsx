'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';

export default function RandomMatchPanel() {
  const { gameState, socket } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [findingMatch, setFindingMatch] = useState(false);
  const [playersFound, setPlayersFound] = useState(false);

  // Update UI based on game state changes
  useEffect(() => {
    if (gameState.gameId && gameState.gameMode === 'random') {
      setFindingMatch(true);

      if (gameState.players.length > 1) {
        setPlayersFound(true);
      }
    }
  }, [gameState.gameId, gameState.gameMode, gameState.players.length]);

  const handleFindMatch = () => {
    if (!playerName.trim()) {
      alert('Please enter your nickname');
      return;
    }

    if (socket) {
      socket.emit('findMatch', { playerName: playerName.trim() });
      setFindingMatch(true);
    }
  };

  const handleCancelMatchmaking = () => {
    if (socket) {
      socket.emit('cancelMatchmaking');
      setFindingMatch(false);
      setPlayersFound(false);
    }
  };

  return (
    <div className='w-full'>
      {!findingMatch ? (
        <>
          <input
            type='text'
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder='Enter your nickname'
            maxLength={15}
            className='w-full p-3 my-2.5 rounded border border-gray-300 focus:outline-none focus:border-primary'
          />
          <button
            onClick={handleFindMatch}
            className='w-full bg-secondary text-white border-none py-3 px-6 text-base rounded cursor-pointer my-2.5 hover:opacity-90'
          >
            Find Match
          </button>
        </>
      ) : (
        <div className='w-full'>
          <div className='loading-spinner'></div>
          <p className='text-gray-500 italic my-2'>Finding a match...</p>
          <button
            onClick={handleCancelMatchmaking}
            className='w-full bg-danger text-white border-none py-3 px-6 text-base rounded cursor-pointer my-2.5 hover:opacity-90'
          >
            Cancel
          </button>

          {playersFound && (
            <div className='text-left my-4'>
              <h3 className='font-bold mb-2'>Match found! Players:</h3>
              <ul className='list-disc pl-5'>
                {gameState.players.map((player) => (
                  <li key={player.id} style={{ color: player.color }}>
                    {player.name} {player.isHost ? '(Host)' : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
