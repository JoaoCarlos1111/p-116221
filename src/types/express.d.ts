import { PrismaClient } from '@prisma/client';
import { Server as SocketIOServer } from 'socket.io';
import WhatsAppService from '../server/services/whatsapp';
import EmailService from '../server/services/email';

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
      };
      prisma?: PrismaClient;
      io?: SocketIOServer;
      whatsappService?: WhatsAppService;
      emailService?: EmailService;
    }
  }
}