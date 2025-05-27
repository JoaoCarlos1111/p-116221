
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Interface para erros customizados
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware principal de tratamento de erros
export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err } as any;
  error.message = err.message;

  // Log do erro para debugging
  console.error('Error Details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Erro de validação Zod
  if (err instanceof ZodError) {
    const message = 'Invalid input data';
    const details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message,
      details
    });
  }

  // Erro customizado da aplicação
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.code || 'Application Error',
      message: error.message
    });
  }

  // Erro do Prisma - Unique constraint
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field';
    return res.status(409).json({
      success: false,
      error: 'Conflict Error',
      message: `A record with this ${field} already exists`
    });
  }

  // Erro do Prisma - Record not found
  if (error.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'The requested resource was not found'
    });
  }

  // Erro do Prisma - Foreign key constraint
  if (error.code === 'P2003') {
    return res.status(400).json({
      success: false,
      error: 'Reference Error',
      message: 'Invalid reference to related resource'
    });
  }

  // Erro de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error',
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error',
      message: 'Token has expired'
    });
  }

  // Erro de Cast (MongoDB ObjectId inválido)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'Invalid resource ID format'
    });
  }

  // Erro padrão do servidor
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: error
    })
  });
};

// Middleware para capturar rotas não encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, true, 'ROUTE_NOT_FOUND');
  next(error);
};

// Wrapper para async functions
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Utilitários para criar erros específicos
export const createError = {
  badRequest: (message: string = 'Bad Request') => 
    new AppError(message, 400, true, 'BAD_REQUEST'),
  
  unauthorized: (message: string = 'Unauthorized') => 
    new AppError(message, 401, true, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Forbidden') => 
    new AppError(message, 403, true, 'FORBIDDEN'),
  
  notFound: (message: string = 'Resource not found') => 
    new AppError(message, 404, true, 'NOT_FOUND'),
  
  conflict: (message: string = 'Resource already exists') => 
    new AppError(message, 409, true, 'CONFLICT'),
  
  tooManyRequests: (message: string = 'Too many requests') => 
    new AppError(message, 429, true, 'TOO_MANY_REQUESTS'),
  
  internal: (message: string = 'Internal server error') => 
    new AppError(message, 500, true, 'INTERNAL_ERROR')
};
