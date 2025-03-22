'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';

export default function CreateGamePanel() {
  const { gameState, createGame, startGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [gameCreated, setGameCreated] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy Game ID');

  // Update UI based on game state changes
  useEffect(() => {
    if (gameState.gameId && gameState.gameMode === 'create') {
      setGameCreated(true);
    }
  }, [gameState.gameId, gameState.gameMode]);

  const handleCreateGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your nickname');
      return;
    }
    createGame(playerName.trim());
  };

  const handleCopyGameId = () => {
    navigator.clipboard.writeText(gameState.gameId).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy Game ID');
      }, 2000);
    });
  };

  const handleStartGame = () => {
    if (gameState.players.length >= 1) {
      startGame();
    }
  };

  return (
    <div className='w-full'>
      {!gameCreated ? (
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
            onClick={handleCreateGame}
            className='w-full bg-secondary text-white border-none py-3 px-6 text-base rounded cursor-pointer my-2.5 hover:opacity-90'
          >
            Create Game Room
          </button>
        </>
      ) : (
        <div className='w-full'>
          <p className='mb-2'>Share this game ID with your friends:</p>
          <div className='bg-gray-100 border border-dashed border-gray-300 p-3 my-2.5 text-lg font-bold rounded select-all'>
            {gameState.gameId}
          </div>
          <button
            onClick={handleCopyGameId}
            className='w-full bg-danger text-white border-none py-3 px-6 text-base rounded cursor-pointer my-2.5 hover:opacity-90'
          >
            {copyButtonText}
          </button>

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

          <button
            onClick={handleStartGame}
            className='w-full bg-primary text-white border-none py-3 px-6 text-base rounded cursor-pointer my-2.5 hover:opacity-90'
          >
            Start Game
          </button>
          <p className='text-gray-500 italic mt-2'>
            Waiting for players to join...
          </p>
        </div>
      )}
    </div>
  );
}
