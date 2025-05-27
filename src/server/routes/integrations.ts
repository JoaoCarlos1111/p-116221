
import { Router } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import WhatsAppService from '../services/whatsapp';
import EmailService from '../services/email';

const router = Router();
let whatsappService: WhatsAppService;
let emailService: EmailService;

export function initializeIntegrationServices(io: SocketIOServer) {
  console.log('🚀 Initializing integration services...');
  whatsappService = new WhatsAppService(io);
  emailService = new EmailService(io);
  console.log('✅ Integration services initialized');
}

// WhatsApp routes
router.post('/whatsapp/connect', async (req, res) => {
  try {
    console.log('📱 WhatsApp connect request received');
    const userId = req.body.userId || 'user_1';
    
    if (!whatsappService) {
      throw new Error('WhatsApp service not initialized');
    }

    const qrCode = await whatsappService.initializeSession(userId);
    
    res.json({ 
      success: true, 
      message: 'WhatsApp connection initiated',
      qrCode: qrCode || null
    });
  } catch (error) {
    console.error('❌ Error connecting WhatsApp:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.post('/whatsapp/disconnect', async (req, res) => {
  try {
    const userId = req.body.userId || 'user_1';
    
    if (!whatsappService) {
      throw new Error('WhatsApp service not initialized');
    }

    await whatsappService.disconnectSession(userId);
    res.json({ success: true, message: 'WhatsApp disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/whatsapp/status', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'user_1';
    
    if (!whatsappService) {
      return res.json({ connected: false });
    }

    const status = whatsappService.getSessionStatus(userId);
    res.json(status);
  } catch (error) {
    console.error('Error getting WhatsApp status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Email routes
router.post('/email/connect', async (req, res) => {
  try {
    const { provider, email, password, userId = 'user_1' } = req.body;
    
    if (!emailService) {
      throw new Error('Email service not initialized');
    }

    const result = await emailService.connectEmail(userId, provider, email, password);
    res.json({ success: result });
  } catch (error) {
    console.error('Error connecting email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/email/disconnect', async (req, res) => {
  try {
    const userId = req.body.userId || 'user_1';
    
    if (!emailService) {
      throw new Error('Email service not initialized');
    }

    await emailService.disconnectEmail(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/email/status', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'user_1';
    
    if (!emailService) {
      return res.json({ connected: false });
    }

    const status = emailService.getStatus(userId);
    res.json(status);
  } catch (error) {
    console.error('Error getting email status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
