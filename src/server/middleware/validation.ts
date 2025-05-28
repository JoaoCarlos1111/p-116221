import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Tipos para validação
export interface ValidationSchemas {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
}



// Middleware de validação principal
export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar body
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      // Validar params
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      // Validar query
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Invalid input data',
          details: formattedErrors
        });
      }

      // Erro não esperado
      console.error('Unexpected validation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred during validation'
      });
    }
  };
};

// Schemas comuns reutilizáveis
export const CommonSchemas = {
  // Paginação
  pagination: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10')
  }),

  // ID obrigatório
  mongoId: z.object({
    id: z.string().min(1, 'ID is required')
  }),

  // Filtros de data
  dateFilters: z.object({
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    status: z.string().optional(),
    brand: z.string().optional()
  }).refine(data => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo);
    }
    return true;
  }, {
    message: 'dateFrom must be before or equal to dateTo',
    path: ['dateFrom']
  }),

  // Email válido
  email: z.string().email('Invalid email format'),

  // Senha forte
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  // Status do caso
  caseStatus: z.enum(['novo', 'em_andamento', 'aguardando_aprovacao', 'resolvido', 'cancelado']),

  // Departamentos válidos
  department: z.enum(['admin', 'prospeccao', 'verificacao', 'auditoria', 'logistica', 'ip_tools', 'atendimento', 'financeiro']),

  // Perfil do cliente
  clientProfile: z.enum(['comum', 'gestor', 'analista_contrafacao', 'financeiro'])
};

// Schemas específicos para cada operação
export const ValidationSchemas = {
  // Auth
  login: {
    body: z.object({
      email: CommonSchemas.email,
      password: z.string().min(1, 'Password is required')
    })
  },

  register: {
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: CommonSchemas.email,
      password: CommonSchemas.password,
      mainDepartment: CommonSchemas.department,
      departments: z.array(CommonSchemas.department).optional().default([]),
      isAdmin: z.boolean().optional().default(false),
      isClient: z.boolean().optional().default(false),
      clientProfile: CommonSchemas.clientProfile.optional(),
      company: z.string().optional()
    })
  },

  // Cases
  createCase: {
    body: z.object({
      code: z.string().min(1, 'Case code is required'),
      debtorName: z.string().min(1, 'Debtor name is required'),
      totalAmount: z.number().positive('Total amount must be positive'),
      currentPayment: z.number().min(0, 'Current payment cannot be negative').optional().default(0),
      status: CommonSchemas.caseStatus.optional().default('novo'),
      userId: z.string().min(1, 'Assigned user is required'),
      brandId: z.string().optional()
    })
  },

  updateCase: {
    params: CommonSchemas.mongoId,
    body: z.object({
      debtorName: z.string().min(1).optional(),
      totalAmount: z.number().positive().optional(),
      currentPayment: z.number().min(0).optional(),
      status: CommonSchemas.caseStatus.optional(),
      userId: z.string().optional(),
      brandId: z.string().optional(),
      daysInColumn: z.number().min(0).optional()
    })
  },

  getCases: {
    query: CommonSchemas.pagination.extend({
      status: CommonSchemas.caseStatus.optional(),
      brand: z.string().optional(),
      assignedTo: z.string().optional()
    })
  },

  // Users
  createUser: {
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: CommonSchemas.email,
      password: CommonSchemas.password,
      mainDepartment: CommonSchemas.department,
      departments: z.array(CommonSchemas.department).optional().default([]),
      brands: z.array(z.string()).optional().default([]),
      isAdmin: z.boolean().optional().default(false),
      isClient: z.boolean().optional().default(false),
      clientProfile: CommonSchemas.clientProfile.optional(),
      company: z.string().optional()
    })
  },

  updateUser: {
    params: CommonSchemas.mongoId,
    body: z.object({
      name: z.string().min(2).optional(),
      email: CommonSchemas.email.optional(),
      password: CommonSchemas.password.optional(),
      mainDepartment: CommonSchemas.department.optional(),
      departments: z.array(CommonSchemas.department).optional(),
      brands: z.array(z.string()).optional(),
      isAdmin: z.boolean().optional(),
      isActive: z.boolean().optional(),
      isClient: z.boolean().optional(),
      clientProfile: CommonSchemas.clientProfile.optional(),
      company: z.string().optional()
    })
  },

  getUsers: {
    query: CommonSchemas.pagination.extend({
      department: CommonSchemas.department.optional(),
      isActive: z.string().transform(val => val === 'true').optional()
    })
  },

  // Payments
  createPayment: {
    body: z.object({
      caseId: z.string().min(1, 'Case ID is required'),
      amount: z.number().positive('Amount must be positive'),
      method: z.enum(['pix', 'bank_transfer', 'credit_card', 'boleto']),
      status: z.enum(['pending', 'completed', 'failed', 'cancelled']).optional().default('pending'),
      description: z.string().optional()
    })
  },

  // Brands
  createBrand: {
    body: z.object({
      name: z.string().min(1, 'Brand name is required'),
      description: z.string().optional(),
      isActive: z.boolean().optional().default(true)
    })
  },

  // Metrics
  getMetrics: {
    query: CommonSchemas.dateFilters
  }
};