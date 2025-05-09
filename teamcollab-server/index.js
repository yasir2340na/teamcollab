// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create HTTP + WebSocket server
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

// ✅ Replace with your actual Vercel frontend domain
const FRONTEND_URL = 'https://teamcollab-3261.vercel.app';

// Allow cross-origin for WebSocket connection
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Inject io into every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', aiRoutes);

// Root routes
app.get('/', (req, res) => {
  res.send('🎉 TeamCollab API is up and running!');
});
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from TeamCollab API' });
});

// Handle WebSocket events (basic example)
io.on('connection', (socket) => {
  console.log(`✅ New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
