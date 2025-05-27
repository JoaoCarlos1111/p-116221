
import { Router } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import WhatsAppService from '../services/whatsapp';
import EmailService from '../services/email';

import { Router } from 'express';
import WhatsAppService from '../services/whatsapp';

const router = Router();

// WhatsApp routes
router.post('/whatsapp/connect', async (req, res) => {
  try {
    const { userId = 'user_1' } = req.body;
    console.log(`📱 Connecting WhatsApp for user: ${userId}`);
    
    const whatsappService = req.whatsappService as WhatsAppService;
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
      message: 'Failed to connect WhatsApp',
      error: error.message 
    });
  }
});

router.post('/whatsapp/disconnect', async (req, res) => {
  try {
    const { userId = 'user_1' } = req.body;
    console.log(`📱 Disconnecting WhatsApp for user: ${userId}`);
    
    const whatsappService = req.whatsappService as WhatsAppService;
    await whatsappService.disconnectSession(userId);
    
    res.json({ success: true, message: 'WhatsApp disconnected' });
  } catch (error) {
    console.error('❌ Error disconnecting WhatsApp:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to disconnect WhatsApp',
      error: error.message 
    });
  }
});

router.get('/whatsapp/status', (req, res) => {
  try {
    const { userId = 'user_1' } = req.query;
    console.log(`📱 Getting WhatsApp status for user: ${userId}`);
    
    const whatsappService = req.whatsappService as WhatsAppService;
    const status = whatsappService.getSessionStatus(userId as string);
    
    res.json({ success: true, data: status });
  } catch (error) {
    console.error('❌ Error getting WhatsApp status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get WhatsApp status',
      error: error.message 
    });
  }
});

// Email routes
router.post('/email/connect', async (req, res) => {
  try {
    const { provider, email, password, userId = 'user_1' } = req.body;
    console.log(`📧 Connecting email for user: ${userId}`);
    
    // Simulate email connection (implement actual logic as needed)
    const io = req.io;
    io.to(`user_${userId}`).emit('email_connected', {
      email,
      provider,
      timestamp: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Email connected' });
  } catch (error) {
    console.error('❌ Error connecting email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect email',
      error: error.message 
    });
  }
});

router.post('/email/disconnect', async (req, res) => {
  try {
    const { userId = 'user_1' } = req.body;
    console.log(`📧 Disconnecting email for user: ${userId}`);
    
    const io = req.io;
    io.to(`user_${userId}`).emit('email_disconnected');
    
    res.json({ success: true, message: 'Email disconnected' });
  } catch (error) {
    console.error('❌ Error disconnecting email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to disconnect email',
      error: error.message 
    });
  }
});

router.get('/email/status', (req, res) => {
  try {
    const { userId = 'user_1' } = req.query;
    console.log(`📧 Getting email status for user: ${userId}`);
    
    // Return default status (implement actual logic as needed)
    res.json({ 
      success: true, 
      data: { 
        connected: false,
        messagesCount: 0
      } 
    });
  } catch (error) {
    console.error('❌ Error getting email status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get email status',
      error: error.message 
    });
  }
});

export default router;
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
