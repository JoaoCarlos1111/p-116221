
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { EmailService } from '../services/email';
import { prisma } from '../lib/prisma';

const router = Router();

// Enviar notificação por e-mail
router.post('/send-notification', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { caseId, recipientEmail, pdfPath } = req.body;

    if (!caseId || !recipientEmail) {
      return res.status(400).json({
        error: 'caseId e recipientEmail são obrigatórios'
      });
    }

    const result = await EmailService.sendCaseNotification(caseId, recipientEmail, pdfPath);

    if (result.success) {
      res.json({
        success: true,
        message: 'E-mail enviado com sucesso'
      });
    } else {
      res.status(400).json({
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Histórico de e-mails de um caso
router.get('/history/:caseId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;

    const emailHistory = await prisma.emailLog.findMany({
      where: { caseId },
      orderBy: { sentAt: 'desc' }
    });

    res.json({
      success: true,
      data: emailHistory
    });
  } catch (error) {
    console.error('Error fetching email history:', error);
    res.status(500).json({
      error: 'Failed to fetch email history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reenviar e-mails falhados
router.post('/retry-failed', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        error: 'Acesso negado'
      });
    }

    const result = await EmailService.retryFailedEmails();

    res.json({
      success: true,
      message: `${result.successCount} de ${result.retriedCount} e-mails reenviados com sucesso`
    });
  } catch (error) {
    console.error('Error retrying emails:', error);
    res.status(500).json({
      error: 'Failed to retry emails',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
