'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import CreateGamePanel from './CreateGamePanel';
import JoinGamePanel from './JoinGamePanel';
import RandomMatchPanel from './RandomMatchPanel';

export default function SetupPanel() {
  const [activeTab, setActiveTab] = useState('create');
  const { setupVisible } = useGame();

  if (!setupVisible) return null;

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center z-50'>
      <div className='bg-white p-8 rounded-lg text-center max-w-lg w-11/12'>
        <h2 className='text-2xl font-bold text-dark mb-2'>Territory Typer</h2>
        <p className='mb-6'>
          Compete to claim territories by typing phrases faster than your
          opponents!
        </p>

        <div className='option-buttons flex justify-center mb-5 border-b border-gray-200 pb-4'>
          <button
            className={`option-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Game
          </button>
          <button
            className={`option-btn ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            Join Game
          </button>
          <button
            className={`option-btn ${activeTab === 'random' ? 'active' : ''}`}
            onClick={() => setActiveTab('random')}
          >
            Random Match
          </button>
        </div>

        {activeTab === 'create' && <CreateGamePanel />}
        {activeTab === 'join' && <JoinGamePanel />}
        {activeTab === 'random' && <RandomMatchPanel />}
      </div>
    </div>
  );
}
