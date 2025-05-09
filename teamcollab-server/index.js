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

// HTTP + Socket.IO setup
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

// ✅ Allowed origins list
const allowedOrigins = [
  'https://teamcollab-3261.vercel.app',       // Production frontend
  /\.vercel\.app$/                             // All Vercel preview URLs
];

// ✅ CORS middleware for Express
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o =>
      (typeof o === 'string' && o === origin) ||
      (o instanceof RegExp && o.test(origin))
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// ✅ Socket.IO setup with matching CORS config
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(o =>
        (typeof o === 'string' && o === origin) ||
        (o instanceof RegExp && o.test(origin))
      )) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by Socket.IO CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Inject io instance to all requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', aiRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('🎉 TeamCollab API is up and running!');
});
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from TeamCollab API' });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
