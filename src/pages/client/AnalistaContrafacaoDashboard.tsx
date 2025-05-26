
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
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from "recharts";

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
      { estado: 'PR', notificacoes: 87, acordos: 15, desativacoes: 28 },
      { estado: 'SC', notificacoes: 76, acordos: 12, desativacoes: 24 },
      { estado: 'BA', notificacoes: 65, acordos: 11, desativacoes: 22 },
      { estado: 'GO', notificacoes: 54, acordos: 9, desativacoes: 18 },
      { estado: 'PE', notificacoes: 48, acordos: 8, desativacoes: 16 },
      { estado: 'CE', notificacoes: 42, acordos: 7, desativacoes: 14 },
      { estado: 'DF', notificacoes: 38, acordos: 6, desativacoes: 12 },
      { estado: 'ES', notificacoes: 34, acordos: 5, desativacoes: 11 },
      { estado: 'PB', notificacoes: 28, acordos: 4, desativacoes: 9 },
      { estado: 'RN', notificacoes: 25, acordos: 4, desativacoes: 8 },
      { estado: 'AL', notificacoes: 22, acordos: 3, desativacoes: 7 },
      { estado: 'MT', notificacoes: 19, acordos: 3, desativacoes: 6 },
      { estado: 'MS', notificacoes: 16, acordos: 2, desativacoes: 5 },
      { estado: 'SE', notificacoes: 14, acordos: 2, desativacoes: 4 },
      { estado: 'PI', notificacoes: 12, acordos: 2, desativacoes: 4 },
      { estado: 'TO', notificacoes: 10, acordos: 1, desativacoes: 3 },
      { estado: 'MA', notificacoes: 9, acordos: 1, desativacoes: 3 },
      { estado: 'PA', notificacoes: 8, acordos: 1, desativacoes: 2 },
      { estado: 'AM', notificacoes: 6, acordos: 1, desativacoes: 2 },
      { estado: 'RO', notificacoes: 5, acordos: 1, desativacoes: 2 },
      { estado: 'AC', notificacoes: 4, acordos: 0, desativacoes: 1 },
      { estado: 'RR', notificacoes: 3, acordos: 0, desativacoes: 1 },
      { estado: 'AP', notificacoes: 2, acordos: 0, desativacoes: 1 }
    ]
  });

  const [showAllStates, setShowAllStates] = useState(false);

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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Mapa do Brasil */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Mapa de Ações por Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border border-gray-200">
                <svg 
                  viewBox="0 0 500 400" 
                  className="w-full h-full"
                  style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)' }}
                >
                  {/* Contorno do Brasil */}
                  <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
                    </filter>
                  </defs>
                  
                  {/* Fundo do território brasileiro */}
                  <path
                    d="M120,50 Q150,40 180,50 L220,45 Q250,40 280,50 L320,55 Q340,60 350,80 L360,100 Q365,120 360,140 L355,160 Q350,180 340,200 L330,220 Q320,240 300,260 L280,280 Q260,300 240,310 L220,320 Q200,330 180,325 L160,320 Q140,315 120,300 L100,280 Q80,260 75,240 L70,220 Q65,200 70,180 L75,160 Q80,140 85,120 L90,100 Q95,80 105,65 L115,55 Q120,50 120,50 Z"
                    fill="rgba(59, 130, 246, 0.1)"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="2"
                    filter="url(#shadow)"
                  />

                  {/* Estados do Brasil com cores baseadas na intensidade de casos */}
                  {mapaStats.estadosRanking.map((estado, index) => {
                    const totalCasos = estado.notificacoes + estado.acordos + estado.desativacoes;
                    const intensity = Math.min(totalCasos / 250, 1); // Normaliza para 0-1
                    const color = `rgba(59, 130, 246, ${0.4 + intensity * 0.6})`; // Azul com intensidade variável
                    
                    // Posições mais precisas dos estados
                    const statePositions: { [key: string]: { x: number; y: number; width: number; height: number; shape?: string } } = {
                      // Região Norte
                      'AM': { x: 120, y: 80, width: 80, height: 60 },
                      'RR': { x: 160, y: 40, width: 40, height: 30 },
                      'AP': { x: 240, y: 50, width: 30, height: 35 },
                      'PA': { x: 200, y: 70, width: 70, height: 50 },
                      'TO': { x: 230, y: 120, width: 40, height: 50 },
                      'RO': { x: 140, y: 140, width: 30, height: 40 },
                      'AC': { x: 100, y: 140, width: 40, height: 30 },
                      
                      // Região Nordeste
                      'MA': { x: 270, y: 90, width: 50, height: 40 },
                      'PI': { x: 290, y: 130, width: 40, height: 45 },
                      'CE': { x: 330, y: 100, width: 40, height: 30 },
                      'RN': { x: 360, y: 105, width: 30, height: 25 },
                      'PB': { x: 370, y: 125, width: 25, height: 20 },
                      'PE': { x: 350, y: 140, width: 35, height: 30 },
                      'AL': { x: 365, y: 165, width: 20, height: 25 },
                      'SE': { x: 350, y: 180, width: 20, height: 20 },
                      'BA': { x: 300, y: 150, width: 60, height: 80 },
                      
                      // Região Centro-Oeste
                      'MT': { x: 170, y: 180, width: 60, height: 70 },
                      'MS': { x: 200, y: 240, width: 40, height: 50 },
                      'GO': { x: 230, y: 200, width: 50, height: 50 },
                      'DF': { x: 245, y: 215, width: 12, height: 12 },
                      
                      // Região Sudeste
                      'MG': { x: 280, y: 230, width: 55, height: 60 },
                      'ES': { x: 330, y: 250, width: 25, height: 30 },
                      'RJ': { x: 320, y: 280, width: 30, height: 25 },
                      'SP': { x: 270, y: 290, width: 50, height: 40 },
                      
                      // Região Sul
                      'PR': { x: 250, y: 320, width: 40, height: 35 },
                      'SC': { x: 270, y: 350, width: 35, height: 25 },
                      'RS': { x: 230, y: 360, width: 50, height: 55 }
                    };

                    const position = statePositions[estado.estado];
                    if (!position) return null;

                    return (
                      <g key={estado.estado}>
                        <rect
                          x={position.x}
                          y={position.y}
                          width={position.width}
                          height={position.height}
                          fill={color}
                          stroke="#2563eb"
                          strokeWidth="1.5"
                          className="hover:stroke-2 cursor-pointer transition-all hover:fill-opacity-80"
                          rx="3"
                          filter="url(#shadow)"
                        />
                        <text
                          x={position.x + position.width / 2}
                          y={position.y + position.height / 2 + 4}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white drop-shadow-sm"
                          style={{ fontSize: '10px', fontWeight: 'bold' }}
                        >
                          {estado.estado}
                        </text>
                        
                        {/* Indicador de volume de casos */}
                        {totalCasos > 100 && (
                          <circle
                            cx={position.x + position.width - 8}
                            cy={position.y + 8}
                            r="6"
                            fill="#ef4444"
                            stroke="white"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        )}
                        
                        {/* Tooltip */}
                        <title>
                          {`${estado.estado}: ${totalCasos} casos\nNotificações: ${estado.notificacoes}\nAcordos: ${estado.acordos}\nDesativações: ${estado.desativacoes}`}
                        </title>
                      </g>
                    );
                  })}
                  
                  {/* Título do mapa */}
                  <text x="250" y="25" textAnchor="middle" className="text-lg font-bold fill-gray-800">
                    Brasil - Distribuição de Casos por Estado
                  </text>
                  
                  {/* Indicadores de regiões */}
                  <text x="150" y="60" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Norte</text>
                  <text x="340" y="120" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Nordeste</text>
                  <text x="220" y="210" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Centro-Oeste</text>
                  <text x="310" y="270" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Sudeste</text>
                  <text x="260" y="370" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Sul</text>
                </svg>
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
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
                  <span className="text-sm">Baixa atividade</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 border border-blue-800 rounded"></div>
                  <span className="text-sm">Alta atividade</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ranking de Estados */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{showAllStates ? 'Ranking Completo' : 'Top 5 Estados'}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAllStates(!showAllStates)}
                >
                  {showAllStates ? 'Ver Menos' : 'Ver Todos'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              <div className={`space-y-2 ${showAllStates ? 'max-h-96 overflow-y-auto' : ''}`}>
                {(showAllStates ? mapaStats.estadosRanking : mapaStats.estadosRanking.slice(0, 5)).map((estado, index) => (
                  <div key={estado.estado} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors mx-1">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                        index < 3 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' 
                          : index < 5 
                          ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-lg">{estado.estado}</p>
                          <p className="text-sm font-medium text-muted-foreground">
                            {estado.notificacoes + estado.acordos + estado.desativacoes} casos
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-2 py-1">
                              {estado.notificacoes} Notificações
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 px-2 py-1">
                              {estado.acordos} Acordos
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 px-2 py-1">
                              {estado.desativacoes} Desativações
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.min((estado.notificacoes + estado.acordos + estado.desativacoes) / 250 * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {((estado.notificacoes + estado.acordos + estado.desativacoes) / 250 * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {showAllStates && (
                <div className="mt-4 mx-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-base">Resumo Nacional:</span>
                      <span className="font-medium">{mapaStats.estadosRanking.length} estados</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-blue-600 font-medium">Total Notificações:</span>
                        <span className="font-bold text-lg">
                          {mapaStats.estadosRanking.reduce((sum, estado) => sum + estado.notificacoes, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-green-600 font-medium">Total Acordos:</span>
                        <span className="font-bold text-lg">
                          {mapaStats.estadosRanking.reduce((sum, estado) => sum + estado.acordos, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-red-600 font-medium">Total Desativações:</span>
                        <span className="font-bold text-lg">
                          {mapaStats.estadosRanking.reduce((sum, estado) => sum + estado.desativacoes, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
