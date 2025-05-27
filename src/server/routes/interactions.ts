
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticação
router.use(authMiddleware);

// GET /api/interactions/case/:caseId - Buscar interações de um caso
router.get('/case/:caseId', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { caseId } = req.params;
    const { type, direction, page = 1, limit = 50 } = req.query;

    const filters: any = { caseId };
    
    if (type && type !== 'ALL') filters.type = type;
    if (direction) filters.direction = direction;

    const skip = (Number(page) - 1) * Number(limit);

    const [interactions, total] = await Promise.all([
      prisma.interaction.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.interaction.count({ where: filters })
    ]);

    res.json({
      success: true,
      data: interactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({
      error: 'Failed to fetch interactions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/interactions - Criar nova interação
router.post('/', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { caseId, type, direction, content, metadata, attachments } = req.body;

    if (!type || !direction || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Type, direction, and content are required'
      });
    }

    const interaction = await prisma.interaction.create({
      data: {
        caseId,
        type,
        direction,
        content,
        metadata: metadata || {},
        attachments: attachments || [],
        createdBy: req.user?.id
      }
    });

    // Emitir via Socket.IO para atualizar interface em tempo real
    const io = req.io;
    if (io && caseId) {
      io.emit('new_interaction', {
        caseId,
        interaction
      });
    }

    res.status(201).json({
      success: true,
      data: interaction
    });
  } catch (error) {
    console.error('Error creating interaction:', error);
    res.status(500).json({
      error: 'Failed to create interaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/interactions/stats/:caseId - Estatísticas de interações por caso
router.get('/stats/:caseId', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { caseId } = req.params;

    const stats = await prisma.interaction.groupBy({
      by: ['type'],
      where: { caseId },
      _count: { type: true }
    });

    const totalInteractions = await prisma.interaction.count({
      where: { caseId }
    });

    res.json({
      success: true,
      data: {
        total: totalInteractions,
        byType: stats.reduce((acc, stat) => {
          acc[stat.type] = stat._count.type;
          return acc;
        }, {} as Record<string, number>)
      }
    });
  } catch (error) {
    console.error('Error fetching interaction stats:', error);
    res.status(500).json({
      error: 'Failed to fetch interaction stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
