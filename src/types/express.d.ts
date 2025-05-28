import WhatsAppService from '../server/services/whatsapp';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      whatsappService?: WhatsAppService;
      emailService?: any;
      io?: SocketIOServer;
      prisma?: PrismaClient;
    }
  }
}