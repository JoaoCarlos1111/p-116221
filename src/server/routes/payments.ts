
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// GET /api/payments - Listar todos os pagamentos
router.get('/', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { 
      status, 
      caseId, 
      dateFrom, 
      dateTo, 
      page = 1, 
      limit = 10,
      minAmount,
      maxAmount
    } = req.query;

    const filters: any = {};
    
    if (status) filters.status = status;
    if (caseId) filters.caseId = caseId;
    if (minAmount) filters.amount = { ...filters.amount, gte: Number(minAmount) };
    if (maxAmount) filters.amount = { ...filters.amount, lte: Number(maxAmount) };
    
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) filters.createdAt.lte = new Date(dateTo as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: filters,
        include: {
          case: {
            select: {
              id: true,
              code: true,
              debtorName: true,
              totalAmount: true,
              assignedTo: {
                select: { id: true, name: true, email: true }
              },
              brand: {
                select: { id: true, name: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.payment.count({ where: filters })
    ]);

    // Calcular estatísticas
    const stats = await prisma.payment.aggregate({
      where: filters,
      _sum: { amount: true },
      _avg: { amount: true },
      _count: { id: true }
    });

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      stats: {
        totalAmount: stats._sum.amount || 0,
        averageAmount: stats._avg.amount || 0,
        totalPayments: stats._count.id
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      error: 'Failed to fetch payments',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/payments/:id - Buscar pagamento específico
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        case: {
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true }
            },
            brand: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found',
        message: 'The requested payment does not exist'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      error: 'Failed to fetch payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/payments - Registrar um pagamento
router.post('/', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const {
      amount,
      status = 'pendente',
      caseId
    } = req.body;

    // Validações
    if (!amount || !caseId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Amount and case ID are required'
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be greater than 0'
      });
    }

    // Verificar se o caso existe
    const existingCase = await prisma.case.findUnique({
      where: { id: caseId }
    });

    if (!existingCase) {
      return res.status(404).json({
        error: 'Case not found',
        message: 'The specified case does not exist'
      });
    }

    const newPayment = await prisma.payment.create({
      data: {
        amount: Number(amount),
        status,
        caseId
      },
      include: {
        case: {
          select: {
            id: true,
            code: true,
            debtorName: true,
            totalAmount: true,
            currentPayment: true
          }
        }
      }
    });

    // Atualizar o valor atual do pagamento no caso se confirmado
    if (status === 'confirmado') {
      await prisma.case.update({
        where: { id: caseId },
        data: {
          currentPayment: {
            increment: Number(amount)
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      data: newPayment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      error: 'Failed to create payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/payments/:id - Atualizar pagamento
router.put('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;
    const { amount, status } = req.body;

    // Buscar pagamento atual
    const currentPayment = await prisma.payment.findUnique({
      where: { id },
      include: { case: true }
    });

    if (!currentPayment) {
      return res.status(404).json({
        error: 'Payment not found',
        message: 'The payment to update does not exist'
      });
    }

    const updateData: any = {};
    
    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({
          error: 'Invalid amount',
          message: 'Amount must be greater than 0'
        });
      }
      updateData.amount = Number(amount);
    }
    
    if (status !== undefined) updateData.status = status;

    // Usar transação para atualizar pagamento e caso
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar pagamento
      const updatedPayment = await tx.payment.update({
        where: { id },
        data: updateData,
        include: {
          case: {
            select: {
              id: true,
              code: true,
              debtorName: true,
              totalAmount: true,
              currentPayment: true
            }
          }
        }
      });

      // Recalcular total pago no caso
      if (amount !== undefined || status !== undefined) {
        const confirmedPayments = await tx.payment.aggregate({
          where: {
            caseId: currentPayment.caseId,
            status: 'confirmado'
          },
          _sum: { amount: true }
        });

        await tx.case.update({
          where: { id: currentPayment.caseId },
          data: {
            currentPayment: confirmedPayments._sum.amount || 0
          }
        });
      }

      return updatedPayment;
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      error: 'Failed to update payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/payments/:id - Deletar pagamento
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;

    // Buscar pagamento para recalcular o caso
    const payment = await prisma.payment.findUnique({
      where: { id }
    });

    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found',
        message: 'The payment to delete does not exist'
      });
    }

    await prisma.$transaction(async (tx) => {
      // Deletar pagamento
      await tx.payment.delete({
        where: { id }
      });

      // Recalcular total pago no caso
      const confirmedPayments = await tx.payment.aggregate({
        where: {
          caseId: payment.caseId,
          status: 'confirmado'
        },
        _sum: { amount: true }
      });

      await tx.case.update({
        where: { id: payment.caseId },
        data: {
          currentPayment: confirmedPayments._sum.amount || 0
        }
      });
    });

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      error: 'Failed to delete payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
