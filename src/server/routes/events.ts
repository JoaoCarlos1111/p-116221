
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { 
  getUnprocessedEvents, 
  getEventsByEntity, 
  markEventAsProcessed,
  EventLogEntry 
} from '../services/eventLogger';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Schema de validação para consulta de eventos
const getEventsSchema = z.object({
  query: z.object({
    eventType: z.string().optional(),
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    processed: z.string().optional().transform(val => val === 'true'),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1)
  })
});

const markProcessedSchema = z.object({
  body: z.object({
    eventIds: z.array(z.string())
  })
});

// GET /api/events - Buscar eventos
router.get('/', 
  authMiddleware,
  validate(getEventsSchema),
  async (req, res) => {
    try {
      const { eventType, entityType, entityId, processed, limit = 50, page = 1 } = req.query;

      let events: EventLogEntry[];

      if (entityType && entityId) {
        // Buscar eventos por entidade específica
        events = await getEventsByEntity(entityType as string, entityId as string);
      } else {
        // Buscar eventos não processados ou todos
        if (processed === false) {
          events = await getUnprocessedEvents(eventType as string);
        } else {
          // Implementar busca geral com filtros
          events = await getUnprocessedEvents(); // Por enquanto retorna não processados
        }
      }

      // Aplicar paginação
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedEvents = events.slice(startIndex, endIndex);

      return res.json({
        events: paginatedEvents,
        pagination: {
          page,
          limit,
          total: events.length,
          totalPages: Math.ceil(events.length / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ 
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
      };

      return res.json(stats);
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
