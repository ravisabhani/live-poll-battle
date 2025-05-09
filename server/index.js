// Import required modules
const express = require('express'); // Web framework for REST API
const http = require('http');       // Node core HTTP server
const cors = require('cors');       // Enable CORS for cross-origin requests
const { Server } = require('socket.io'); // WebSocket server

// Initialize express app and middleware
const app = express();
app.use(cors());             // Allow cross-origin access (needed for frontend)
app.use(express.json());     // Parse JSON request bodies

// Create HTTP server and attach Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },     // Allow WebSocket connections from any origin
});

// In-memory room storage
// Each room will have: vote counts, voted users, timer, and interval reference
const rooms = {};

/**
 * Route: POST /create-room
 * Purpose: Create a new poll room and return a unique room code
 */
app.post('/create-room', (req, res) => {
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Initialize room with default static options: Cats vs Dogs
  rooms[roomCode] = {
    votes: { optionA: 0, optionB: 0 }, // optionA = Cats, optionB = Dogs
    votedUsers: {},                   // Track votes by socket ID
    timer: 60,                        // 60-second countdown
    interval: null,                   // Timer reference (setInterval)
  };

  // Respond with the new room code
  res.json({ roomCode });
});

/**
 * Handle WebSocket connections
 * Purpose: Enable real-time voting and live updates
 */
io.on('connection', (socket) => {

  /**
   * Event: join-room
   * Triggered when a user joins a room
   */
  socket.on('join-room', ({ roomCode, username }) => {
    const room = rooms[roomCode];

    // If room doesn't exist, send error and stop
    if (!room) {
      socket.emit('error-room', 'Room not found.');
      return;
    }

    // Join the user to the specified room (via WebSocket)
    socket.join(roomCode);

    // Start countdown timer if not already running
    if (!room.interval) {
      room.interval = setInterval(() => {
        if (room.timer > 0) {
          room.timer--;
          io.to(roomCode).emit('timer', room.timer); // Broadcast timer
        } else {
          clearInterval(room.interval); // Stop timer after 60s
        }
      }, 1000);
    }

    // Send initial vote counts to all users in the room
    io.to(roomCode).emit('update-votes', { votes: room.votes });
  });

  /**
   * Event: vote
   * Triggered when a user casts a vote (optionA or optionB)
   */
  socket.on('vote', ({ roomCode, option }) => {
    const room = rooms[roomCode];

    // Validate room, time, and prevent multiple votes
    if (room && room.timer > 0 && !room.votedUsers[socket.id]) {
      room.votes[option]++;                 // Increment vote
      room.votedUsers[socket.id] = true;    // Mark user as voted
      io.to(roomCode).emit('update-votes', { votes: room.votes }); // Broadcast update
    }
  });

  /**
   * Event: disconnect
   * Handle user disconnects (optional)
   */
  socket.on('disconnect', () => {
    // Optional: Cleanup, logging, or user tracking can go here
  });
});

// Start the backend server on port 5000
server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
