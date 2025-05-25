
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import templatesRouter from './routes/templates';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Inicializar o Prisma com tratamento de erro
let prisma: PrismaClient;
try {
  prisma = new PrismaClient();
  console.log('Prisma inicializado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar Prisma:', error);
  process.exit(1);
}

// Configuração do CORS para permitir qualquer origem
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Confirm-Delete']
}));

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware para parsing do body como JSON
app.use(express.json());

// Middleware para verificar se o Prisma está conectado
app.use(async (req, res, next) => {
  try {
    // Skip health check route
    if (req.url === '/api/health') {
      return next();
    }
    
    // Verifica a conexão com o banco de dados
    await prisma.$queryRaw`SELECT 1`;
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection error',
      message: 'Could not connect to the database. Please try again later.'
    });
  }
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Rotas de Usuários
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
});

// Rotas de Casos
app.get('/api/cases', async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      include: {
        assignedTo: true,
        payments: true
      }
    });
    res.json(cases);
  } catch (error) {
    console.error('Erro ao buscar casos:', error);
    res.status(500).json({ error: 'Erro ao buscar casos', details: error.message });
  }
});

app.post('/api/cases', async (req, res) => {
  try {
    const newCase = await prisma.case.create({
      data: {
        ...req.body,
        code: req.body.code || Math.random().toString(36).substring(7),
        status: req.body.status || 'received',
        daysInColumn: req.body.daysInColumn || 0,
        totalAmount: req.body.totalAmount || 0,
        currentPayment: req.body.currentPayment || 0,
        userId: req.body.userId || "1"
      },
      include: {
        assignedTo: true
      }
    });
    res.json(newCase);
  } catch (error) {
    console.error('Erro ao criar caso:', error);
    res.status(500).json({ error: 'Erro ao criar caso', details: error.message });
  }
});

app.post('/api/cases/batch', async (req, res) => {
  try {
    console.log('Received batch request:', req.body);
    const { cases } = req.body;
    
    if (!cases || !Array.isArray(cases)) {
      console.error('Invalid request format. Expected cases array.');
      return res.status(400).json({ error: 'Formato de requisição inválido. Array de casos esperado.' });
    }
    
    // Verificar se há um usuário padrão
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      // Criar um usuário padrão se não existir nenhum
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: 'admin123', // Em produção, deve ser hash
          name: 'Administrador',
          role: 'admin',
          isActive: true
        }
      });
    }
    
    const userId = defaultUser?.id || "1";
    
    const createdCases = await prisma.$transaction(
      cases.map(caseData => 
        prisma.case.create({
          data: {
            code: Math.random().toString(36).substring(7),
            debtorName: caseData.brand || '',
            storeUrl: caseData.storeUrl || '',
            adUrl: caseData.adUrl || '',
            totalAmount: 0,
            currentPayment: 0,
            status: caseData.status || 'received',
            daysInColumn: 0,
            userId: userId
          }
        })
      )
    );
    
    console.log('Created cases:', createdCases.length);
    res.json(createdCases);
  } catch (error) {
    console.error('Error creating cases:', error);
    res.status(500).json({ error: 'Erro ao criar casos em lote', details: error.message });
  }
});

// Rotas de Templates
app.use('/api/templates', templatesRouter);

// Rotas de Pagamentos
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        case: true
      }
    });
    res.json(payments);
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar pagamentos', details: error.message });
  }
});

// Teste de conexão com o banco de dados
app.get('/api/test', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Middleware de erro global (deve ser o último middleware)
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message });
});

// Inicializar o servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log('CORS enabled for all origins');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
