
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import { Server as SocketIOServer } from 'socket.io';

interface WhatsAppSession {
  userId: string;
  client: Client;
  isReady: boolean;
  qrCode?: string;
  phone?: string;
}

class WhatsAppService {
  private sessions: Map<string, WhatsAppSession> = new Map();
  private io?: SocketIOServer;

  constructor(io?: SocketIOServer) {
    this.io = io;
  }

  async initializeSession(userId: string): Promise<string> {
    if (this.sessions.has(userId)) {
      await this.disconnectSession(userId);
    }

    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: `user_${userId}`
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    const session: WhatsAppSession = {
      userId,
      client,
      isReady: false
    };

    // QR Code generation
    client.on('qr', async (qr) => {
      try {
        const qrCodeDataURL = await QRCode.toDataURL(qr);
        session.qrCode = qrCodeDataURL;
        this.io?.to(`user_${userId}`).emit('whatsapp_qr', { qrCode: qrCodeDataURL });
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    });

    // Ready event
    client.on('ready', () => {
      session.isReady = true;
      session.phone = client.info?.wid?.user;
      this.io?.to(`user_${userId}`).emit('whatsapp_connected', {
        phone: session.phone,
        timestamp: new Date().toISOString()
      });
    });

    // Message received
    client.on('message', async (message) => {
      const messageData = {
        id: message.id.id,
        from: message.from,
        to: message.to,
        body: message.body,
        timestamp: new Date(message.timestamp * 1000).toISOString(),
        type: message.type,
        isGroup: message.isGroup
      };

      // Store message in database here
      this.io?.to(`user_${userId}`).emit('whatsapp_message', messageData);
    });

    // Disconnected event
    client.on('disconnected', (reason) => {
      session.isReady = false;
      this.io?.to(`user_${userId}`).emit('whatsapp_disconnected', { reason });
    });

    this.sessions.set(userId, session);
    await client.initialize();

    return session.qrCode || '';
  }

  async disconnectSession(userId: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (session) {
      await session.client.destroy();
      this.sessions.delete(userId);
      this.io?.to(`user_${userId}`).emit('whatsapp_disconnected', { reason: 'user_disconnect' });
    }
  }

  async sendMessage(userId: string, to: string, message: string): Promise<boolean> {
    const session = this.sessions.get(userId);
    if (!session || !session.isReady) {
      return false;
    }

    try {
      await session.client.sendMessage(to, message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  getSessionStatus(userId: string) {
    const session = this.sessions.get(userId);
    if (!session) {
      return { connected: false };
    }

    return {
      connected: session.isReady,
      phone: session.phone,
      qrCode: session.qrCode
    };
  }
}

export default WhatsAppService;
