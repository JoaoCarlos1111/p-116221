import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import integrationsRoutes from './routes/integrations';
import templatesRoutes from './routes/templates';
import authRoutes from './routes/auth';
import casesRoutes from './routes/cases';
import usersRoutes from './routes/users';
import paymentsRoutes from './routes/payments';
import brandsRoutes from './routes/brands';
import { authMiddleware } from './middleware/auth';
import WhatsAppService from './services/whatsapp';
import prisma from './lib/prisma';

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Initialize services
const whatsappService = new WhatsAppService(io);
let emailService: any;

// Import and initialize email service
async function initializeServices() {
  try {
    const EmailService = (await import('./services/email')).default;
    emailService = new EmailService(io);
    console.log('✅ All services initialized');
  } catch (error) {
    console.error('❌ Error initializing services:', error);
  }
}

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Make services available to routes
app.use((req, res, next) => {
  req.whatsappService = whatsappService;
  req.emailService = emailService;
  req.io = io;
  req.prisma = prisma;
  next();
});

// Authentication routes (public)
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/integrations', authMiddleware, integrationsRoutes);
app.use('/api/templates', authMiddleware, templatesRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/brands', brandsRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.user.count();
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
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

// Use port 3001 for backend API
const PORT = process.env.PORT || 3001;

// Initialize services and start server
initializeServices().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`🔗 API URL: http://0.0.0.0:${PORT}`);
    console.log(`📡 Socket.IO ready for connections`);
  });
});

export { io, whatsappService };