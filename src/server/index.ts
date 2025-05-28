
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Import routes
import authRoutes from './routes/auth.js';
import casesRoutes from './routes/cases.js';
import brandsRoutes from './routes/brands.js';
import usersRoutes from './routes/users.js';
import templatesRoutes from './routes/templates.js';
import metricsRoutes from './routes/metrics.js';
import paymentsRoutes from './routes/payments.js';
import emailRoutes from './routes/email.js';
import whatsappRoutes from './routes/whatsapp.js';
import integrationsRoutes from './routes/integrations.js';
import eventsRoutes from './routes/events.js';
import interactionsRoutes from './routes/interactions.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Basic middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/interactions', interactionsRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Use port 3001 for development
const PORT = 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export { io };
