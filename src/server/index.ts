const express = require('express');
const cors = require('cors');

console.log('🚀 Starting server...');

const app = express();
const PORT = 3001;

// Middleware básico
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check accessed');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint accessed');
  res.json({ message: 'Server working!', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Login attempt:', req.body);

  // Simulação de login para teste
  res.status(200).json({
    success: true,
    token: 'fake-jwt-token-123',
    user: {
      id: '1',
      name: 'Usuario Teste',
      email: req.body.email || 'test@example.com',
      role: 'admin',
      department: 'atendimento',
      mainDepartment: 'atendimento',
      departments: ['atendimento'],
      isAdmin: true,
      isClient: false
    }
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🔗 Health: http://0.0.0.0:${PORT}/health`);
  console.log(`🔗 Test: http://0.0.0.0:${PORT}/api/test`);
  console.log(`🔗 Login: http://0.0.0.0:${PORT}/api/auth/login`);
});

console.log('📍 Server script loaded successfully');