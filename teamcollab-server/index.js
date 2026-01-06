// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const aiRoutes = require('./routes/ai');



const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const activityRoutes = require('./routes/activities');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create HTTP + WebSocket server
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: [
      'http://localhost:5173',
      'https://teamcollab-alpha.vercel.app'
    ]
  }
});

// Inject io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://teamcollab-alpha.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', aiRoutes);


// Root routes
app.get('/', (req, res) => {
  res.send('🎉 TeamCollab API is up and running!');
});
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from TeamCollab API' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start the WebSocket + HTTP server
server.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
