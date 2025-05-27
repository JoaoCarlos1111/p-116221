
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { AuthService } from '../services/auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// GET /api/users - Listar usuários
router.get('/', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { department, isActive, page = 1, limit = 10 } = req.query;

    const filters: any = {};
    
    if (department) filters.mainDepartment = department;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: filters,
        select: {
          id: true,
          email: true,
          name: true,
          mainDepartment: true,
          isAdmin: true,
          isActive: true,
          isClient: true,
          clientProfile: true,
          company: true,
          createdAt: true,
          departments: {
            include: {
              department: true
            }
          },
          brands: {
            include: {
              brand: true
            }
          },
          _count: {
            select: { cases: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.user.count({ where: filters })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/users/:id - Buscar usuário específico
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        mainDepartment: true,
        isAdmin: true,
        isActive: true,
        isClient: true,
        clientProfile: true,
        company: true,
        createdAt: true,
        updatedAt: true,
        departments: {
          include: {
            department: true
          }
        },
        brands: {
          include: {
            brand: true
          }
        },
        cases: {
          select: {
            id: true,
            code: true,
            debtorName: true,
            status: true,
            totalAmount: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/users - Criar novo usuário (apenas admin)
router.post('/', async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can create users'
      });
    }

    const prisma = req.prisma as PrismaClient;
    const {
      name,
      email,
      password,
      mainDepartment,
      departments = [],
      brands = [],
      isAdmin = false,
      isClient = false,
      clientProfile,
      company
    } = req.body;

    // Validações
    if (!name || !email || !password || !mainDepartment) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, password, and main department are required'
      });
    }

    const authService = new AuthService(prisma);
    const user = await authService.createUser({
      name,
      email,
      password,
      mainDepartment,
      departments,
      isAdmin,
      isClient,
      clientProfile,
      company
    });

    // Associar marcas se fornecidas
    if (brands.length > 0) {
      await Promise.all(
        brands.map((brandId: string) =>
          prisma.userBrand.create({
            data: {
              userId: user.id,
              brandId
            }
          })
        )
      );
    }

    // Buscar usuário completo para retorno
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        mainDepartment: true,
        isAdmin: true,
        isActive: true,
        isClient: true,
        clientProfile: true,
        company: true,
        createdAt: true,
        departments: {
          include: {
            department: true
          }
        },
        brands: {
          include: {
            brand: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: fullUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/users/:id - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;
    const {
      name,
      email,
      mainDepartment,
      departments,
      brands,
      isAdmin,
      isActive,
      isClient,
      clientProfile,
      company,
      password
    } = req.body;

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The user to update does not exist'
      });
    }

    // Apenas admin pode alterar outros usuários
    if (!req.user?.isAdmin && req.user?.id !== id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own profile'
      });
    }

    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (mainDepartment !== undefined) updateData.mainDepartment = mainDepartment;
    if (isAdmin !== undefined && req.user?.isAdmin) updateData.isAdmin = isAdmin;
    if (isActive !== undefined && req.user?.isAdmin) updateData.isActive = isActive;
    if (isClient !== undefined && req.user?.isAdmin) updateData.isClient = isClient;
    if (clientProfile !== undefined) updateData.clientProfile = clientProfile;
    if (company !== undefined) updateData.company = company;

    // Hash da senha se fornecida
    if (password) {
      const authService = new AuthService(prisma);
      updateData.password = await authService.hashPassword(password);
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        mainDepartment: true,
        isAdmin: true,
        isActive: true,
        isClient: true,
        clientProfile: true,
        company: true,
        updatedAt: true
      }
    });

    // Atualizar departamentos se fornecidos
    if (departments !== undefined && req.user?.isAdmin) {
      await prisma.userDepartment.deleteMany({
        where: { userId: id }
      });

      if (departments.length > 0) {
        await Promise.all(
          departments.map((deptName: string) =>
            prisma.department.findUnique({ where: { name: deptName } })
              .then(dept => {
                if (dept) {
                  return prisma.userDepartment.create({
                    data: {
                      userId: id,
                      departmentId: dept.id
                    }
                  });
                }
              })
          )
        );
      }
    }

    // Atualizar marcas se fornecidas
    if (brands !== undefined && req.user?.isAdmin) {
      await prisma.userBrand.deleteMany({
        where: { userId: id }
      });

      if (brands.length > 0) {
        await Promise.all(
          brands.map((brandId: string) =>
            prisma.userBrand.create({
              data: {
                userId: id,
                brandId
              }
            })
          )
        );
      }
    }

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/users/:id - Desativar usuário
router.delete('/:id', async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can deactivate users'
      });
    }

    const prisma = req.prisma as PrismaClient;
    const { id } = req.params;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({
      error: 'Failed to deactivate user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
