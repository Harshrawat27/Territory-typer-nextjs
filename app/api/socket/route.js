// 1. Create a server file for socket.io
// Create this file at: app/api/socket/io/route.js

import { NextResponse } from 'next/server';
import { Server as SocketServer } from 'socket.io';

// Game state storage
const games = {};
const waitingGames = [];

// Helper function for player colors
function getPlayerColor(index) {
  const colors = [
    '#e74c3c',
    '#3498db',
    '#2ecc71',
    '#9b59b6',
    '#f39c12',
    '#1abc9c',
  ];
  return colors[index % colors.length];
}

// Generate unique game ID
function generateGameId() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Debug logging helper
function logDebug(message, data = null) {
  console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
}

// Create initial territories data
function createTerritories() {
  return [
    {
      id: 'north-america',
      name: 'North America',
      phrase:
        'North America is a diverse continent with vast landscapes, from the Arctic tundra of Canada to the tropical beaches of the Caribbean.',
      owner: null,
      x: 180,
      y: 150,
    },
    {
      id: 'south-america',
      name: 'South America',
      phrase:
        'South America is rich in biodiversity, featuring the Amazon Rainforest, the Andes Mountains, and unique wildlife.',
      owner: null,
      x: 220,
      y: 290,
    },
    // ... other territories ...
  ];
}

export async function GET(req) {
  try {
    if (!req.socket.server.io) {
      console.log('Initializing Socket.io server...');

      const io = new SocketServer(req.socket.server, {
        path: '/api/socket/io',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
          credentials: true,
        },
        transports: ['polling', 'websocket'],
      });

      req.socket.server.io = io;

      // Set up socket connection handler
      io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Socket event handlers go here...
        // Create game, join game, etc.

        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Socket server running',
    });
  } catch (error) {
    console.error('Socket server error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 2. Update the client-side socket initialization
// lib/socket.js

import { io } from 'socket.io-client';

let socket = null;

export const initSocket = async () => {
  if (socket) {
    return socket;
  }

  try {
    // First, trigger the server endpoint that sets up the socket.io server
    await fetch('/api/socket/io');

    // Then connect to the socket.io server
    socket = io({
      path: '/api/socket/io',
      reconnectionDelayMax: 10000,
      transports: ['polling', 'websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected!', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    return socket;
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    return null;
  }
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket() first.');
  }
  return socket;
};
