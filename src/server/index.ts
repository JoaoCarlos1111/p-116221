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
import emailRoutes from './routes/email';
import whatsappRoutes from './routes/whatsapp';
import interactionsRoutes from './routes/interactions';
import metricsRoutes from './routes/metrics';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import eventsRoutes from './routes/events';
import path from 'path';

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
let whatsappService: WhatsAppService;

try {
  whatsappService = new WhatsAppService(io);
  console.log('✅ WhatsApp service initialized');
} catch (error) {
  console.warn('⚠️ WhatsApp service failed to initialize:', error);
  // Create a dummy service that logs warnings instead of crashing
  whatsappService = {
    initializeSession: async () => { 
      console.warn('WhatsApp service not available'); 
      return ''; 
    },
    disconnectSession: async () => { 
      console.warn('WhatsApp service not available'); 
    },
    sendMessage: async () => { 
      console.warn('WhatsApp service not available'); 
      return false; 
    },
    getSessionStatus: () => ({ connected: false })
  } as any;
}
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')));
}

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
app.use('/api/email', emailRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/interactions', interactionsRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/brands', brandsRoutes);

// Health check endpoint
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

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  // Handle specific common routes first
  const commonRoutes = [
    '/dashboard', '/pipeline', '/cases', '/analytics', '/settings',
    '/integrations', '/admin', '/client', '/atendimento', '/financeiro',
    '/logistics', '/audit', '/ip-tools', '/notifications', '/profile'
  ];
  
  commonRoutes.forEach(route => {
    app.get(route, (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
    
    // Handle sub-routes with parameters
    app.get(`${route}/:id`, (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
    
    app.get(`${route}/:id/:action`, (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  });
  
  // Handle root route
  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

// Error handling middlewares (devem ser os últimos)
app.use(notFoundHandler);
app.use(errorHandler);



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

// Use port from environment or 3001 for development
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 3001;

// Initialize services and start server
initializeServices().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🎉 =================================');
    console.log('🎉 BACKEND ROBUSTO FUNCIONANDO!');
    console.log('🎉 =================================');
    console.log(`🚀 Servidor rodando na porta: ${PORT}`);
    console.log(`🔗 API URL: http://0.0.0.0:${PORT}`);
    console.log(`📡 Socket.IO ready for connections`);
    console.log(`🗄️ Database: ${process.env.DATABASE_URL ? 'Conectado' : 'Local SQLite'}`);
    console.log('🎉 =================================');
    console.log('');
  });
}).catch((error) => {
  console.error('❌ Erro ao inicializar serviços:', error);
  process.exit(1);
});

export { io, whatsappService };