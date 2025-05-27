
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// GET /api/brands - Listar todas as marcas
router.get('/', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { page = 1, limit = 50, search } = req.query;

    const filters: any = {};
    
    if (search) {
      filters.name = {
        contains: search as string,
        mode: 'insensitive'
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where: filters,
        include: {
          _count: {
            select: { 
              cases: true,
              users: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: Number(limit)
      }),
      prisma.brand.count({ where: filters })
    ]);

    res.json({
      success: true,
      data: brands,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      error: 'Failed to fetch brands',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/brands/:id - Buscar marca específica
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        cases: {
          select: {
            id: true,
            code: true,
            debtorName: true,
            status: true,
            totalAmount: true,
            currentPayment: true,
            createdAt: true,
            assignedTo: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                mainDepartment: true
              }
            }
          }
        },
        _count: {
          select: { 
            cases: true,
            users: true
          }
        }
      }
    });

    if (!brand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The requested brand does not exist'
      });
    }

    // Calcular estatísticas da marca
    const stats = await prisma.case.aggregate({
      where: { brandId: id },
      _sum: { 
        totalAmount: true,
        currentPayment: true
      },
      _count: { id: true }
    });

    const brandWithStats = {
      ...brand,
      stats: {
        totalCases: stats._count.id,
        totalAmount: stats._sum.totalAmount || 0,
        totalPaid: stats._sum.currentPayment || 0,
        pendingAmount: (stats._sum.totalAmount || 0) - (stats._sum.currentPayment || 0)
      }
    };

    res.json({
      success: true,
      data: brandWithStats
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({
      error: 'Failed to fetch brand',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/brands - Criar nova marca
router.post('/', async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can create brands'
      });
    }

    const prisma = req.prisma as PrismaClient;
    const { name } = req.body;

    // Validações
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Brand name is required'
      });
    }

    // Verificar se a marca já existe
    const existingBrand = await prisma.brand.findUnique({
      where: { name: name.trim() }
    });

    if (existingBrand) {
      return res.status(400).json({
        error: 'Brand already exists',
        message: 'A brand with this name already exists'
      });
    }

    const newBrand = await prisma.brand.create({
      data: {
        name: name.trim()
      },
      include: {
        _count: {
          select: { 
            cases: true,
            users: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: newBrand
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({
      error: 'Failed to create brand',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/brands/:id - Atualizar marca
router.put('/:id', async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can update brands'
      });
    }

    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;
    const { name } = req.body;

    // Validações
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Brand name is required'
      });
    }

    // Verificar se a marca existe
    const existingBrand = await prisma.brand.findUnique({
      where: { id }
    });

    if (!existingBrand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The brand to update does not exist'
      });
    }

    // Verificar se não existe outra marca com o mesmo nome
    const duplicateBrand = await prisma.brand.findFirst({
      where: {
        name: name.trim(),
        id: { not: id }
      }
    });

    if (duplicateBrand) {
      return res.status(400).json({
        error: 'Brand name already exists',
        message: 'Another brand with this name already exists'
      });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: { name: name.trim() },
      include: {
        _count: {
          select: { 
            cases: true,
            users: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedBrand
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({
      error: 'Failed to update brand',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/brands/:id - Deletar marca
router.delete('/:id', async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can delete brands'
      });
    }

    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;

    // Verificar se a marca existe
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { cases: true, users: true }
        }
      }
    });

    if (!existingBrand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The brand to delete does not exist'
      });
    }

    // Verificar se há casos ou usuários vinculados
    if (existingBrand._count.cases > 0) {
      return res.status(400).json({
        error: 'Cannot delete brand',
        message: `Cannot delete brand with ${existingBrand._count.cases} associated cases. Please reassign or remove cases first.`
      });
    }

    if (existingBrand._count.users > 0) {
      return res.status(400).json({
        error: 'Cannot delete brand',
        message: `Cannot delete brand with ${existingBrand._count.users} associated users. Please remove user associations first.`
      });
    }

    await prisma.brand.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({
      error: 'Failed to delete brand',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
