'use client';

import { useGame } from '@/context/GameContext';

export default function GameOver() {
  const { gameState, resetGameState } = useGame();

  const handlePlayAgain = () => {
    if (gameState.socket) {
      gameState.socket.emit('playAgain');
    }
    resetGameState();
  };

  // Find the winner (first player in the sorted list)
  const winner = gameState.players.length > 0 ? gameState.players[0] : null;

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center z-50'>
      <div className='bg-white p-8 rounded-lg max-w-lg w-11/12 text-center'>
        <h2 className='text-2xl font-bold mb-5'>Game Over!</h2>

        {/* Winner banner */}
        {winner && (
          <div className='text-2xl font-bold my-5 p-2.5 bg-gray-100 rounded-lg'>
            🏆 <span style={{ color: winner.color }}>{winner.name}</span> wins
            with {winner.score} territories! 🏆
          </div>
        )}

        {/* Final scores table */}
        <table className='w-full border-collapse my-5'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='p-2.5 text-left border-b border-gray-200 font-bold'>
                Rank
              </th>
              <th className='p-2.5 text-left border-b border-gray-200 font-bold'>
                Player
              </th>
              <th className='p-2.5 text-left border-b border-gray-200 font-bold'>
                Territories
              </th>
              <th className='p-2.5 text-left border-b border-gray-200 font-bold'>
                Typing Speed
              </th>
            </tr>
          </thead>
          <tbody>
            {gameState.players.map((player, index) => (
              <tr key={player.id}>
                <td className='p-2.5 text-left border-b border-gray-200'>
                  {index + 1}
                </td>
                <td className='p-2.5 text-left border-b border-gray-200'>
                  <span style={{ color: player.color }}>{player.name}</span>
                </td>
                <td className='p-2.5 text-left border-b border-gray-200'>
                  {player.score}
                </td>
                <td className='p-2.5 text-left border-b border-gray-200'>
                  {player.avgTypingSpeed || 0} CPM
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handlePlayAgain}
          className='bg-primary text-white border-none py-3 px-6 text-base rounded cursor-pointer mt-5 hover:bg-blue-600'
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
