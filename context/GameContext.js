'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { initSocket, getSocket } from '@/lib/socket';

// Create game context
const GameContext = createContext(null);

// Initial game state
const initialGameState = {
  isActive: false,
  players: [],
  territories: [],
  currentPlayer: null,
  selectedTerritory: null,
  timeRemaining: 180,
  gameId: null,
  isHost: false,
  gameMode: null,
};

// Typing state
const initialTypingState = {
  typingStartTime: 0,
  currentPhraseLength: 0,
};

export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [gameState, setGameState] = useState(initialGameState);
  const [typingState, setTypingState] = useState(initialTypingState);
  const [setupVisible, setSetupVisible] = useState(true);
  const [gameOverVisible, setGameOverVisible] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const setupSocket = async () => {
      try {
        const socketConnection = await initSocket();
        setSocket(socketConnection);
        setSocketInitialized(true);

        // Setup socket event listeners here
        return () => {
          if (socketConnection) {
            socketConnection.disconnect();
          }
        };
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    };

    setupSocket();
  }, []);

  // Reset game state
  const resetGameState = useCallback(() => {
    setGameState(initialGameState);
    setTypingState(initialTypingState);
    setGameOverVisible(false);
    setSetupVisible(true);
  }, []);

  // Select territory to claim
  const selectTerritory = useCallback(
    (territory) => {
      if (territory.owner === gameState.currentPlayer?.id) {
        return false;
      }

      if (territory.owner !== null) {
        return false;
      }

      setGameState((prev) => ({
        ...prev,
        selectedTerritory: territory,
      }));

      // Initialize typing timer
      setTypingState({
        typingStartTime: Date.now(),
        currentPhraseLength: territory.phrase.length,
      });

      // Notify server about territory selection
      if (socket) {
        socket.emit('selectTerritory', {
          gameId: gameState.gameId,
          territoryId: territory.id,
        });
      }

      return true;
    },
    [gameState.currentPlayer, gameState.gameId, socket]
  );

  // Update the game state when a territory is claimed
  const claimTerritory = useCallback((territoryId, playerId) => {
    setGameState((prev) => {
      // Find the territory
      const updatedTerritories = prev.territories.map((t) =>
        t.id === territoryId ? { ...t, owner: playerId } : t
      );

      // Update players with new scores
      const updatedPlayers = prev.players.map((player) => {
        if (player.id === playerId) {
          const score = updatedTerritories.filter(
            (t) => t.owner === playerId
          ).length;
          return { ...player, score };
        }
        return player;
      });

      return {
        ...prev,
        territories: updatedTerritories,
        players: updatedPlayers,
      };
    });
  }, []);

  // Create a new game
  const createGame = useCallback(
    (playerName) => {
      if (!socket) return;
      socket.emit('createGame', { playerName });
    },
    [socket]
  );

  // Join an existing game
  const joinGame = useCallback(
    (gameId, playerName) => {
      if (!socket) return;
      socket.emit('joinGame', { gameId, playerName });
    },
    [socket]
  );

  // Start the game (host only)
  const startGame = useCallback(() => {
    if (!socket || !gameState.isHost || !gameState.gameId) return;
    socket.emit('startGame', { gameId: gameState.gameId });
  }, [socket, gameState.isHost, gameState.gameId]);

  // Set up socket event listeners when socket is initialized
  useEffect(() => {
    if (!socket) return;

    // Game created
    socket.on('gameCreated', ({ gameId, player, game }) => {
      setGameState({
        ...gameState,
        gameId,
        isHost: true,
        gameMode: 'create',
        players: game.players,
        territories: game.territories,
        currentPlayer: player,
      });
    });

    // Game joined
    socket.on('gameJoined', ({ gameId, player, game }) => {
      setGameState({
        ...gameState,
        gameId,
        isHost: false,
        gameMode: 'join',
        players: game.players,
        territories: game.territories,
        currentPlayer: player,
      });
    });

    // Player joined
    socket.on('playerJoined', ({ player, gameId, players }) => {
      setGameState((prev) => ({
        ...prev,
        players,
      }));
    });

    // Game started
    socket.on('gameStarted', ({ game }) => {
      setGameState((prev) => ({
        ...prev,
        isActive: true,
        territories: game.territories,
        timeRemaining: game.timeRemaining,
      }));
      setSetupVisible(false);
    });

    // Timer update
    socket.on('timerUpdate', ({ timeRemaining }) => {
      setGameState((prev) => ({
        ...prev,
        timeRemaining,
      }));
    });

    // Territory claimed
    socket.on(
      'territoryClaimed',
      ({ territoryId, playerId, playerName, playerColor, players }) => {
        // Update the game state
        setGameState((prev) => {
          // If this player was trying to claim this territory, reset selection
          if (
            prev.selectedTerritory?.id === territoryId &&
            playerId !== prev.currentPlayer?.id
          ) {
            return {
              ...prev,
              selectedTerritory: null,
              players,
            };
          }
          return {
            ...prev,
            players,
          };
        });

        // Update the territory owner
        claimTerritory(territoryId, playerId);
      }
    );

    // Game over
    socket.on('gameOver', ({ players, reason }) => {
      setGameState((prev) => ({
        ...prev,
        isActive: false,
        players,
      }));
      setGameOverVisible(true);
    });

    // Error messages
    socket.on('error', ({ message }) => {
      alert(message);
    });

    // Player left
    socket.on('playerLeft', ({ playerId, playerName, players }) => {
      setGameState((prev) => ({
        ...prev,
        players,
      }));
    });

    // New host assigned
    socket.on('newHost', ({ playerId, playerName }) => {
      setGameState((prev) => {
        const newPlayers = prev.players.map((p) =>
          p.id === playerId ? { ...p, isHost: true } : { ...p, isHost: false }
        );

        return {
          ...prev,
          players: newPlayers,
          isHost: playerId === prev.currentPlayer?.id,
        };
      });
    });

    // Game ended
    socket.on('gameEnded', ({ reason }) => {
      alert(
        reason === 'hostLeft'
          ? 'The host left the game.'
          : 'The game has ended.'
      );
      resetGameState();
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off('gameCreated');
      socket.off('gameJoined');
      socket.off('playerJoined');
      socket.off('gameStarted');
      socket.off('timerUpdate');
      socket.off('territoryClaimed');
      socket.off('gameOver');
      socket.off('error');
      socket.off('playerLeft');
      socket.off('newHost');
      socket.off('gameEnded');
    };
  }, [socket, claimTerritory, resetGameState]);

  // Value object to provide to context consumers
  const value = {
    socket,
    socketInitialized,
    gameState,
    typingState,
    setupVisible,
    gameOverVisible,
    setGameOverVisible,
    setTypingState,
    setGameState,
    resetGameState,
    selectTerritory,
    claimTerritory,
    createGame,
    joinGame,
    startGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook for using the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
