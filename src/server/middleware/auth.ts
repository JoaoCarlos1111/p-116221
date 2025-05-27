
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

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No token provided',
      message: 'Access token is required'
    });
  }

  const token = authHeader.split(' ')[1];

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

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Access token is invalid or expired'
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
