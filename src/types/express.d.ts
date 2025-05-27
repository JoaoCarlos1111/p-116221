
import WhatsAppService from '../server/services/whatsapp';
import { Server as SocketIOServer } from 'socket.io';

declare global {
  namespace Express {
    interface Request {
      whatsappService?: WhatsAppService;
      io?: SocketIOServer;
    }
  }
}
