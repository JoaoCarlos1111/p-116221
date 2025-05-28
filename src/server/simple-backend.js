
console.log('🚀 INICIANDO SERVIDOR BACKEND...');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

console.log('✅ Express carregado');

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

console.log('✅ Middlewares configurados');

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('🔑 LOGIN RECEBIDO:', req.body);
  
  res.status(200).json({
    success: true,
    token: 'token-funcionando-123',
    user: {
      id: '1',
      name: 'Usuario Teste',
      email: req.body.email || 'test@test.com',
      role: 'admin',
      department: 'atendimento',
      isAdmin: true
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check');
  res.json({ status: 'OK' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉🎉🎉 SERVIDOR FUNCIONANDO! 🎉🎉🎉');
  console.log(`✅ Porta: ${PORT}`);
  console.log(`✅ Login: http://0.0.0.0:${PORT}/api/auth/login`);
  console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
  console.log('');
});

console.log('📍 Script carregado - aguardando inicialização...');
