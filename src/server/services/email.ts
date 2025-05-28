import imaps from 'imap-simple';
import nodemailer from 'nodemailer';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '../lib/prisma';

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

export interface EmailAttachment {
  filename: string;
  path: string;
  contentType?: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  content: string;
  attachments?: EmailAttachment[];
  caseId?: string;
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
      const smtpTransporter = nodemailer.createTransport({
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

  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  static async sendNotification(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Verificar se o serviço está configurado
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return {
          success: false,
          error: 'Serviço de e-mail não configurado'
        };
      }

      const mailOptions = {
        from: `"Total Brand Protection" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: this.createEmailTemplate(options.content),
        attachments: options.attachments
      };

      const info = await this.transporter.sendMail(mailOptions);

      // Registrar envio no banco se tiver caseId
      if (options.caseId) {
        await prisma.emailLog.create({
          data: {
            caseId: options.caseId,
            to: options.to,
            subject: options.subject,
            content: options.content,
            messageId: info.messageId,
            sentAt: new Date(),
            status: 'SENT'
          }
        });
      }

      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);

      // Registrar falha no banco se tiver caseId
      if (options.caseId) {
        await prisma.emailLog.create({
          data: {
            caseId: options.caseId,
            to: options.to,
            subject: options.subject,
            content: options.content,
            sentAt: new Date(),
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          }
        });
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  static async sendCaseNotification(caseId: string, recipientEmail: string, pdfPath?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Buscar dados do caso
      const caseData = await prisma.case.findUnique({
        where: { id: caseId },
        include: {
          brand: true
        }
      });

      if (!caseData) {
        return { success: false, error: 'Caso não encontrado' };
      }

      const subject = `Notificação Extrajudicial - Caso ${caseId}`;
      const content = `
        <h2>Notificação Extrajudicial</h2>
        <p>Prezado(a),</p>

        <p>Por meio desta, notificamos que foi identificada a comercialização de produtos que violam os direitos de propriedade intelectual da marca <strong>${caseData.brand.name}</strong> em seu estabelecimento/plataforma.</p>

        <p><strong>Dados do caso:</strong></p>
        <ul>
          <li>ID do caso: ${caseData.id}</li>
          <li>Loja: ${caseData.store}</li>
          <li>Marca: ${caseData.brand.name}</li>
          <li>Data de identificação: ${caseData.createdAt.toLocaleDateString('pt-BR')}</li>
        </ul>

        <p>Solicitamos a <strong>retirada imediata</strong> dos produtos em questão de seu estabelecimento/plataforma.</p>

        <p>Aguardamos retorno em até <strong>48 horas</strong>.</p>

        <p>Atenciosamente,<br>
        Total Brand Protection</p>
      `;

      const attachments: EmailAttachment[] = [];
      if (pdfPath && fs.existsSync(pdfPath)) {
        attachments.push({
          filename: `Notificacao_${caseId}.pdf`,
          path: pdfPath,
          contentType: 'application/pdf'
        });
      }

      return await this.sendNotification({
        to: recipientEmail,
        subject,
        content,
        attachments,
        caseId
      });
    } catch (error) {
      console.error('Erro ao enviar notificação do caso:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  private static createEmailTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #1e40af;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
          h2 {
            color: #1e40af;
            margin-top: 0;
          }
          ul {
            background-color: white;
            padding: 15px;
            border-radius: 4px;
            border-left: 4px solid #1e40af;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Total Brand Protection</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Este é um e-mail automático do sistema TBP</p>
          <p>© ${new Date().getFullYear()} Total Brand Protection</p>
        </div>
      </body>
      </html>
    `;
  }

  static async retryFailedEmails(): Promise<{ retriedCount: number; successCount: number }> {
    try {
      // Buscar e-mails que falharam nas últimas 24 horas
      const failedEmails = await prisma.emailLog.findMany({
        where: {
          status: 'FAILED',
          sentAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24 horas
          }
        },
        include: {
          case: {
            include: {
              brand: true
            }
          }
        }
      });

      let successCount = 0;

      for (const emailLog of failedEmails) {
        const result = await this.sendNotification({
          to: emailLog.to,
          subject: emailLog.subject,
          content: emailLog.content,
          caseId: emailLog.caseId
        });

        if (result.success) {
          successCount++;
          // Atualizar status para enviado
          await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: { 
              status: 'SENT',
              messageId: result.messageId,
              error: null
            }
          });
        }
      }

      return {
        retriedCount: failedEmails.length,
        successCount
      };
    } catch (error) {
      console.error('Erro ao tentar reenviar e-mails:', error);
      return { retriedCount: 0, successCount: 0 };
    }
  }
}

export { EmailService };
export default EmailService;