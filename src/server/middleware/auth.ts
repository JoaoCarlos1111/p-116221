
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secure-jwt-token-for-tbp-application';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        departments: string[];
        mainDepartment: string;
        isAdmin: boolean;
        isClient?: boolean;
        clientProfile?: string;
        brands?: string[];
        company?: string;
      }
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided',
        message: 'Access token is required'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided',
        message: 'Access token is required'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        departments: string[];
        mainDepartment: string;
        isAdmin: boolean;
        isClient?: boolean;
        clientProfile?: string;
        brands?: string[];
        company?: string;
      };

      // Verificar se o usuário ainda existe e está ativo
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { 
          id: true, 
          isActive: true, 
          email: true,
          mainDepartment: true,
          isAdmin: true,
          isClient: true,
          clientProfile: true
        }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ 
          success: false,
          error: 'User not found or inactive',
          message: 'User account is no longer active'
        });
      }

      // Atualizar dados do usuário no token
      req.user = {
        ...decoded,
        userId: decoded.userId,
        id: decoded.userId // Para compatibilidade
      };

      next();
    } catch (jwtError) {
      console.error('Token verification failed:', jwtError);
      
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          success: false,
          error: 'Token expired',
          message: 'Access token has expired. Please login again.'
        });
      }
      
      if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid token',
          message: 'Access token is malformed or invalid'
        });
      }

      return res.status(401).json({ 
        success: false,
        error: 'Authentication failed',
        message: 'Failed to authenticate token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Authentication service temporarily unavailable'
    });
  }
};

export const requireDepartment = (department: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Not authenticated',
        message: 'User authentication required'
      });
    }

    if (req.user.isAdmin || req.user.departments.includes(department)) {
      next();
    } else {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `Access to ${department} department required`
      });
    }
  };
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      message: 'User authentication required'
    });
  }

  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'Administrator access required'
    });
  }
};

export const requireClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      message: 'User authentication required'
    });
  }

  if (req.user.isClient) {
    next();
  } else {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'Client access required'
    });
  }
};
