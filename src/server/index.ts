
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

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
