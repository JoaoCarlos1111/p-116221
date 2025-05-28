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
import { notFoundHandler, errorHandler } from './middleware/error';
import eventsRoutes from './routes/events';
import path from 'path';
import { fileURLToPath } from 'url';
import { servicesMiddleware, setSocketIO } from './middleware/services';

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
}
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

setSocketIO(io);

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
    // Don't throw - services are optional for basic functionality
  }
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Production security middleware
if (process.env.NODE_ENV === 'production') {
  const { securityHeaders, generalRateLimit } = require('./middleware/security');
  app.use(securityHeaders);
  app.use('/api', generalRateLimit);
}

// Make services available to routes with lazy loading
app.use(servicesMiddleware);

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


// Health check
app.get('/health', async (req, res) => {
  try {
    const dbCheck = await prisma.user.count();
    const memoryUsage = process.memoryUsage();

    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB'
      },
      services: {
        whatsapp: whatsappService ? 'initialized' : 'not initialized',
        email: emailService ? 'initialized' : 'not initialized',
        eventQueue: 'active'
      }
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

// Production test endpoint
app.get('/api/production-test', async (req, res) => {
  try {
    const { runProductionTests } = await import('./utils/healthTest');
    const results = await runProductionTests();

    const hasFailures = results.some(test => test.status === 'FAIL');

    res.status(hasFailures ? 500 : 200).json({
      success: !hasFailures,
      timestamp: new Date().toISOString(),
      tests: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to run production tests',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve static files for production SPA routing
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res, next) => {
    // Skip API routes and health check
    if (req.path.startsWith('/api/') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Error handling middlewares (devem ser os últimos)
app.use(notFoundHandler);
app.use(errorHandler);

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

// Use port 8080 for deployment (matches port forwarding to external port 80)
const PORT = process.env.PORT || 8080;

// Start server with proper error handling
async function startServer() {
  try {
    // Initialize services first
    await initializeServices();

    await new Promise<void>((resolve, reject) => {
      const serverInstance = server.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Backend server running on port ${PORT}`);
        console.log(`🔗 API URL: http://0.0.0.0:${PORT}`);
        console.log(`📡 Socket.IO ready for connections`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || '*'}`);
        console.log(`✅ Server listening and ready for requests`);
        resolve();
      });

      serverInstance.on('error', (error: any) => {
        console.error('❌ Server error:', error);
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Port ${PORT} is already in use`);
        }
        reject(error);
      });

      // Set timeout for server startup
      setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 30000);
    });

    console.log('✅ Server and services fully initialized');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { io, whatsappService };