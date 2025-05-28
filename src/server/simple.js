
const express = require('express');
const cors = require('cors');

console.log('🚀 Iniciando servidor backend...');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

console.log('✅ Middlewares configurados');

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check');
  res.json({ status: 'OK', port: PORT });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Login recebido:', req.body);
  
  res.json({
    success: true,
    token: 'token123',
    user: {
      id: '1',
      name: 'Usuario',
      email: req.body.email || 'test@test.com',
      role: 'admin',
      department: 'atendimento',
      mainDepartment: 'atendimento',
      departments: ['atendimento'],
      isAdmin: true,
      isClient: false
    }
  });
});

// Catch all
app.use('*', (req, res) => {
  console.log('❓ Rota não encontrada:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉 SERVIDOR BACKEND FUNCIONANDO!');
  console.log(`✅ Porta: ${PORT}`);
  console.log(`✅ URL: http://0.0.0.0:${PORT}`);
  console.log('');
});

console.log('📍 Script carregado');
