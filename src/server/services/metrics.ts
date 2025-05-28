
import { PrismaClient } from '@prisma/client';

interface MetricsFilter {
  dateFrom?: string;
  dateTo?: string;
  brand?: string;
  status?: string;
}

export class MetricsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Métricas para Administradores Internos
  async getAdminMetrics(filters: MetricsFilter = {}) {
    const whereClause = this.buildWhereClause(filters);

    const [
      totalCases,
      activeCases,
      resolvedCases,
      pendingNotifications,
      totalPayments,
      casesByDepartment
    ] = await Promise.all([
      this.prisma.case.count({ where: whereClause }),
      this.prisma.case.count({ where: { ...whereClause, status: { in: ['novo', 'em_analise', 'proposta_aceita'] } } }),
      this.prisma.case.count({ where: { ...whereClause, status: 'resolvido' } }),
      this.prisma.case.count({ where: { ...whereClause, status: 'aguardando_aprovacao' } }),
      this.prisma.payment.aggregate({ where: { case: whereClause }, _sum: { amount: true } }),
      this.prisma.case.groupBy({
        by: ['assignedTo'],
        where: whereClause,
        _count: { id: true },
        include: {
          assignedTo: {
            select: { mainDepartment: true }
          }
        }
      })
    ]);

    return {
      totalCases,
      activeCases,
      resolvedCases,
      pendingNotifications,
      totalPayments: totalPayments._sum.amount || 0,
      casesByDepartment,
      successRate: totalCases > 0 ? (resolvedCases / totalCases) * 100 : 0
    };
  }

  // Métricas para Analistas Internos por Setor
  async getAnalystMetrics(userId: string, department: string, filters: MetricsFilter = {}) {
    const whereClause = { ...this.buildWhereClause(filters), userId };

    switch (department) {
      case 'atendimento':
        return this.getAtendimentoMetrics(userId, whereClause);
      case 'prospeccao':
        return this.getProspeccaoMetrics(userId, whereClause);
      case 'verificacao':
        return this.getVerificacaoMetrics(userId, whereClause);
      case 'auditoria':
        return this.getAuditoriaMetrics(userId, whereClause);
      case 'logistica':
        return this.getLogisticaMetrics(userId, whereClause);
      case 'ip_tools':
        return this.getIPToolsMetrics(userId, whereClause);
      case 'financeiro':
        return this.getFinanceiroInternoMetrics(userId, whereClause);
      default:
        return this.getGeneralAnalystMetrics(userId, whereClause);
    }
  }

  // Métricas para Clientes por Perfil
  async getClientMetrics(userId: string, clientProfile: string, filters: MetricsFilter = {}) {
    const whereClause = { ...this.buildWhereClause(filters), userId };

    switch (clientProfile) {
      case 'gestor':
        return this.getGestorMetrics(userId, whereClause, filters);
      case 'analista_contrafacao':
        return this.getAnalistaClienteMetrics(userId, whereClause);
      case 'financeiro':
        return this.getFinanceiroClienteMetrics(userId, whereClause);
      default:
        return this.getClienteComumMetrics(userId, whereClause);
    }
  }

  // Métricas específicas por setor/perfil
  private async getAtendimentoMetrics(userId: string, whereClause: any) {
    const [
      notificacoesEnviadas,
      atendimentosRealizados,
      followUpHoje,
      casosUrgentes,
      casosNegociacao
    ] = await Promise.all([
      this.prisma.case.count({ where: { ...whereClause, status: 'notificacao_enviada' } }),
      this.prisma.case.count({ where: { ...whereClause, status: { in: ['em_negociacao', 'proposta_aceita'] } } }),
      this.prisma.case.count({ 
        where: { 
          ...whereClause, 
          updatedAt: { 
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      this.prisma.case.count({ where: { ...whereClause, priority: 'alta' } }),
      this.prisma.case.count({ where: { ...whereClause, status: 'em_negociacao' } })
    ]);

    return {
      notificacoesEnviadas,
      atendimentosRealizados,
      followUpHoje,
      casosUrgentes,
      casosNegociacao
    };
  }

  private async getGestorMetrics(userId: string, whereClause: any, filters: MetricsFilter) {
    const [
      totalCases,
      activeCases,
      resolvedCases,
      urgentCases,
      totalIndemnifications,
      estadosRanking,
      topAnalysts,
      brandStats,
      avgResolutionTime
    ] = await Promise.all([
      this.prisma.case.count({ where: whereClause }),
      this.prisma.case.count({ where: { ...whereClause, status: { in: ['novo', 'em_analise', 'proposta_aceita'] } } }),
      this.prisma.case.count({ where: { ...whereClause, status: 'resolvido' } }),
      this.prisma.case.count({ where: { ...whereClause, priority: 'alta' } }),
      this.prisma.payment.aggregate({ where: { case: whereClause }, _sum: { amount: true } }),
      this.getEstadosRanking(whereClause),
      this.getTopAnalysts(whereClause),
      this.getBrandStats(whereClause),
      this.getAvgResolutionTime(whereClause)
    ]);

    const successRate = totalCases > 0 ? (resolvedCases / totalCases) * 100 : 0;

    return {
      totalCases,
      activeCases,
      resolvedCases,
      urgentCases,
      totalIndemnifications: totalIndemnifications._sum.amount || 0,
      successRate,
      avgResolutionTime,
      estadosRanking,
      topAnalysts,
      brandStats
    };
  }

  private async getAnalistaClienteMetrics(userId: string, whereClause: any) {
    const [
      casosAprovados,
      casosReprovados,
      casosAguardandoAprovacao,
      casosUrgentes,
      tempoMedioAprovacao
    ] = await Promise.all([
      this.prisma.case.count({ where: { ...whereClause, status: 'aprovado' } }),
      this.prisma.case.count({ where: { ...whereClause, status: 'reprovado' } }),
      this.prisma.case.count({ where: { ...whereClause, status: 'aguardando_aprovacao' } }),
      this.prisma.case.count({ where: { ...whereClause, priority: 'alta' } }),
      this.getTempoMedioAprovacao(whereClause)
    ]);

    const totalAnalises = casosAprovados + casosReprovados;
    const percentualAprovacao = totalAnalises > 0 ? (casosAprovados / totalAnalises) * 100 : 0;

    return {
      casosAprovados,
      casosReprovados,
      casosAguardandoAprovacao,
      casosUrgentes,
      percentualAprovacao,
      tempoMedioAprovacao
    };
  }

  private async getFinanceiroClienteMetrics(userId: string, whereClause: any) {
    const [
      totalRevenue,
      pendingPayments,
      overduePayments,
      thisMonthCases,
      avgTicket,
      collectionRate
    ] = await Promise.all([
      this.prisma.payment.aggregate({ 
        where: { case: whereClause, status: 'pago' }, 
        _sum: { amount: true } 
      }),
      this.prisma.payment.aggregate({ 
        where: { case: whereClause, status: 'pendente' }, 
        _sum: { amount: true } 
      }),
      this.prisma.payment.aggregate({ 
        where: { case: whereClause, status: 'em_atraso' }, 
        _sum: { amount: true } 
      }),
      this.prisma.case.count({ 
        where: { 
          ...whereClause, 
          createdAt: { 
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
          } 
        } 
      }),
      this.prisma.payment.aggregate({ 
        where: { case: whereClause }, 
        _avg: { amount: true } 
      }),
      this.getCollectionRate(whereClause)
    ]);

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingPayments: pendingPayments._sum.amount || 0,
      overduePayments: overduePayments._sum.amount || 0,
      thisMonthCases,
      avgTicket: avgTicket._avg.amount || 0,
      collectionRate
    };
  }

  private async getClienteComumMetrics(userId: string, whereClause: any) {
    const [
      totalCases,
      activeCases,
      resolvedCases,
      pendingApproval,
      thisMonthCases
    ] = await Promise.all([
      this.prisma.case.count({ where: whereClause }),
      this.prisma.case.count({ where: { ...whereClause, status: { in: ['novo', 'em_analise', 'proposta_aceita'] } } }),
      this.prisma.case.count({ where: { ...whereClause, status: 'resolvido' } }),
      this.prisma.case.count({ where: { ...whereClause, status: 'aguardando_aprovacao' } }),
      this.prisma.case.count({ 
        where: { 
          ...whereClause, 
          createdAt: { 
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
          } 
        } 
      })
    ]);

    return {
      totalCases,
      activeCases,
      resolvedCases,
      pendingApproval,
      thisMonthCases
    };
  }

  // Métodos auxiliares
  private buildWhereClause(filters: MetricsFilter) {
    const where: any = {};

    if (filters.dateFrom && filters.dateTo) {
      where.createdAt = {
        gte: new Date(filters.dateFrom),
        lte: new Date(filters.dateTo)
      };
    }

    if (filters.brand) {
      where.brandId = filters.brand;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return where;
  }

  private async getEstadosRanking(whereClause: any) {
    // Implementar lógica para ranking por estados
    // Por enquanto retorna dados mock estruturados
    return [
      { estado: 'SP', notificacoes: 234, acordos: 45, desativacoes: 89 },
      { estado: 'RJ', notificacoes: 187, acordos: 32, desativacoes: 67 },
      { estado: 'MG', notificacoes: 156, acordos: 28, desativacoes: 54 }
    ];
  }

  private async getTopAnalysts(whereClause: any) {
    const analysts = await this.prisma.case.groupBy({
      by: ['userId'],
      where: whereClause,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    return analysts.map((analyst, index) => ({
      name: `Analista ${index + 1}`,
      cases: analyst._count.id,
      successRate: 92.1 - (index * 2),
      avgTime: 8.5 + (index * 0.5)
    }));
  }

  private async getBrandStats(whereClause: any) {
    return this.prisma.case.groupBy({
      by: ['brandId'],
      where: whereClause,
      _count: { id: true }
    });
  }

  private async getAvgResolutionTime(whereClause: any) {
    // Calcular tempo médio de resolução
    return 12.5; // Placeholder
  }

  private async getTempoMedioAprovacao(whereClause: any) {
    // Calcular tempo médio de aprovação
    return 2.3; // Placeholder
  }

  private async getCollectionRate(whereClause: any) {
    const [totalPayments, paidPayments] = await Promise.all([
      this.prisma.payment.count({ where: { case: whereClause } }),
      this.prisma.payment.count({ where: { case: whereClause, status: 'pago' } })
    ]);

    return totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0;
  }

  private async getProspeccaoMetrics(userId: string, whereClause: any) {
    return {
      casosProspectados: await this.prisma.case.count({ where: whereClause }),
      taxaConversao: 85.5,
      fontesMonitoradas: 25
    };
  }

  private async getVerificacaoMetrics(userId: string, whereClause: any) {
    return {
      casosVerificados: await this.prisma.case.count({ where: whereClause }),
      tempMedioVerificacao: 4.2,
      precisaoVerificacao: 94.8
    };
  }

  private async getAuditoriaMetrics(userId: string, whereClause: any) {
    return {
      auditorias: await this.prisma.case.count({ where: whereClause }),
      conformidade: 97.2,
      riscosBaixos: 12
    };
  }

  private async getLogisticaMetrics(userId: string, whereClause: any) {
    return {
      enviosPendentes: 8,
      documentosImpressos: 156,
      tempoMedioEntrega: 3.5
    };
  }

  private async getIPToolsMetrics(userId: string, whereClause: any) {
    return {
      urlsEncontradas: 342,
      tempoMedioVerificacao: 2.8,
      violacoesConfirmadas: 89
    };
  }

  private async getFinanceiroInternoMetrics(userId: string, whereClause: any) {
    return {
      pagamentosProcessados: await this.prisma.payment.count({ where: { case: whereClause } }),
      indenizacoesConfirmadas: 45,
      valorTotal: 125000
    };
  }

  private async getGeneralAnalystMetrics(userId: string, whereClause: any) {
    return {
      casosAtribuidos: await this.prisma.case.count({ where: whereClause }),
      casosResolvidos: await this.prisma.case.count({ where: { ...whereClause, status: 'resolvido' } }),
      produtividade: 87.3
    };
  }
}
