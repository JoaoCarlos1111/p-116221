
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// GET /api/cases - Listar todos os casos
router.get('/', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { status, brand, assignedTo, page = 1, limit = 10 } = req.query;

    const filters: any = {};
    
    if (status) filters.status = status;
    if (brand) filters.brandId = brand;
    if (assignedTo) filters.userId = assignedTo;

    const skip = (Number(page) - 1) * Number(limit);

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where: filters,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true }
          },
          brand: {
            select: { id: true, name: true }
          },
          payments: {
            select: { id: true, amount: true, status: true, createdAt: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.case.count({ where: filters })
    ]);

    res.json({
      success: true,
      data: cases,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({
      error: 'Failed to fetch cases',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/cases/:id - Buscar um caso específico
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;

    const case_ = await prisma.case.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, mainDepartment: true }
        },
        brand: {
          select: { id: true, name: true }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!case_) {
      return res.status(404).json({
        error: 'Case not found',
        message: 'The requested case does not exist'
      });
    }

    res.json({
      success: true,
      data: case_
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({
      error: 'Failed to fetch case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/cases - Criar um novo caso
router.post('/', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const {
      code,
      debtorName,
      totalAmount,
      currentPayment,
      status = 'novo',
      userId,
      brandId
    } = req.body;

    // Validações
    if (!code || !debtorName || !totalAmount || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Code, debtor name, total amount, and assigned user are required'
      });
    }

    // Verificar se o código já existe
    const existingCase = await prisma.case.findUnique({
      where: { code }
    });

    if (existingCase) {
      return res.status(400).json({
        error: 'Case code already exists',
        message: 'A case with this code already exists'
      });
    }

    const newCase = await prisma.case.create({
      data: {
        code,
        debtorName,
        totalAmount: Number(totalAmount),
        currentPayment: Number(currentPayment) || 0,
        status,
        userId,
        brandId: brandId || null
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        brand: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: newCase
    });
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({
      error: 'Failed to create case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/cases/:id - Atualizar um caso
router.put('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;
    const {
      debtorName,
      totalAmount,
      currentPayment,
      status,
      userId,
      brandId,
      daysInColumn
    } = req.body;

    const updateData: any = {};
    
    if (debtorName !== undefined) updateData.debtorName = debtorName;
    if (totalAmount !== undefined) updateData.totalAmount = Number(totalAmount);
    if (currentPayment !== undefined) updateData.currentPayment = Number(currentPayment);
    if (status !== undefined) updateData.status = status;
    if (userId !== undefined) updateData.userId = userId;
    if (brandId !== undefined) updateData.brandId = brandId;
    if (daysInColumn !== undefined) updateData.daysInColumn = Number(daysInColumn);

    const updatedCase = await prisma.case.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        brand: {
          select: { id: true, name: true }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json({
      success: true,
      data: updatedCase
    });
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({
      error: 'Failed to update case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/cases/:id - Deletar caso (ou arquivamento lógico)
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;

    // Verificar se o caso existe
    const existingCase = await prisma.case.findUnique({
      where: { id }
    });

    if (!existingCase) {
      return res.status(404).json({
        error: 'Case not found',
        message: 'The case to delete does not exist'
      });
    }

    // Deletar caso e seus pagamentos relacionados
    await prisma.$transaction([
      prisma.payment.deleteMany({
        where: { caseId: id }
      }),
      prisma.case.delete({
        where: { id }
      })
    ]);

    res.json({
      success: true,
      message: 'Case deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting case:', error);
    res.status(500).json({
      error: 'Failed to delete case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
