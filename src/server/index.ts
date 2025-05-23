import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: ['http://localhost:8080', 'http://0.0.0.0:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message });
});
app.use(express.json());

// Log das requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rotas de Usuários
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
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
    res.status(500).json({ error: 'Erro ao buscar casos' });
  }
});

app.post('/api/cases', async (req, res) => {
  try {
    const newCase = await prisma.case.create({
      data: req.body,
      include: {
        assignedTo: true
      }
    });
    res.json(newCase);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar caso' });
  }
});

app.post('/api/cases/batch', async (req, res) => {
  try {
    const { cases } = req.body;
    const createdCases = await prisma.$transaction(
      cases.map((caseData: any) => 
        prisma.case.create({
          data: {
            code: Math.random().toString(36).substring(7),
            debtorName: caseData.brand,
            totalAmount: 0,
            currentPayment: 0,
            status: caseData.status,
            daysInColumn: 0,
            userId: "1", // Temporary default user ID
            ...caseData
          }
        })
      )
    );
    res.json(createdCases);
  } catch (error) {
    console.error('Error creating cases:', error);
    res.status(500).json({ error: 'Erro ao criar casos em lote' });
  }
});

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
    res.status(500).json({ error: 'Erro ao buscar pagamentos' });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log('CORS enabled for all origins');
});