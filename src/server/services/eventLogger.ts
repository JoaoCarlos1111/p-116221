
import prisma from '../lib/prisma';

export interface EventData {
  eventType: string;
  entityType: string;
  entityId: string;
  performedBy?: string;
  payload: Record<string, any>;
}

export interface EventLogEntry {
  id: string;
  timestamp: Date;
  eventType: string;
  entityType: string;
  entityId: string;
  performedBy: string | null;
  payload: Record<string, any>;
  processed: boolean;
  createdAt: Date;
}

/**
 * Registra um evento no sistema para futuro processamento por agentes IA
 */
export async function registerEvent(eventData: EventData): Promise<EventLogEntry> {
  try {
    const event = await prisma.eventLog.create({
      data: {
        eventType: eventData.eventType,
        entityType: eventData.entityType,
        entityId: eventData.entityId,
        performedBy: eventData.performedBy || null,
        payload: eventData.payload,
        processed: false
      }
    });

    console.log(`📝 Event registered: ${eventData.eventType} for ${eventData.entityType}:${eventData.entityId}`);
    
    return event;
  } catch (error) {
    console.error('❌ Error registering event:', error);
    throw error;
  }
}

/**
 * Marca eventos como processados
 */
export async function markEventAsProcessed(eventId: string): Promise<void> {
  try {
    await prisma.eventLog.update({
      where: { id: eventId },
      data: { processed: true }
    });
  } catch (error) {
    console.error('❌ Error marking event as processed:', error);
    throw error;
  }
}

/**
 * Busca eventos não processados por tipo
 */
export async function getUnprocessedEvents(eventType?: string): Promise<EventLogEntry[]> {
  try {
    const events = await prisma.eventLog.findMany({
      where: {
        processed: false,
        ...(eventType && { eventType })
      },
      orderBy: { timestamp: 'asc' }
    });

    return events;
  } catch (error) {
    console.error('❌ Error fetching unprocessed events:', error);
    throw error;
  }
}

/**
 * Busca eventos por entidade
 */
export async function getEventsByEntity(entityType: string, entityId: string): Promise<EventLogEntry[]> {
  try {
    const events = await prisma.eventLog.findMany({
      where: {
        entityType,
        entityId
      },
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return events;
  } catch (error) {
    console.error('❌ Error fetching events by entity:', error);
    throw error;
  }
}

/**
 * Eventos pré-definidos do sistema
 */
export const EventTypes = {
  // Casos
  CASE_CREATED: 'case_created',
  CASE_STATUS_CHANGED: 'case_status_changed',
  CASE_ASSIGNED: 'case_assigned',
  CASE_APPROVED: 'case_approved',
  CASE_REJECTED: 'case_rejected',
  
  // Documentos
  DOCUMENT_GENERATED: 'document_generated',
  DOCUMENT_SENT: 'document_sent',
  DOCUMENT_SIGNED: 'document_signed',
  
  // Mensagens/Comunicação
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  EMAIL_SENT: 'email_sent',
  WHATSAPP_SENT: 'whatsapp_sent',
  
  // Pagamentos
  PAYMENT_CREATED: 'payment_created',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  PAYMENT_FAILED: 'payment_failed',
  
  // Sistema
  USER_LOGIN: 'user_login',
  USER_ACTION: 'user_action',
  SYSTEM_ERROR: 'system_error'
} as const;

/**
 * Tipos de entidade do sistema
 */
export const EntityTypes = {
  CASE: 'case',
  DOCUMENT: 'document',
  MESSAGE: 'message',
  PAYMENT: 'payment',
  USER: 'user',
  BRAND: 'brand',
  TEMPLATE: 'template'
} as const;
