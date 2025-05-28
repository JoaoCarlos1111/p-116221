
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
    console.log(`🚀 Initializing WhatsApp session for user: ${userId}`);
    
    if (this.sessions.has(userId)) {
      console.log(`♻️ Disconnecting existing session for user: ${userId}`);
      await this.disconnectSession(userId);
    }

    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: `user_${userId}`
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
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
        console.log(`📱 QR Code generated for user: ${userId}`);
        const qrCodeDataURL = await QRCode.toDataURL(qr, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        session.qrCode = qrCodeDataURL;
        
        console.log(`📡 Emitting QR Code to room: user_${userId}`);
        this.io?.to(`user_${userId}`).emit('whatsapp_qr', { qrCode: qrCodeDataURL });
      } catch (error) {
        console.error('❌ Error generating QR code:', error);
      }
    });

    // Ready event
    client.on('ready', () => {
      console.log(`✅ WhatsApp client ready for user: ${userId}`);
      session.isReady = true;
      session.phone = client.info?.wid?.user;
      
      this.io?.to(`user_${userId}`).emit('whatsapp_connected', {
        phone: session.phone,
        timestamp: new Date().toISOString()
      });
    });

    // Authentication event
    client.on('authenticated', () => {
      console.log(`🔐 WhatsApp authenticated for user: ${userId}`);
    });

    // Loading screen event
    client.on('loading_screen', (percent, message) => {
      console.log(`⏳ Loading: ${percent}% - ${message}`);
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

      console.log(`📨 New message for user ${userId}:`, messageData);
      this.io?.to(`user_${userId}`).emit('whatsapp_message', messageData);
    });

    // Disconnected event
    client.on('disconnected', (reason) => {
      console.log(`❌ WhatsApp disconnected for user ${userId}:`, reason);
      session.isReady = false;
      this.io?.to(`user_${userId}`).emit('whatsapp_disconnected', { reason });
    });

    this.sessions.set(userId, session);
    
    try {
      await client.initialize();
      console.log(`✅ WhatsApp client initialized for user: ${userId}`);
    } catch (error) {
      console.error(`❌ Error initializing WhatsApp client for user ${userId}:`, error);
      throw error;
    }

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
