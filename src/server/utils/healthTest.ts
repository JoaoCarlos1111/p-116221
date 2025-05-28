
import prisma from '../lib/prisma';
import { EventTypes, EntityTypes, registerEvent } from '../services/eventLogger';

export interface HealthTestResult {
  service: string;
  status: 'ok' | 'error';
  message: string;
  timestamp: Date;
}

/**
 * Executa testes de saúde do sistema para validação de produção
 */
export async function runHealthTests(): Promise<HealthTestResult[]> {
  const results: HealthTestResult[] = [];

  // Teste 1: Conexão com Banco de Dados
  try {
    await prisma.$connect();
    await prisma.user.count();
    results.push({
      service: 'Database',
      status: 'ok',
      message: 'Database connection successful',
      timestamp: new Date()
    });
  } catch (error) {
    results.push({
      service: 'Database',
      status: 'error',
      message: `Database connection failed: ${error}`,
      timestamp: new Date()
    });
  }

  // Teste 2: Sistema de Autenticação
  try {
    const adminUser = await prisma.user.findFirst({
      where: { isAdmin: true, isActive: true }
    });
    
    if (adminUser) {
      results.push({
        service: 'Authentication',
        status: 'ok',
        message: 'Admin user found and active',
        timestamp: new Date()
      });
    } else {
      results.push({
        service: 'Authentication',
        status: 'error',
        message: 'No active admin user found',
        timestamp: new Date()
      });
    }
  } catch (error) {
    results.push({
      service: 'Authentication',
      status: 'error',
      message: `Authentication system error: ${error}`,
      timestamp: new Date()
    });
  }

  // Teste 3: Sistema de Eventos
  try {
    await registerEvent({
      eventType: EventTypes.SYSTEM_ERROR,
      entityType: EntityTypes.USER,
      entityId: 'health-test',
      payload: { test: 'Health check event' }
    });
    
    results.push({
      service: 'Event System',
      status: 'ok',
      message: 'Event logging system operational',
      timestamp: new Date()
    });
  } catch (error) {
    results.push({
      service: 'Event System',
      status: 'error',
      message: `Event system error: ${error}`,
      timestamp: new Date()
    });
  }

  // Teste 4: Departamentos e Marcas
  try {
    const departmentCount = await prisma.department.count();
    const brandCount = await prisma.brand.count();
    
    if (departmentCount > 0 && brandCount > 0) {
      results.push({
        service: 'Base Data',
        status: 'ok',
        message: `${departmentCount} departments and ${brandCount} brands configured`,
        timestamp: new Date()
      });
    } else {
      results.push({
        service: 'Base Data',
        status: 'error',
        message: 'Missing departments or brands configuration',
        timestamp: new Date()
      });
    }
  } catch (error) {
    results.push({
      service: 'Base Data',
      status: 'error',
      message: `Base data error: ${error}`,
      timestamp: new Date()
    });
  }

  // Teste 5: Sistema de Upload
  try {
    const fs = await import('fs').then(m => m.promises);
    await fs.access('./uploads', fs.constants.F_OK);
    
    results.push({
      service: 'File Upload',
      status: 'ok',
      message: 'Upload directory accessible',
      timestamp: new Date()
    });
  } catch (error) {
    results.push({
      service: 'File Upload',
      status: 'error',
      message: `Upload system error: ${error}`,
      timestamp: new Date()
    });
  }

  return results;
}

/**
 * Endpoint de health check para monitoramento
 */
export function getHealthCheckSummary(results: HealthTestResult[]) {
  const okCount = results.filter(r => r.status === 'ok').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  return {
    overall: errorCount === 0 ? 'healthy' : 'unhealthy',
    services: {
      total: results.length,
      healthy: okCount,
      errors: errorCount
    },
    timestamp: new Date(),
    details: results
  };
}
