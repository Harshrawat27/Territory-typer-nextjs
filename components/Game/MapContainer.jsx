// components/Game/MapContainer.jsx
'use client';

import { useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import WorldMap from '@/components/WorldMap';

export default function MapContainer() {
  const { gameState, selectTerritory } = useGame();
  const mapContainerRef = useRef(null);

  // Initialize territory labels
  useEffect(() => {
    if (gameState.territories.length > 0 && mapContainerRef.current) {
      // Remove any existing labels
      const existingLabels =
        mapContainerRef.current.querySelectorAll('.territory-label');
      existingLabels.forEach((label) => label.remove());

      // Calculate scale factor for the map container
      const mapContainer = mapContainerRef.current;
      const containerRect = mapContainer.getBoundingClientRect();
      const scaleX = containerRect.width / 1000; // Based on SVG viewBox width
      const scaleY = containerRect.height / 500; // Based on SVG viewBox height

      // Create new labels
      gameState.territories.forEach((territory) => {
        const label = document.createElement('div');
        label.className = 'territory-label';
        label.textContent = territory.name;

        // Position labels correctly
        label.style.position = 'absolute';
        label.style.left = `${territory.x * scaleX}px`;
        label.style.top = `${territory.y * scaleY}px`;
        label.style.transform = 'translate(-50%, -50%)';

        // Style labels
        label.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
        label.style.borderRadius = '4px';
        label.style.padding = '6px 10px';
        label.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
        label.style.fontSize = '12px';
        label.style.pointerEvents = 'none';

        // Add a territory status indicator
        const territory2 = gameState.territories.find(
          (t) => t.id === territory.id
        );
        if (territory2 && territory2.owner) {
          const player = gameState.players.find(
            (p) => p.id === territory2.owner
          );
          if (player) {
            // Add colored border to indicate ownership
            label.style.border = `2px solid ${player.color}`;
          }
        }

        mapContainerRef.current.appendChild(label);
      });
    }
  }, [gameState.territories, gameState.players]);

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
      ref={mapContainerRef}
      id='map-container'
      className='flex-1 relative h-[500px] bg-white rounded-lg shadow-md overflow-hidden'
      style={{ position: 'relative' }}
    >
      <WorldMap
        territories={gameState.territories}
        onTerritoryClick={handleTerritoryClick}
      />
    </div>
  );
}
