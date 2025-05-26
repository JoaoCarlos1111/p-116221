
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
                  <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
                    </filter>
                    <pattern id="waterPattern" patternUnits="userSpaceOnUse" width="4" height="4">
                      <rect width="4" height="4" fill="#e0f2fe"/>
                      <circle cx="2" cy="2" r="0.5" fill="#0284c7" opacity="0.3"/>
                    </pattern>
                  </defs>
                  
                  {/* Contorno do Brasil mais realista */}
                  <path
                    d="M140,60 Q160,45 185,50 Q210,45 240,50 Q270,48 300,55 Q330,60 350,75 Q365,90 370,110 Q375,130 380,150 Q385,170 385,190 Q380,210 375,230 Q370,250 360,270 Q350,290 335,305 Q320,320 300,330 Q280,340 260,345 Q240,350 220,348 Q200,346 180,340 Q160,334 145,325 Q130,316 120,300 Q110,284 105,265 Q100,246 98,225 Q96,204 100,185 Q104,166 112,148 Q120,130 130,115 Q135,90 140,60 Z"
                    fill="url(#waterPattern)"
                    stroke="rgba(59, 130, 246, 0.4)"
                    strokeWidth="3"
                    filter="url(#shadow)"
                    opacity="0.3"
                  />

                  {/* Estados do Brasil com formas mais realistas */}
                  {mapaStats.estadosRanking.map((estado, index) => {
                    const totalCasos = estado.notificacoes + estado.acordos + estado.desativacoes;
                    const intensity = Math.min(totalCasos / 250, 1);
                    const color = `rgba(59, 130, 246, ${0.5 + intensity * 0.4})`;
                    
                    // Definindo formas específicas dos estados com paths SVG
                    const statePaths: { [key: string]: { path: string; textX: number; textY: number } } = {
                      // Região Norte
                      'AM': { 
                        path: "M120,80 Q140,75 165,80 Q185,85 200,95 Q205,110 200,125 Q195,140 185,150 Q170,155 155,150 Q140,145 130,135 Q120,125 118,110 Q118,95 120,80 Z", 
                        textX: 160, textY: 120 
                      },
                      'RR': { 
                        path: "M160,40 Q180,38 195,45 Q200,55 195,65 Q190,75 180,80 Q170,82 160,80 Q150,78 145,70 Q140,62 142,52 Q144,42 160,40 Z", 
                        textX: 170, textY: 60 
                      },
                      'AP': { 
                        path: "M240,50 Q255,48 265,55 Q270,65 268,75 Q266,85 255,90 Q245,92 240,85 Q235,78 237,68 Q239,58 240,50 Z", 
                        textX: 250, textY: 70 
                      },
                      'PA': { 
                        path: "M200,70 Q220,68 245,75 Q265,80 270,95 Q268,110 260,120 Q250,125 235,122 Q220,120 210,115 Q200,110 195,100 Q190,90 195,80 Q198,75 200,70 Z", 
                        textX: 235, textY: 95 
                      },
                      'TO': { 
                        path: "M230,120 Q245,118 255,125 Q260,135 258,145 Q256,155 250,165 Q240,170 235,160 Q230,150 232,140 Q234,130 230,120 Z", 
                        textX: 245, textY: 145 
                      },
                      'RO': { 
                        path: "M140,140 Q155,138 165,145 Q170,155 168,165 Q166,175 155,180 Q145,182 140,175 Q135,168 137,158 Q139,148 140,140 Z", 
                        textX: 152, textY: 160 
                      },
                      'AC': { 
                        path: "M100,140 Q120,138 135,145 Q140,155 138,165 Q136,175 125,180 Q115,182 105,175 Q95,168 97,158 Q99,148 100,140 Z", 
                        textX: 118, textY: 160 
                      },
                      
                      // Região Nordeste
                      'MA': { 
                        path: "M270,90 Q290,88 310,95 Q320,105 318,115 Q316,125 305,130 Q290,132 280,127 Q270,122 268,112 Q266,102 270,90 Z", 
                        textX: 290, textY: 112 
                      },
                      'PI': { 
                        path: "M290,130 Q305,128 320,135 Q325,145 323,155 Q321,165 315,170 Q305,172 295,167 Q285,162 287,152 Q289,142 290,130 Z", 
                        textX: 305, textY: 152 
                      },
                      'CE': { 
                        path: "M330,100 Q350,98 365,105 Q370,115 368,125 Q366,135 355,140 Q345,142 335,137 Q325,132 327,122 Q329,112 330,100 Z", 
                        textX: 347, textY: 122 
                      },
                      'RN': { 
                        path: "M360,105 Q375,103 385,110 Q390,120 388,130 Q386,140 375,145 Q365,147 360,140 Q355,133 357,123 Q359,113 360,105 Z", 
                        textX: 372, textY: 125 
                      },
                      'PB': { 
                        path: "M370,125 Q385,123 390,130 Q395,140 393,150 Q391,160 380,165 Q370,167 365,160 Q360,153 362,143 Q364,133 370,125 Z", 
                        textX: 377, textY: 145 
                      },
                      'PE': { 
                        path: "M350,140 Q370,138 380,145 Q385,155 383,165 Q381,175 370,180 Q360,182 350,177 Q340,172 342,162 Q344,152 350,140 Z", 
                        textX: 365, textY: 162 
                      },
                      'AL': { 
                        path: "M365,165 Q375,163 380,170 Q385,180 383,190 Q381,200 375,205 Q365,207 360,200 Q355,193 357,183 Q359,173 365,165 Z", 
                        textX: 372, textY: 185 
                      },
                      'SE': { 
                        path: "M350,180 Q360,178 365,185 Q370,195 368,205 Q366,215 360,220 Q350,222 345,215 Q340,208 342,198 Q344,188 350,180 Z", 
                        textX: 355, textY: 200 
                      },
                      'BA': { 
                        path: "M300,150 Q330,148 350,155 Q360,165 358,180 Q356,195 350,210 Q340,225 325,230 Q310,232 300,227 Q290,222 288,207 Q286,192 290,177 Q294,162 300,150 Z", 
                        textX: 325, textY: 190 
                      },
                      
                      // Região Centro-Oeste
                      'MT': { 
                        path: "M170,180 Q200,178 225,185 Q235,195 233,210 Q231,225 225,240 Q215,250 200,245 Q185,240 175,230 Q165,220 167,205 Q169,190 170,180 Z", 
                        textX: 200, textY: 212 
                      },
                      'MS': { 
                        path: "M200,240 Q220,238 235,245 Q240,255 238,270 Q236,285 230,295 Q220,300 210,295 Q200,290 198,275 Q196,260 200,240 Z", 
                        textX: 218, textY: 267 
                      },
                      'GO': { 
                        path: "M230,200 Q255,198 275,205 Q285,215 283,230 Q281,245 275,255 Q265,260 250,255 Q235,250 230,235 Q225,220 230,200 Z", 
                        textX: 252, textY: 227 
                      },
                      'DF': { 
                        path: "M245,215 Q255,213 260,220 Q265,230 263,240 Q261,250 255,255 Q245,257 240,250 Q235,243 237,233 Q239,223 245,215 Z", 
                        textX: 250, textY: 235 
                      },
                      
                      // Região Sudeste
                      'MG': { 
                        path: "M280,230 Q310,228 330,235 Q340,245 338,260 Q336,275 330,285 Q320,290 305,285 Q290,280 280,270 Q270,260 272,245 Q274,235 280,230 Z", 
                        textX: 305, textY: 257 
                      },
                      'ES': { 
                        path: "M330,250 Q345,248 355,255 Q360,265 358,275 Q356,285 350,290 Q340,292 335,285 Q330,278 332,268 Q334,258 330,250 Z", 
                        textX: 342, textY: 270 
                      },
                      'RJ': { 
                        path: "M320,280 Q340,278 350,285 Q355,295 353,305 Q351,315 345,320 Q335,322 325,317 Q315,312 317,302 Q319,292 320,280 Z", 
                        textX: 335, textY: 300 
                      },
                      'SP': { 
                        path: "M270,290 Q300,288 320,295 Q330,305 328,320 Q326,335 320,345 Q310,350 295,345 Q280,340 270,330 Q260,320 262,305 Q264,295 270,290 Z", 
                        textX: 295, textY: 317 
                      },
                      
                      // Região Sul
                      'PR': { 
                        path: "M250,320 Q270,318 285,325 Q290,335 288,350 Q286,365 280,370 Q270,372 260,367 Q250,362 248,347 Q246,332 250,320 Z", 
                        textX: 268, textY: 345 
                      },
                      'SC': { 
                        path: "M270,350 Q290,348 305,355 Q310,365 308,375 Q306,385 300,390 Q290,392 280,387 Q270,382 272,372 Q274,362 270,350 Z", 
                        textX: 287, textY: 372 
                      },
                      'RS': { 
                        path: "M230,360 Q260,358 275,365 Q285,375 283,390 Q281,405 275,415 Q265,420 250,415 Q235,410 225,400 Q215,390 217,375 Q219,365 230,360 Z", 
                        textX: 250, textY: 387 
                      }
                    };

                    const stateData = statePaths[estado.estado];
                    if (!stateData) return null;

                    return (
                      <g key={estado.estado}>
                        <path
                          d={stateData.path}
                          fill={color}
                          stroke="#1e40af"
                          strokeWidth="1.5"
                          className="hover:stroke-2 cursor-pointer transition-all hover:fill-opacity-80"
                          filter="url(#shadow)"
                        />
                        <text
                          x={stateData.textX}
                          y={stateData.textY}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white drop-shadow-md pointer-events-none"
                          style={{ fontSize: '10px', fontWeight: 'bold' }}
                        >
                          {estado.estado}
                        </text>
                        
                        {/* Indicador de volume de casos */}
                        {totalCasos > 100 && (
                          <circle
                            cx={stateData.textX + 15}
                            cy={stateData.textY - 10}
                            r="4"
                            fill="#dc2626"
                            stroke="white"
                            strokeWidth="1.5"
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
                  <text x="160" y="65" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Norte</text>
                  <text x="350" y="115" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Nordeste</text>
                  <text x="220" y="200" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Centro-Oeste</text>
                  <text x="315" y="265" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Sudeste</text>
                  <text x="265" y="375" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Sul</text>
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
            <CardContent>
              <div className={`space-y-3 ${showAllStates ? 'max-h-96 overflow-y-auto' : ''}`}>
                {(showAllStates ? mapaStats.estadosRanking : mapaStats.estadosRanking.slice(0, 5)).map((estado, index) => (
                  <div key={estado.estado} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        index < 3 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' 
                          : index < 5 
                          ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{estado.estado}</p>
                        <p className="text-xs text-muted-foreground">
                          Total: {estado.notificacoes + estado.acordos + estado.desativacoes} casos
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {estado.notificacoes} N
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          {estado.acordos} A
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                          {estado.desativacoes} D
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {showAllStates && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Resumo Nacional:</span>
                      <span>{mapaStats.estadosRanking.length} estados</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-blue-600">Total Notificações:</span>
                        <span className="font-bold ml-1">
                          {mapaStats.estadosRanking.reduce((sum, estado) => sum + estado.notificacoes, 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-600">Total Acordos:</span>
                        <span className="font-bold ml-1">
                          {mapaStats.estadosRanking.reduce((sum, estado) => sum + estado.acordos, 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-red-600">Total Desativações:</span>
                        <span className="font-bold ml-1">
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
