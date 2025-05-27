
import imaps from 'imap-simple';
import nodemailer from 'nodemailer';
import { Server as SocketIOServer } from 'socket.io';

interface EmailConfig {
  provider: string;
  email: string;
  password: string;
  imapHost?: string;
  smtpHost?: string;
  imapPort?: number;
  smtpPort?: number;
  secure?: boolean;
}

interface EmailSession {
  userId: string;
  config: EmailConfig;
  imapConnection?: any;
  smtpTransporter?: any;
  isConnected: boolean;
  lastSync?: Date;
}

class EmailService {
  private sessions: Map<string, EmailSession> = new Map();
  private io?: SocketIOServer;

  constructor(io?: SocketIOServer) {
    this.io = io;
  }

  private getProviderConfig(provider: string) {
    const configs = {
      gmail: {
        imapHost: 'imap.gmail.com',
        smtpHost: 'smtp.gmail.com',
        imapPort: 993,
        smtpPort: 587,
        secure: true
      },
      outlook: {
        imapHost: 'outlook.office365.com',
        smtpHost: 'smtp.office365.com',
        imapPort: 993,
        smtpPort: 587,
        secure: true
      }
    };

    return configs[provider as keyof typeof configs] || {};
  }

  async connectEmail(userId: string, config: EmailConfig): Promise<boolean> {
    try {
      const providerConfig = this.getProviderConfig(config.provider);
      const fullConfig = { ...config, ...providerConfig };

      // Test IMAP connection
      const imapConfig = {
        imap: {
          user: fullConfig.email,
          password: fullConfig.password,
          host: fullConfig.imapHost,
          port: fullConfig.imapPort,
          tls: fullConfig.secure,
          authTimeout: 3000
        }
      };

      const imapConnection = await imaps.connect(imapConfig);

      // Test SMTP connection
      const smtpTransporter = nodemailer.createTransporter({
        host: fullConfig.smtpHost,
        port: fullConfig.smtpPort,
        secure: fullConfig.secure,
        auth: {
          user: fullConfig.email,
          pass: fullConfig.password
        }
      });

      await smtpTransporter.verify();

      const session: EmailSession = {
        userId,
        config: fullConfig,
        imapConnection,
        smtpTransporter,
        isConnected: true,
        lastSync: new Date()
      };

      this.sessions.set(userId, session);

      // Start email monitoring
      this.startEmailMonitoring(userId);

      this.io?.to(`user_${userId}`).emit('email_connected', {
        email: fullConfig.email,
        provider: fullConfig.provider,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Email connection error:', error);
      return false;
    }
  }

  async disconnectEmail(userId: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (session) {
      if (session.imapConnection) {
        session.imapConnection.end();
      }
      this.sessions.delete(userId);
      this.io?.to(`user_${userId}`).emit('email_disconnected');
    }
  }

  private async startEmailMonitoring(userId: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (!session || !session.imapConnection) return;

    try {
      await session.imapConnection.openBox('INBOX');
      
      // Monitor new emails every 30 seconds
      const monitorInterval = setInterval(async () => {
        try {
          const currentSession = this.sessions.get(userId);
          if (!currentSession || !currentSession.isConnected) {
            clearInterval(monitorInterval);
            return;
          }

          const searchCriteria = ['UNSEEN'];
          const fetchOptions = {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            markSeen: false
          };

          const messages = await currentSession.imapConnection.search(searchCriteria, fetchOptions);
          
          for (const message of messages) {
            const header = message.parts.find((part: any) => part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)');
            if (header) {
              const emailData = {
                id: message.attributes.uid,
                from: this.parseHeader(header.body.from),
                to: this.parseHeader(header.body.to),
                subject: this.parseHeader(header.body.subject),
                date: new Date(header.body.date).toISOString(),
                timestamp: new Date().toISOString()
              };

              // Store email in database here
              this.io?.to(`user_${userId}`).emit('email_received', emailData);
            }
          }

          currentSession.lastSync = new Date();
        } catch (error) {
          console.error('Email monitoring error:', error);
        }
      }, 30000);

    } catch (error) {
      console.error('Error starting email monitoring:', error);
    }
  }

  private parseHeader(header: string[]): string {
    return header ? header[0] : '';
  }

  async sendEmail(userId: string, to: string, subject: string, body: string): Promise<boolean> {
    const session = this.sessions.get(userId);
    if (!session || !session.smtpTransporter) {
      return false;
    }

    try {
      await session.smtpTransporter.sendMail({
        from: session.config.email,
        to,
        subject,
        html: body
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  getSessionStatus(userId: string) {
    const session = this.sessions.get(userId);
    if (!session) {
      return { connected: false };
    }

    return {
      connected: session.isConnected,
      email: session.config.email,
      provider: session.config.provider,
      lastSync: session.lastSync?.toISOString()
    };
  }
}

export default EmailService;
