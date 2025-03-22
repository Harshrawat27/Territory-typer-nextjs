'use client';

import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';

export default function TypingArea() {
  const { gameState, typingState, socket, setTypingState } = useGame();
  const [inputValue, setInputValue] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [isError, setIsError] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(
    'Click on a territory to start typing!'
  );
  const inputRef = useRef(null);

  // Update the placeholder text when territory is selected
  useEffect(() => {
    if (gameState.selectedTerritory) {
      setPlaceholderText(gameState.selectedTerritory.phrase);
      setCurrentMessage(`Claim ${gameState.selectedTerritory.name} by typing:`);
      if (inputRef.current) {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }
    } else {
      setPlaceholderText('');
      if (inputRef.current) {
        inputRef.current.disabled = true;
      }
    }
  }, [gameState.selectedTerritory]);

  // Update placeholder visibility as user types
  const updatePlaceholderVisibility = (typedText) => {
    if (typedText.length === 0) {
      setPlaceholderText(gameState.selectedTerritory?.phrase || '');
      setIsError(false);
      return;
    }

    // Check if what's typed so far matches the start of the target phrase
    if (gameState.selectedTerritory?.phrase.startsWith(typedText)) {
      // Show only the remaining text
      setPlaceholderText(
        gameState.selectedTerritory.phrase.substring(typedText.length)
      );
      setIsError(false);
    } else {
      // If there's a mismatch, show error
      setIsError(true);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    if (!gameState.selectedTerritory) return;

    const typedText = e.target.value;

    // Check if the input was a paste event
    const inputType = e.nativeEvent.inputType;
    if (inputType === 'insertFromPaste') {
      e.preventDefault();
      return;
    }

    setInputValue(typedText);
    updatePlaceholderVisibility(typedText);

    // Check if the typed text matches the phrase
    if (typedText === gameState.selectedTerritory.phrase) {
      // Calculate typing speed (characters per minute)
      const typingTime = (Date.now() - typingState.typingStartTime) / 1000; // in seconds
      const typingSpeed = Math.round(
        (typingState.currentPhraseLength / typingTime) * 60
      ); // chars per minute

      // Notify server about territory claim with typing speed
      if (socket) {
        socket.emit('claimTerritory', {
          gameId: gameState.gameId,
          territoryId: gameState.selectedTerritory.id,
          typingSpeed: typingSpeed,
        });
      }

      setInputValue('');
      setPlaceholderText('');
      setCurrentMessage(`You claimed ${gameState.selectedTerritory.name}!`);

      if (inputRef.current) {
        inputRef.current.disabled = true;
      }
    }
  };

  // Prevent paste in typing input
  const handlePaste = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className='flex-1 bg-white rounded-lg shadow-md p-5 flex flex-col'>
      <div className='text-lg font-bold mb-5'>{currentMessage}</div>

      <div className='relative min-h-[200px] max-h-[300px] border-2 border-gray-300 rounded bg-gray-50 p-3 overflow-y-auto mb-5'>
        <div
          className={`absolute top-3 left-3 right-3 text-lg text-gray-500 opacity-50 whitespace-pre-wrap break-words pointer-events-none select-none leading-normal ${
            isError ? 'text-red-500 opacity-70' : ''
          }`}
        >
          {placeholderText}
        </div>
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder='Type here...'
          disabled={!gameState.selectedTerritory}
          className='absolute top-0 left-0 w-full h-full p-3 text-lg bg-transparent border-none outline-none text-gray-800 whitespace-pre-wrap break-words leading-normal'
        />
      </div>
    </div>
  );
}
