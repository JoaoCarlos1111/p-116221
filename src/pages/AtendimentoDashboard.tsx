import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  RefreshCw,
  DollarSign,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Mail,
  Download,
  Bell,
  AlertCircle,
  Flame,
  Lightbulb,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIData {
  notificacoesEnviadas: number;
  atendimentosRealizados: number;
  followUpHoje: number;
  casosUrgentes: number;
  casosNegociacao: number;
}

interface MetaData {
  titulo: string;
  objetivo: number;
  realizado: number;
  unidade: string;
  tipo: 'valor' | 'quantidade';
  cor: string;
}

interface ForecastData {
  periodo: string;
  valor: number;
  casos: number;
}

interface AlertaData {
  id: string;
  tipo: 'risco' | 'oportunidade' | 'atencao';
  icone: any;
  titulo: string;
  descricao: string;
  cor: string;
}

export default function AtendimentoDashboard() {
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(false);

  // KPIs Operacionais
  const [kpis, setKpis] = useState<KPIData>({
    notificacoesEnviadas: 112,
    atendimentosRealizados: 86,
    followUpHoje: 14,
    casosUrgentes: 5,
    casosNegociacao: 9
  });

  // Painel de Metas
  const [metas, setMetas] = useState<MetaData[]>([
    {
      titulo: 'Valor de acordos fechados',
      objetivo: 50000,
      realizado: 38000,
      unidade: 'R$',
      tipo: 'valor',
      cor: 'blue'
    },
    {
      titulo: 'Casos resolvidos',
      objetivo: 40,
      realizado: 29,
      unidade: 'casos',
      tipo: 'quantidade',
      cor: 'green'
    },
    {
      titulo: 'Novas notificações enviadas',
      objetivo: 100,
      realizado: 82,
      unidade: 'notif.',
      tipo: 'quantidade',
      cor: 'yellow'
    }
  ]);

  // Forecast Financeiro
  const [forecast, setForecast] = useState<ForecastData[]>([
    { periodo: 'Hoje', valor: 5200, casos: 7 },
    { periodo: 'Próximos 3 dias', valor: 18750, casos: 19 },
    { periodo: 'Semana atual', valor: 26480, casos: 26 },
    { periodo: 'Mês completo', valor: 71400, casos: 67 }
  ]);

  // Alertas Estratégicos
  const [alertas, setAlertas] = useState<AlertaData[]>([
    {
      id: '1',
      tipo: 'risco',
      icone: Flame,
      titulo: '5 casos de alto valor parados há mais de 3 dias',
      descricao: 'Casos prioritários sem movimentação',
      cor: 'red'
    },
    {
      id: '2',
      tipo: 'atencao',
      icone: AlertTriangle,
      titulo: 'Projeção do mês está 25% abaixo da meta',
      descricao: 'Necessário acelerar fechamento de acordos',
      cor: 'orange'
    },
    {
      id: '3',
      tipo: 'risco',
      icone: Timer,
      titulo: 'Casos urgentes aguardando retorno há mais de 24h',
      descricao: '3 casos marcados como urgentes',
      cor: 'red'
    },
    {
      id: '4',
      tipo: 'oportunidade',
      icone: Lightbulb,
      titulo: '3 follow-ups vencidos hoje ainda não atualizados',
      descricao: 'Oportunidade de conversão perdida',
      cor: 'blue'
    }
  ]);

  const calcularProgresso = (realizado: number, objetivo: number) => {
    return Math.min((realizado / objetivo) * 100, 100);
  };

  const formatarValor = (valor: number, tipo: 'valor' | 'quantidade', unidade: string) => {
    if (tipo === 'valor') {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return `${valor} ${unidade}`;
  };

  const getCorMeta = (progresso: number) => {
    if (progresso >= 80) return 'text-green-600';
    if (progresso >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCorAlerta = (tipo: string) => {
    switch (tipo) {
      case 'risco': return 'border-red-200 bg-red-50';
      case 'atencao': return 'border-orange-200 bg-orange-50';
      case 'oportunidade': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const atualizarDados = () => {
    setLoading(true);
    // Simular carregamento de dados
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard - Atendimento</h1>
          <p className="text-muted-foreground">Performance da equipe e acompanhamento de metas</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={atualizarDados}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Atualizar
          </Button>

          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Operacionais */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📊 KPIs Operacionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-3xl font-bold text-blue-600">{kpis.notificacoesEnviadas}</div>
              <p className="text-sm text-muted-foreground">Notificações enviadas</p>
              <p className="text-xs text-blue-600 mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-3xl font-bold text-green-600">{kpis.atendimentosRealizados}</div>
              <p className="text-sm text-muted-foreground">Atendimentos realizados</p>
              <p className="text-xs text-green-600 mt-1">WhatsApp, E-mail, 0800</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-3xl font-bold text-purple-600">{kpis.followUpHoje}</div>
              <p className="text-sm text-muted-foreground">Follow-ups agendados</p>
              <p className="text-xs text-purple-600 mt-1">Para hoje</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <div className="text-3xl font-bold text-red-600">{kpis.casosUrgentes}</div>
              <p className="text-sm text-muted-foreground">Casos urgentes</p>
              <p className="text-xs text-red-600 mt-1">Alta prioridade</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-3xl font-bold text-orange-600">{kpis.casosNegociacao}</div>
              <p className="text-sm text-muted-foreground">Em negociação</p>
              <p className="text-xs text-orange-600 mt-1">Aguardando retorno</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alertas Estratégicos - Posicionados em destaque */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🚨 Alertas Estratégicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertas.map((alerta) => {
            const IconeAlerta = alerta.icone;
            return (
              <Card key={alerta.id} className={cn("border-l-4", getCorAlerta(alerta.tipo))}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-full", 
                      alerta.cor === 'red' ? 'bg-red-100' :
                      alerta.cor === 'orange' ? 'bg-orange-100' :
                      alerta.cor === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                    )}>
                      <IconeAlerta className={cn("h-5 w-5",
                        alerta.cor === 'red' ? 'text-red-600' :
                        alerta.cor === 'orange' ? 'text-orange-600' :
                        alerta.cor === 'blue' ? 'text-blue-600' : 'text-gray-600'
                      )} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{alerta.titulo}</h4>
                      <p className="text-xs text-muted-foreground">{alerta.descricao}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Bell className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel de Metas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              🎯 Painel de Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {metas.map((meta, index) => {
              const progresso = calcularProgresso(meta.realizado, meta.objetivo);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{meta.titulo}</span>
                    <Badge variant="outline" className={getCorMeta(progresso)}>
                      {progresso.toFixed(0)}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Objetivo:</span>
                      <p className="font-medium">
                        {formatarValor(meta.objetivo, meta.tipo, meta.unidade)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Realizado:</span>
                      <p className="font-medium">
                        {formatarValor(meta.realizado, meta.tipo, meta.unidade)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Faltam:</span>
                      <p className="font-medium">
                        {formatarValor(meta.objetivo - meta.realizado, meta.tipo, meta.unidade)}
                      </p>
                    </div>
                  </div>

                  <Progress 
                    value={progresso} 
                    className={cn("h-3",
                      progresso >= 80 ? "text-green-600" :
                      progresso >= 60 ? "text-yellow-600" : "text-red-600"
                    )}
                  />

                  <div className="flex items-center gap-2 text-xs">
                    {progresso >= 80 ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">No ritmo para atingir a meta</span>
                      </>
                    ) : progresso >= 60 ? (
                      <>
                        <Clock className="h-3 w-3 text-yellow-600" />
                        <span className="text-yellow-600">Atenção: ritmo moderado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">Ação necessária: abaixo do esperado</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Forecast Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              🔮 Forecast Financeiro
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Projeção de receita baseada em casos com "Proposta aceita"
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecast.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.periodo}</p>
                    <p className="text-sm text-muted-foreground">{item.casos} casos ativos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-xs text-muted-foreground">Valor potencial</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Resumo do Forecast</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total potencial:</span>
                    <p className="font-bold text-blue-900">
                      R$ {forecast.reduce((sum, item) => sum + item.valor, 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Total de casos:</span>
                    <p className="font-bold text-blue-900">
                      {forecast.reduce((sum, item) => sum + item.casos, 0)} casos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance da Equipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Performance da Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <p className="text-sm text-muted-foreground">Taxa de resposta em 24h</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8.5 dias</div>
              <p className="text-sm text-muted-foreground">Tempo médio de resolução</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <p className="text-sm text-muted-foreground">Taxa de satisfação do cliente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}