'use client';

// import { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import SetupPanel from '@/components/Setup/SetupPanel';
import GameContainer from '@/components/Game/GameContainer';
import GameOver from '@/components/Game/GameOver';

export default function Home() {
  const { setupVisible, gameOverVisible } = useGame();

  return (
    <main className='min-h-screen'>
      {setupVisible && <SetupPanel />}
      <GameContainer />
      {gameOverVisible && <GameOver />}
    </main>
  );
}
