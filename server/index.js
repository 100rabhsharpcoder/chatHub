// Import required modules and libraries
import express from 'express';
import dotenv from 'dotenv/config';
import mongoDBConnect from './mongoDB/connection.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';
import * as Server from 'socket.io';

// Create an Express application
const app = express();

// Configuration for CORS (Cross-Origin Resource Sharing)
const corsConfig = {
  origin: process.env.BASE_URL, // Specify the allowed origin
  credentials: true,
};

// Middleware setup for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for the application
app.use(cors(corsConfig));

// Define routes for user, chat, and message endpoints
app.use('/', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Configure MongoDB connection and set strictQuery to false
mongoose.set('strictQuery', false);
mongoDBConnect();

// Start the server and listen on the specified port
const server = app.listen(process.env.PORT, () => {
  console.log(`Server Listening at PORT - ${process.env.PORT}`);
});

// Initialize Socket.IO server
const io = new Server.Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000', // Specify the allowed origin for Socket.IO
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  // Handle 'setup' event to join a user's room
  socket.on('setup', (userData) => {
    socket.join(userData.id);
    socket.emit('connected');
  });

  // Handle 'join room' event to join a specific room
  socket.on('join room', (room) => {
    socket.join(room);
  });

  // Handle 'typing' event to notify others in the room about typing
  socket.on('typing', (room) => socket.in(room).emit('typing'));

  // Handle 'stop typing' event to notify others in the room about stopping typing
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  // Handle 'new message' event to broadcast a new message to users in the chat
  socket.on('new message', (newMessageRecieve) => {
    // Extract the chat information from the received message
    var chat = newMessageRecieve.chatId;

    // Check if chat.users is defined
    if (!chat.users) console.log('chats.users is not defined');

    // Iterate through chat.users and emit the 'message received' event to each user
    chat.users.forEach((user) => {
      // Skip emitting to the sender
      if (user._id == newMessageRecieve.sender._id) return;

      // Emit the 'message received' event to the user's room
      socket.in(user._id).emit('message received', newMessageRecieve);
    });
  });
});
