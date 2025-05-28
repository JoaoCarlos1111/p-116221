
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { Server as SocketIOServer } from 'socket.io';
import prisma from '../lib/prisma';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      io?: SocketIOServer;
      whatsappService?: any;
      emailService?: any;
    }
  }
}

let io: SocketIOServer | undefined;

export const setSocketIO = (socketIO: SocketIOServer) => {
  io = socketIO;
};

export const servicesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.prisma = prisma;
  if (io) req.io = io;
  next();
};
