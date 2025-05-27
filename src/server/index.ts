
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import integrationRoutes, { initializeIntegrationServices } from './routes/integrations';
import templateRoutes from './routes/templates';

const app = express();
const server = createServer(app);

// Socket.IO setup with proper CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join_user', (userId) => {
    const room = `user_${userId}`;
    socket.join(room);
    console.log(`👤 User ${userId} joined room: ${room}`);

    // Send connection confirmation
    socket.emit('connected', { 
      userId, 
      socketId: socket.id,
      room: room
    });
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 User disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// Initialize integration services with Socket.IO
console.log('🚀 Starting server initialization...');
initializeIntegrationServices(io);

// Routes
app.use('/api/integrations', integrationRoutes);
app.use('/api/templates', templateRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'running',
    socketio: 'active'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ 
    success: false, 
    error: error.message 
  });
});

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log(`🔌 Socket.IO server ready`);
  console.log(`📱 WhatsApp service ready`);
  console.log(`📧 Email service ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
