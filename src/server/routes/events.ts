import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';
import { logEvent, getUnprocessedEvents, markEventAsProcessed } from '../services/eventLogger';

const router = express.Router();

// Validation schemas
const markProcessedSchema = {
  body: z.object({
    eventIds: z.array(z.string()).min(1, 'At least one event ID is required')
  })
};

// GET /api/events - Listar eventos não processados
router.get('/',
  authMiddleware,
  async (req, res) => {
    try {
      const events = await getUnprocessedEvents();

      return res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({
        error: 'Erro ao buscar eventos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
);

// POST /api/events/mark-processed - Marcar eventos como processados
router.post('/mark-processed',
  authMiddleware,
  validate(markProcessedSchema),
  async (req, res) => {
    try {
      const { eventIds } = req.body;

      await Promise.all(
        eventIds.map(eventId => markEventAsProcessed(eventId))
      );

      return res.json({ 
        success: true, 
        message: `${eventIds.length} eventos marcados como processados` 
      });
    } catch (error) {
      console.error('Error marking events as processed:', error);
      res.status(500).json({ 
        error: 'Erro ao marcar eventos como processados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
);

// GET /api/events/stats - Estatísticas de eventos
router.get('/stats',
  authMiddleware,
  async (req, res) => {
    try {
      const unprocessedEvents = await getUnprocessedEvents();

      const stats = {
        totalUnprocessed: unprocessedEvents.length,
        byType: unprocessedEvents.reduce((acc, event) => {
          acc[event.eventType] = (acc[event.eventType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byEntity: unprocessedEvents.reduce((acc, event) => {
          acc[event.entityType] = (acc[event.entityType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching event stats:', error);
      res.status(500).json({
        error: 'Erro ao buscar estatísticas de eventos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
);

export default router;