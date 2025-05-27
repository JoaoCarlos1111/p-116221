
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createError } from './errorHandler';

// Rate limiting para login
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many login attempts, please try again in 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting geral para APIs
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para criação de recursos
export const createResourceRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 criações por minuto
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many creation requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuração do Helmet para segurança
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false // Para funcionar com desenvolvimento
});

// Middleware para verificar permissões por departamento
export const requireDepartmentAccess = (allowedDepartments: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const user = req.user;

    // Admin tem acesso a tudo
    if (user.isAdmin) {
      return next();
    }

    // Verificar se o usuário tem acesso ao departamento
    const hasAccess = allowedDepartments.some(dept => 
      user.departments.includes(dept) || user.mainDepartment === dept
    );

    if (!hasAccess) {
      throw createError.forbidden(`Access denied. Required departments: ${allowedDepartments.join(', ')}`);
    }

    next();
  };
};

// Middleware para verificar acesso de cliente
export const requireClientProfile = (allowedProfiles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const user = req.user;

    // Verificar se é cliente
    if (!user.isClient) {
      throw createError.forbidden('Client access required');
    }

    // Verificar perfil específico
    if (!allowedProfiles.includes(user.clientProfile || '')) {
      throw createError.forbidden(`Access denied. Required profiles: ${allowedProfiles.join(', ')}`);
    }

    next();
  };
};

// Middleware para verificar ownership de recursos
export const requireOwnership = (resourceUserIdField: string = 'userId') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw createError.unauthorized('Authentication required');
      }

      // Admin pode acessar qualquer recurso
      if (req.user.isAdmin) {
        return next();
      }

      const resourceId = req.params.id;
      const prisma = req.prisma;

      // Buscar o recurso (assumindo que é um caso)
      const resource = await prisma.case.findUnique({
        where: { id: resourceId },
        select: { [resourceUserIdField]: true }
      });

      if (!resource) {
        throw createError.notFound('Resource not found');
      }

      // Verificar se o usuário é o dono do recurso
      if (resource[resourceUserIdField] !== req.user.userId) {
        throw createError.forbidden('You can only access your own resources');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware para sanitizar dados de entrada
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Função para sanitizar strings
  const sanitizeString = (str: string): string => {
    return str.trim().replace(/[<>]/g, '');
  };

  // Função recursiva para sanitizar objetos
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };

  // Sanitizar body, query e params
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Middleware para logging de segurança
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capturar informações da requisição
  const logData = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user ? {
      id: req.user.userId,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      isClient: req.user.isClient
    } : null,
    timestamp: new Date().toISOString()
  };

  // Log de requisições sensíveis
  const sensitiveRoutes = ['/auth/', '/admin/', '/users/'];
  const isSensitive = sensitiveRoutes.some(route => req.url.includes(route));
  
  if (isSensitive) {
    console.log('🔒 Sensitive Route Access:', logData);
  }

  // Interceptar resposta para log de erros
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    if (res.statusCode >= 400) {
      console.log('⚠️ Security Alert:', {
        ...logData,
        statusCode: res.statusCode,
        responseTime,
        response: data
      });
    }
    
    return originalSend.call(this, data);
  };

  next();
};
