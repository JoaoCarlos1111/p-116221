
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import WhatsAppService from '../services/whatsapp';

const router = Router();

// Aplicar middleware de autenticação
router.use(authMiddleware);

// POST /api/whatsapp/webhook - Receber mensagens do WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { message, from, to, timestamp, type, body } = req.body;

    console.log('📨 WhatsApp webhook received:', req.body);

    // Tentar associar a mensagem a um caso existente
    // Buscar por número de telefone ou outros identificadores
    const phoneNumber = from.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Buscar casos que possam estar relacionados
    const relatedCases = await prisma.case.findMany({
      where: {
        OR: [
          { debtorName: { contains: phoneNumber } },
          // Adicionar outros critérios de busca conforme necessário
        ]
      },
      take: 1
    });

    let caseId = null;
    if (relatedCases.length > 0) {
      caseId = relatedCases[0].id;
    }

    // Registrar a mensagem no histórico
    const interaction = await prisma.interaction.create({
      data: {
        caseId,
        type: 'WHATSAPP',
        direction: 'INBOUND',
        content: body || '',
        metadata: {
          from,
          to,
          messageId: message?.id,
          messageType: type,
          timestamp
        },
        createdAt: new Date(timestamp * 1000)
      }
    });

    // Emitir via Socket.IO para atualizar interface em tempo real
    const io = req.io;
    if (io && caseId) {
      io.emit('new_interaction', {
        caseId,
        interaction
      });
    }

    res.json({ success: true, interactionId: interaction.id });
  } catch (error) {
    console.error('❌ Error processing WhatsApp webhook:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/whatsapp/send - Enviar mensagem via WhatsApp
router.post('/send', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const whatsappService = req.whatsappService as WhatsAppService;
    const { caseId, to, message, userId = 'user_1' } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Phone number and message are required'
      });
    }

    // Enviar mensagem via WhatsApp
    const sent = await whatsappService.sendMessage(userId, to, message);

    if (!sent) {
      return res.status(500).json({
        error: 'Failed to send message',
        message: 'WhatsApp service is not connected or failed to send'
      });
    }

    // Registrar no histórico
    const interaction = await prisma.interaction.create({
      data: {
        caseId,
        type: 'WHATSAPP',
        direction: 'OUTBOUND',
        content: message,
        metadata: {
          to,
          sentBy: userId
        }
      }
    });

    res.json({ success: true, interactionId: interaction.id });
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/whatsapp/interactions/:caseId - Buscar interações do WhatsApp de um caso
router.get('/interactions/:caseId', async (req, res) => {
  try {
    const prisma = req.prisma as PrismaClient;
    const { caseId } = req.params;

    const interactions = await prisma.interaction.findMany({
      where: {
        caseId,
        type: 'WHATSAPP'
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: interactions });
  } catch (error) {
    console.error('❌ Error fetching WhatsApp interactions:', error);
    res.status(500).json({
      error: 'Failed to fetch interactions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
