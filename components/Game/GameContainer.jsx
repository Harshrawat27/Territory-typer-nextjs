'use client';

import { useGame } from '@/context/GameContext';
import MapContainer from './MapContainer';
import TypingArea from './TypingArea';

export default function GameContainer() {
  const { gameState } = useGame();

  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='max-w-7xl mx-auto px-5 py-5'>
      <header className='text-center mb-5'>
        <h1 className='text-3xl font-bold text-dark mb-2'>Territory Typer</h1>
        <p className='text-lg'>
          Type the phrases faster than your opponents to claim territories!
        </p>
      </header>

      <div className='flex justify-between items-center mb-5'>
        <div className='bg-white rounded-lg p-2.5 px-5 shadow-md'>
          <div className='text-2xl font-bold text-danger'>
            {formatTime(gameState.timeRemaining)}
          </div>
        </div>
        <div className='bg-white rounded-lg p-2.5 px-5 shadow-md'>
          <div className='scores'>
            {gameState.players.map((player) => (
              <div className='flex items-center mb-2 last:mb-0' key={player.id}>
                <div
                  className='w-5 h-5 rounded-full mr-2.5'
                  style={{ backgroundColor: player.color }}
                ></div>
                <span>
                  {player.name}: {player.score} territories
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5'>
        <MapContainer />
        <TypingArea />
      </div>
    </div>
  );
}
