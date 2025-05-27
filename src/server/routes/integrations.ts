import { Router } from 'express';
import WhatsAppService from '../services/whatsapp';
import EmailService from '../services/email';

const router = Router();

// Services will be initialized when the server starts
let whatsappService: WhatsAppService;
let emailService: EmailService;

export const initializeIntegrationServices = (io: any) => {
  whatsappService = new WhatsAppService(io);
  emailService = new EmailService(io);
};

// Helper function to get user ID from request
const getCurrentUserId = (req: any): string => {
  return req.headers['user-id'] || 'user_1';
};

// WhatsApp routes
router.post('/whatsapp/connect', async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const qrCode = await whatsappService.initializeSession(userId);
    res.json({ success: true, qrCode });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to initialize WhatsApp session' });
  }
});

router.post('/whatsapp/disconnect', async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    await whatsappService.disconnectSession(userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to disconnect WhatsApp' });
  }
});

router.get('/whatsapp/status', (req, res) => {
  const userId = getCurrentUserId(req);
  const status = whatsappService.getSessionStatus(userId);
  res.json(status);
});

router.post('/whatsapp/send', async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { to, message } = req.body;
    const success = await whatsappService.sendMessage(userId, to, message);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Email routes
router.post('/email/connect', async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { provider, email, password } = req.body;
    const success = await emailService.connectEmail(userId, { provider, email, password });
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to connect email' });
  }
});

router.post('/email/disconnect', async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    await emailService.disconnectEmail(userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to disconnect email' });
  }
});

router.get('/email/status', (req, res) => {
  const userId = getCurrentUserId(req);
  const status = emailService.getSessionStatus(userId);
  res.json(status);
});

router.post('/email/send', async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { to, subject, body } = req.body;
    const success = await emailService.sendEmail(userId, to, subject, body);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

export default router;