import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import integrationsRoutes from './routes/integrations';
import templatesRoutes from './routes/templates';
import WhatsAppService from './services/whatsapp';

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize WhatsApp service with Socket.IO
const whatsappService = new WhatsAppService(io);

// Middleware
app.use(cors());
app.use(express.json());

// Make services available to routes
app.use((req, res, next) => {
  req.whatsappService = whatsappService;
  req.io = io;
  next();
});

// Routes
app.use('/api/integrations', integrationsRoutes);
app.use('/api/templates', templatesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('join_user', (userId) => {
    console.log(`🏠 User ${userId} joined room: user_${userId}`);
    socket.join(`user_${userId}`);
    socket.emit('connected', { userId, room: `user_${userId}` });
  });

  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Server URL: http://0.0.0.0:${PORT}`);
});

export { io, whatsappService };