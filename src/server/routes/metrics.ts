
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { MetricsService } from '../services/metrics';

const router = Router();

// Aplicar middleware de autenticação
router.use(authMiddleware);

// GET /api/metrics - Endpoint principal que identifica o perfil automaticamente
router.get('/', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const user = req.user;
    const { dateFrom, dateTo, brand, status } = req.query;

    const metricsService = new MetricsService(prisma);
    const filters = {
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      brand: brand as string,
      status: status as string
    };

    let metrics;

    // Identificar tipo de usuário e retornar métricas apropriadas
    if (user.isAdmin || (!user.isClient && user.mainDepartment === 'admin')) {
      // Administradores internos
      metrics = await metricsService.getAdminMetrics(filters);
    } else if (!user.isClient) {
      // Analistas internos por setor
      metrics = await metricsService.getAnalystMetrics(user.id, user.mainDepartment, filters);
    } else {
      // Clientes por perfil
      metrics = await metricsService.getClientMetrics(user.id, user.clientProfile || 'comum', filters);
    }

    res.json({
      success: true,
      data: metrics,
      userProfile: {
        isAdmin: user.isAdmin,
        isClient: user.isClient,
        department: user.mainDepartment,
        clientProfile: user.clientProfile
      }
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/metrics/dashboard/:type - Endpoint específico por tipo de dashboard
router.get('/dashboard/:type', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const user = req.user;
    const { type } = req.params;
    const { dateFrom, dateTo, brand, status } = req.query;

    const metricsService = new MetricsService(prisma);
    const filters = {
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      brand: brand as string,
      status: status as string
    };

    let metrics;

    switch (type) {
      case 'admin':
        metrics = await metricsService.getAdminMetrics(filters);
        break;
      case 'gestor':
        metrics = await metricsService.getClientMetrics(user.id, 'gestor', filters);
        break;
      case 'analista-contrafacao':
        metrics = await metricsService.getClientMetrics(user.id, 'analista_contrafacao', filters);
        break;
      case 'financeiro-cliente':
        metrics = await metricsService.getClientMetrics(user.id, 'financeiro', filters);
        break;
      case 'atendimento':
        metrics = await metricsService.getAnalystMetrics(user.id, 'atendimento', filters);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid dashboard type',
          message: 'Dashboard type not recognized'
        });
    }

    res.json({
      success: true,
      data: metrics,
      dashboardType: type
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/metrics/cases/recent - Casos recentes por perfil
router.get('/cases/recent', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const user = req.user;
    const { limit = 10 } = req.query;

    const whereClause = user.isClient ? { userId: user.id } : {};

    const recentCases = await prisma.case.findMany({
      where: whereClause,
      include: {
        assignedTo: {
          select: { id: true, name: true }
        },
        brand: {
          select: { id: true, name: true }
        },
        payments: {
          select: { amount: true, status: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit)
    });

    res.json({
      success: true,
      data: recentCases
    });
  } catch (error) {
    console.error('Error fetching recent cases:', error);
    res.status(500).json({
      error: 'Failed to fetch recent cases',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/metrics/performance/monthly - Performance mensal
router.get('/performance/monthly', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const user = req.user;
    const { months = 6 } = req.query;

    const monthsBack = Number(months);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const whereClause = user.isClient ? { userId: user.id } : {};

    const monthlyData = await prisma.case.groupBy({
      by: ['createdAt'],
      where: {
        ...whereClause,
        createdAt: {
          gte: startDate
        }
      },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    });

    // Agrupar por mês
    const monthlyStats = monthlyData.reduce((acc: any, item) => {
      const month = new Date(item.createdAt).toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { month, cases: 0 };
      }
      acc[month].cases += item._count.id;
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(monthlyStats)
    });
  } catch (error) {
    console.error('Error fetching monthly performance:', error);
    res.status(500).json({
      error: 'Failed to fetch monthly performance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/metrics/brands/stats - Estatísticas por marca
router.get('/brands/stats', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const user = req.user;

    const whereClause = user.isClient ? { userId: user.id } : {};

    const brandStats = await prisma.case.groupBy({
      by: ['brandId'],
      where: whereClause,
      _count: { id: true },
      _avg: { totalAmount: true }
    });

    const enrichedStats = await Promise.all(
      brandStats.map(async (stat) => {
        const brand = await prisma.brand.findUnique({
          where: { id: stat.brandId || '' },
          select: { name: true }
        });

        const resolvedCases = await prisma.case.count({
          where: {
            ...whereClause,
            brandId: stat.brandId,
            status: 'resolvido'
          }
        });

        return {
          brandId: stat.brandId,
          brandName: brand?.name || 'Sem marca',
          totalCases: stat._count.id,
          resolvedCases,
          avgAmount: stat._avg.totalAmount,
          successRate: stat._count.id > 0 ? (resolvedCases / stat._count.id) * 100 : 0
        };
      })
    );

    res.json({
      success: true,
      data: enrichedStats
    });
  } catch (error) {
    console.error('Error fetching brand stats:', error);
    res.status(500).json({
      error: 'Failed to fetch brand stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
