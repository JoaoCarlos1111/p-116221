import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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
          data: caseData
        })
      )
    );
    res.json(createdCases);
  } catch (error) {
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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});