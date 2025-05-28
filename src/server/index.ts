import express from 'express';
import cors from 'cors';

console.log('🔧 Server starting...');

const app = express();
const PORT = 3001;

// Basic middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint accessed');
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString() 
  });
});

// Auth endpoint for login
app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Login endpoint accessed');
  console.log('Request body:', req.body);

  // Temporary response for testing
  res.status(200).json({
    success: true,
    token: 'test-token',
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      department: 'test',
      mainDepartment: 'test',
      departments: ['test'],
      isAdmin: true,
      isClient: false
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🔗 Test API: http://0.0.0.0:${PORT}/api/test`);
});

console.log('📍 Server file loaded');