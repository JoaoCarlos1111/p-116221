
import { getUnprocessedEvents, markEventAsProcessed, EventLogEntry } from '../services/eventLogger';

export interface EventProcessor {
  eventType: string;
  handler: (event: EventLogEntry) => Promise<void>;
}

class EventQueue {
  private processors: Map<string, EventProcessor['handler']> = new Map();
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  /**
   * Registra um processador para um tipo de evento
   */
  registerProcessor(eventType: string, handler: EventProcessor['handler']): void {
    this.processors.set(eventType, handler);
    console.log(`🤖 Event processor registered for: ${eventType}`);
  }

  /**
   * Inicia o processamento automático de eventos
   */
  startProcessing(intervalMs: number = 5000): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    this.processingInterval = setInterval(async () => {
      await this.processEvents();
    }, intervalMs);

    console.log(`⚡ Event queue processing started (interval: ${intervalMs}ms)`);
  }

  /**
   * Para o processamento automático
   */
  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log('⏹️ Event queue processing stopped');
  }

  /**
   * Processa eventos pendentes
   */
  async processEvents(): Promise<void> {
    if (this.isProcessing) {
      return; // Evita processamento concorrente
    }

    this.isProcessing = true;

    try {
      const unprocessedEvents = await getUnprocessedEvents();
      
      if (unprocessedEvents.length === 0) {
        return;
      }

      console.log(`🔄 Processing ${unprocessedEvents.length} events...`);

      for (const event of unprocessedEvents) {
        try {
          const handler = this.processors.get(event.eventType);
          
          if (handler) {
            await handler(event);
            await markEventAsProcessed(event.id);
            console.log(`✅ Event processed: ${event.eventType} (${event.id})`);
          } else {
            console.log(`⚠️ No processor found for event type: ${event.eventType}`);
            // Marca como processado mesmo sem handler para evitar loop
            await markEventAsProcessed(event.id);
          }
        } catch (error) {
          console.error(`❌ Error processing event ${event.id}:`, error);
          // Não marca como processado em caso de erro
        }
      }
    } catch (error) {
      console.error('❌ Error in event processing cycle:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Processa um evento específico manualmente
   */
  async processEvent(eventId: string): Promise<boolean> {
    try {
      const events = await getUnprocessedEvents();
      const event = events.find(e => e.id === eventId);
      
      if (!event) {
        console.log(`⚠️ Event not found or already processed: ${eventId}`);
        return false;
      }

      const handler = this.processors.get(event.eventType);
      
      if (handler) {
        await handler(event);
        await markEventAsProcessed(event.id);
        console.log(`✅ Event manually processed: ${event.eventType} (${event.id})`);
        return true;
      } else {
        console.log(`⚠️ No processor found for event type: ${event.eventType}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error manually processing event ${eventId}:`, error);
      return false;
    }
  }

  /**
   * Retorna estatísticas da fila
   */
  async getQueueStats(): Promise<{
    unprocessedCount: number;
    registeredProcessors: string[];
    isProcessing: boolean;
  }> {
    const unprocessedEvents = await getUnprocessedEvents();
    
    return {
      unprocessedCount: unprocessedEvents.length,
      registeredProcessors: Array.from(this.processors.keys()),
      isProcessing: this.isProcessing
    };
  }
}

// Instância singleton da fila
export const eventQueue = new EventQueue();

// Exemplo de processadores que podem ser registrados futuramente
export const sampleProcessors = {
  // Exemplo: Notificar quando um caso muda de status
  caseStatusChanged: async (event: EventLogEntry) => {
    console.log(`📋 Case status changed: ${event.payload.from} → ${event.payload.to}`);
    // Aqui seria implementada a lógica de notificação automática
  },

  // Exemplo: Gerar documento automaticamente
  documentGenerated: async (event: EventLogEntry) => {
    console.log(`📄 Document generated for case: ${event.entityId}`);
    // Aqui seria implementada a lógica de processamento de documento
  },

  // Exemplo: Enviar email automático
  emailSent: async (event: EventLogEntry) => {
    console.log(`📧 Email sent: ${event.payload.subject}`);
    // Aqui seria implementada a lógica de follow-up automático
  }
};
