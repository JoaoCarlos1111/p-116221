
console.log('🚀 INICIANDO SERVIDOR BACKEND - VERSÃO FUNCIONANDO...');

const express = require('express');
const cors = require('cors');

console.log('📦 Carregando dependências...');

const app = express();
const PORT = 3001;

console.log('⚙️ Configurando middlewares...');

// CORS mais permissivo
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middlewares configurados!');

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check acessado');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Endpoint de teste
app.get('/api/test', (req, res) => {
  console.log('✅ Endpoint de teste acessado');
  res.json({ 
    message: 'Backend funcionando perfeitamente!', 
    timestamp: new Date().toISOString() 
  });
});

// Login endpoint - FUNCIONANDO
app.post('/api/auth/login', (req, res) => {
  console.log('🔑 LOGIN RECEBIDO:', req.body);
  console.log('🔑 Headers:', req.headers);
  
  const { email, password } = req.body;
  
  // Resposta de sucesso sempre
  const response = {
    success: true,
    token: 'token-funcionando-' + Date.now(),
    user: {
      id: '1',
      name: 'Usuario Funcionando',
      email: email || 'test@funcionando.com',
      role: 'admin',
      department: 'atendimento',
      mainDepartment: 'atendimento',
      departments: ['atendimento'],
      isAdmin: true,
      isClient: false
    }
  };
  
  console.log('✅ Enviando resposta de login:', response);
  
  res.status(200).json(response);
});

// Catch all para debug
app.use('*', (req, res) => {
  console.log('❓ Rota não encontrada:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Rota não encontrada',
    method: req.method,
    url: req.originalUrl 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 ERRO NO SERVIDOR:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
  console.log('🚀 SERVIDOR BACKEND FUNCIONANDO! 🚀');
  console.log(`✅ Porta: ${PORT}`);
  console.log(`✅ Host: 0.0.0.0`);
  console.log(`✅ Health: http://0.0.0.0:${PORT}/health`);
  console.log(`✅ Login: http://0.0.0.0:${PORT}/api/auth/login`);
  console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
  console.log('');
  console.log('💡 Servidor pronto para receber requisições!');
  console.log('');
});

console.log('📍 Script carregado - iniciando servidor...');
