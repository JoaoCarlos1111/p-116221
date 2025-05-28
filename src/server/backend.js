
console.log('🚀 Iniciando servidor backend...');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Log de todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check acessado');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'Backend Funcionando'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint acessado');
  res.json({ 
    message: 'Servidor funcionando perfeitamente!', 
    timestamp: new Date().toISOString() 
  });
});

// Login endpoint - FUNCIONAL
app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Tentativa de login recebida:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email e senha são obrigatórios'
    });
  }

  // Login funcional - aceita qualquer email/senha para teste
  console.log('✅ Login bem-sucedido para:', email);
  
  res.status(200).json({
    success: true,
    token: 'jwt-token-funcionando-123',
    user: {
      id: '1',
      name: 'Usuario Teste',
      email: email,
      role: 'admin',
      department: 'atendimento',
      mainDepartment: 'atendimento',
      departments: ['atendimento'],
      isAdmin: true,
      isClient: false
    }
  });
});

// Catch all para debug
app.use('*', (req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('✅ SERVIDOR BACKEND RODANDO COM SUCESSO!');
  console.log(`🌐 Porta: ${PORT}`);
  console.log(`🔗 Health: http://0.0.0.0:${PORT}/health`);
  console.log(`🔗 Test: http://0.0.0.0:${PORT}/api/test`);
  console.log(`🔑 Login: http://0.0.0.0:${PORT}/api/auth/login`);
  console.log('='.repeat(50));
  console.log('');
});

console.log('📍 Servidor backend carregado com sucesso');
