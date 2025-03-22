'use client';

import { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import WorldMap from '@/components/WorldMap'; // Make sure this path is correct

export default function MapContainer() {
  const { gameState, selectTerritory } = useGame();

  // Initialize territory labels
  useEffect(() => {
    if (gameState.territories.length > 0) {
      // Remove any existing labels
      document
        .querySelectorAll('.territory-label')
        .forEach((label) => label.remove());

      // Create new labels
      gameState.territories.forEach((territory) => {
        const label = document.createElement('div');
        label.className = 'territory-label';
        label.textContent = territory.name;
        label.style.left = `${territory.x}px`;
        label.style.top = `${territory.y}px`;

        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
          mapContainer.appendChild(label);
        }
      });
    }
  }, [gameState.territories]);

  // Handle territory click
  const handleTerritoryClick = (territoryId) => {
    if (!gameState.isActive) return;

    const territory = gameState.territories.find((t) => t.id === territoryId);
    if (territory) {
      selectTerritory(territory);
    }
  };

  return (
    <div
      id='map-container'
      className='flex-1 relative h-[500px] bg-white rounded-lg shadow-md overflow-hidden'
    >
      <WorldMap
        territories={gameState.territories}
        onTerritoryClick={handleTerritoryClick}
      />
    </div>
  );
}
