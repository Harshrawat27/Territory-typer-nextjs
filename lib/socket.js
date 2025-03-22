import { io } from 'socket.io-client';

// Socket.io client singleton
let socket;

export const initSocket = async () => {
  // If the socket is already initialized, return it
  if (socket) {
    return socket;
  }

  // Initialize the socket connection
  const socketInitializer = async () => {
    // Notify the server to start the socket
    await fetch('/api/socket');

    // Create socket connection
    socket = io({
      path: '/api/socket/io',
    });

    return socket;
  };

  return await socketInitializer();
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket() first.');
  }
  return socket;
};
