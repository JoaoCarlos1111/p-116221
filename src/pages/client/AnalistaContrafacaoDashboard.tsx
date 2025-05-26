
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Timer,
  Mail,
  FileText,
  Shield,
  TrendingUp,
  Search,
  Plus,
  History,
  MessageSquare,
  Eye,
  MapPin,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Cell } from "recharts";

const AnalistaContrafacaoDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // KPIs Pessoais do Analista
  const [kpisAnalistaStats, setKpisAnalistaStats] = useState({
    casosAprovados: 156,
    percentualAprovacao: 87.4,
    casosReprovados: 22,
    casosAguardandoAprovacao: 8,
    casosUrgentes: 3,
    tempoMedioAprovacao: 2.3 // em horas
  });

  // Visão Geral Operacional
  const [operacionalStats, setOperacionalStats] = useState({
    notificacoesEnviadas: 1247,
    acordosExtrajudiciais: 89,
    paginasDesativadas: 342,
    tempoMedioResolucao: 8.5, // em dias
    casosAndamento: 67,
    casosConcluidos: 198,
    casosNegociacao: 23
  });

  // Dados do Mapa Brasil
  const [mapaStats, setMapaStats] = useState({
    estadosRanking: [
      { estado: 'SP', notificacoes: 234, acordos: 45, desativacoes: 89 },
      { estado: 'RJ', notificacoes: 187, acordos: 32, desativacoes: 67 },
      { estado: 'MG', notificacoes: 156, acordos: 28, desativacoes: 54 },
      { estado: 'RS', notificacoes: 98, acordos: 19, desativacoes: 32 },
      { estado: 'PR', notificacoes: 87, acordos: 15, desativacoes: 28 }
    ]
  });

  // Dados para gráficos
  const evolucaoMensal = [
    { mes: 'Ago', notificacoes: 89, acordos: 12, desativacoes: 45 },
    { mes: 'Set', notificacoes: 156, acordos: 18, desativacoes: 67 },
    { mes: 'Out', notificacoes: 178, acordos: 22, desativacoes: 78 },
    { mes: 'Nov', notificacoes: 134, acordos: 15, desativacoes: 56 },
    { mes: 'Dez', notificacoes: 203, acordos: 28, desativacoes: 89 },
    { mes: 'Jan', notificacoes: 247, acordos: 35, desativacoes: 98 }
  ];

  const categoriasProdutos = [
    { categoria: 'Eletrônicos', valor: 234, cor: '#8884d8' },
    { categoria: 'Vestuário', valor: 187, cor: '#82ca9d' },
    { categoria: 'Cosméticos', valor: 156, cor: '#ffc658' },
    { categoria: 'Calçados', valor: 98, cor: '#ff7300' },
    { categoria: 'Acessórios', valor: 67, cor: '#00ff88' }
  ];

  const tempoMedioPorTipo = [
    { tipo: 'Notificação', tempo: 2.1 },
    { tipo: 'Acordo', tempo: 15.7 },
    { tipo: 'Desativação', tempo: 4.3 },
    { tipo: 'Investigação', tempo: 8.9 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Analista de Contrafação</h1>
          <p className="text-muted-foreground">Visão completa dos seus casos e performance operacional</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar caso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
            <Plus className="h-5 w-5 mr-2" />
            Novo Caso
          </Button>
        </div>
      </div>

      {/* 1. KPIs Pessoais do Analista */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Minha Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpisAnalistaStats.casosAprovados}</div>
              <p className="text-xs text-green-600">
                {kpisAnalistaStats.percentualAprovacao}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reprovados</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpisAnalistaStats.casosReprovados}</div>
              <p className="text-xs text-red-600">
                {(100 - kpisAnalistaStats.percentualAprovacao).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpisAnalistaStats.casosAguardandoAprovacao}</div>
              <p className="text-xs text-muted-foreground">
                Para aprovação
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpisAnalistaStats.casosUrgentes}</div>
              <p className="text-xs text-orange-600">
                Alta prioridade
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio Aprovação</CardTitle>
              <Timer className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpisAnalistaStats.tempoMedioAprovacao}h</div>
              <div className="mt-2">
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Meta: 3h | Performance: Excelente
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Visão Geral da Operação */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          Visão Geral Operacional
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificações Enviadas</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operacionalStats.notificacoesEnviadas.toLocaleString()}</div>
              <p className="text-xs text-blue-600">+12% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acordos Extrajudiciais</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operacionalStats.acordosExtrajudiciais}</div>
              <p className="text-xs text-green-600">+8% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Páginas Desativadas</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operacionalStats.paginasDesativadas}</div>
              <p className="text-xs text-red-600">+15% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio Resolução</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operacionalStats.tempoMedioResolucao} dias</div>
              <p className="text-xs text-orange-600">-5% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Status dos Casos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold">{operacionalStats.casosAndamento}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold">{operacionalStats.casosConcluidos}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Negociação</p>
                  <p className="text-2xl font-bold">{operacionalStats.casosNegociacao}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Mapa do Brasil + Ranking */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          Distribuição por Estados
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulação do Mapa do Brasil */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mapa de Ações por Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Mapa Interativo do Brasil</p>
                  <p className="text-sm text-gray-500">Distribuição de casos por estado</p>
                </div>
              </div>
              
              {/* Legenda */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Notificações</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Acordos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Desativações</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ranking de Estados */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Estados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mapaStats.estadosRanking.map((estado, index) => (
                <div key={estado.estado} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{estado.estado}</p>
                      <p className="text-xs text-muted-foreground">
                        Total: {estado.notificacoes + estado.acordos + estado.desativacoes}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {estado.notificacoes} N
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {estado.acordos} A
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {estado.desativacoes} D
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucaoMensal}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="notificacoes" stroke="#3b82f6" strokeWidth={2} name="Notificações" />
                  <Line type="monotone" dataKey="acordos" stroke="#10b981" strokeWidth={2} name="Acordos" />
                  <Line type="monotone" dataKey="desativacoes" stroke="#ef4444" strokeWidth={2} name="Desativações" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Categorias de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Principais Categorias Falsificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoriasProdutos}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="valor"
                  >
                    {categoriasProdutos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {categoriasProdutos.map((categoria, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoria.cor }}></div>
                  <span className="text-sm">{categoria.categoria}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tempo Médio por Tipo */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tempo Médio por Tipo de Caso (dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tempoMedioPorTipo}>
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tempo" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Ações Rápidas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/analista/historico')}>
            <CardContent className="p-6 text-center">
              <History className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Meu Histórico</h3>
              <p className="text-sm text-muted-foreground">Casos adicionados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/analista/approvals')}>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="font-medium">Análises Pendentes</h3>
              <p className="text-sm text-muted-foreground">{kpisAnalistaStats.casosAguardandoAprovacao} casos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium">Comentários</h3>
              <p className="text-sm text-muted-foreground">Recentes</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-medium">Casos Urgentes</h3>
              <p className="text-sm text-muted-foreground">{kpisAnalistaStats.casosUrgentes} prioridades</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium">Relatórios</h3>
              <p className="text-sm text-muted-foreground">Performance</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alertas e Notificações */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">Notificações Importantes</h3>
              <p className="text-sm text-blue-700">
                Você tem {kpisAnalistaStats.casosAguardandoAprovacao} casos aguardando aprovação e {kpisAnalistaStats.casosUrgentes} casos marcados como urgentes.
              </p>
            </div>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Ver Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalistaContrafacaoDashboard;
