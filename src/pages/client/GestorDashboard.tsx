
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  FileText,
  Target,
  TrendingUp,
  MapPin,
  Download,
  Filter,
  Calendar,
  Building
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import BrazilInteractiveMap from '@/components/BrazilInteractiveMap';

export default function GestorDashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('30');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados mock - em produção virão da API
  const [dashboardData, setDashboardData] = useState({
    totalCases: 1247,
    activeCases: 342,
    resolvedCases: 751,
    urgentCases: 28,
    pendingNotifications: 45,
    totalIndemnifications: 2750000,
    avgResolutionTime: 12.5,
    monthlyGrowth: 8.2,
    successRate: 89.3,
    defaultRate: 4.7,
    recentCases: [
      {
        id: 'NIKE-2024-001',
        brand: 'Nike',
        title: 'Produtos falsificados - Mercado Livre',
        status: 'Em análise',
        priority: 'Alta',
        analyst: 'João Silva',
        createdAt: '2024-01-20',
        value: 15000
      },
      {
        id: 'ADIDAS-2024-045',
        brand: 'Adidas',
        title: 'Loja não autorizada - Instagram',
        status: 'Acordo fechado',
        priority: 'Média',
        analyst: 'Maria Santos',
        createdAt: '2024-01-19',
        value: 8500
      },
      {
        id: 'PUMA-2024-023',
        brand: 'Puma',
        title: 'Violação de marca - Facebook',
        status: 'Inadimplente',
        priority: 'Alta',
        analyst: 'Carlos Lima',
        createdAt: '2024-01-18',
        value: 12000
      }
    ],
    topAnalysts: [
      { name: 'João Silva', cases: 89, successRate: 94.2, avgTime: 8.5 },
      { name: 'Maria Santos', cases: 76, successRate: 91.8, avgTime: 9.1 },
      { name: 'Carlos Lima', cases: 68, successRate: 88.9, avgTime: 10.2 }
    ],
    brandStats: [
      { brand: 'Nike', cases: 456, resolved: 389, pending: 67, success: 92.1 },
      { brand: 'Adidas', cases: 342, resolved: 298, pending: 44, success: 89.5 },
      { brand: 'Puma', cases: 289, resolved: 245, pending: 44, success: 87.2 },
      { brand: 'Louis Vuitton', cases: 160, resolved: 142, pending: 18, success: 94.7 }
    ],
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
      { estado: 'MA', notificacoes: 10, acordos: 1, desativacoes: 3 },
      { estado: 'PA', notificacoes: 9, acordos: 1, desativacoes: 2 },
      { estado: 'TO', notificacoes: 8, acordos: 1, desativacoes: 2 },
      { estado: 'AC', notificacoes: 5, acordos: 1, desativacoes: 1 },
      { estado: 'AM', notificacoes: 7, acordos: 1, desativacoes: 2 },
      { estado: 'AP', notificacoes: 3, acordos: 0, desativacoes: 1 },
      { estado: 'RO', notificacoes: 6, acordos: 1, desativacoes: 1 },
      { estado: 'RR', notificacoes: 2, acordos: 0, desativacoes: 1 }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolvido':
      case 'Acordo fechado':
        return 'bg-green-100 text-green-800';
      case 'Em análise':
        return 'bg-blue-100 text-blue-800';
      case 'Inadimplente':
        return 'bg-red-100 text-red-800';
      case 'Aguardando aprovação':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-500';
      case 'Média':
        return 'bg-yellow-500';
      case 'Baixa':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Tratamento de erro
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold">Erro ao carregar dashboard</p>
            <p>{error}</p>
          </div>
          <Button onClick={() => {
            setError(null);
            window.location.reload();
          }}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Executivo</h1>
          <p className="text-muted-foreground">Visão consolidada da operação</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todas as marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as marcas</SelectItem>
              <SelectItem value="nike">Nike</SelectItem>
              <SelectItem value="adidas">Adidas</SelectItem>
              <SelectItem value="puma">Puma</SelectItem>
              <SelectItem value="lv">Louis Vuitton</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dias</SelectItem>
              <SelectItem value="30">30 dias</SelectItem>
              <SelectItem value="90">90 dias</SelectItem>
              <SelectItem value="365">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/client/gestor/relatorios')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Casos</p>
                <p className="text-3xl font-bold">{dashboardData.totalCases.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{dashboardData.monthlyGrowth}% este mês
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Casos Ativos</p>
                <p className="text-3xl font-bold">{dashboardData.activeCases}</p>
                <p className="text-sm text-muted-foreground">
                  {dashboardData.urgentCases} urgentes
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-3xl font-bold">{dashboardData.successRate}%</p>
                <p className="text-sm text-muted-foreground">
                  {dashboardData.resolvedCases} resolvidos
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Indenizações</p>
                <p className="text-3xl font-bold">
                  R$ {(dashboardData.totalIndemnifications / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-muted-foreground">
                  Média: {dashboardData.avgResolutionTime} dias
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/gestor/casos')}>
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium text-sm">Gestão de Casos</h3>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/gestor/aprovacoes')}>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium text-sm">Aprovações</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/gestor/financeiro')}>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium text-sm">Painel Financeiro</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/gestor/usuarios')}>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium text-sm">Usuários</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/gestor/marcas')}>
              <CardContent className="p-4 text-center">
                <Building className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <h3 className="font-medium text-sm">Por Marca</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/gestor/relatorios')}>
              <CardContent className="p-4 text-center">
                <Download className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <h3 className="font-medium text-sm">Relatórios</h3>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição Geográfica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Distribuição Geográfica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BrazilInteractiveMap estadosRanking={dashboardData.estadosRanking} />
          </CardContent>
        </Card>

        {/* Performance por Marca */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Marca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.brandStats?.map((brand) => (
              <div key={brand.brand} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{brand.brand}</span>
                    <span className="text-sm text-green-600 font-medium">{brand.success}%</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{brand.cases} casos</span>
                    <span>{brand.resolved} resolvidos</span>
                    <span>{brand.pending} pendentes</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Casos Recentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Casos Recentes</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/client/gestor/casos')}>
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentCases?.map((caso) => (
              <div key={caso.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                   onClick={() => navigate(`/client/casos/${caso.id}`)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{caso.id}</span>
                    <div className={cn("w-2 h-2 rounded-full", getPriorityColor(caso.priority))} />
                  </div>
                  <p className="text-sm text-muted-foreground">{caso.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{caso.brand}</span>
                    <span>{caso.analyst}</span>
                    <span>R$ {caso.value.toLocaleString()}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(caso.status)}>
                  {caso.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Analistas */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Analistas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.topAnalysts?.map((analyst, index) => (
              <div key={analyst.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{analyst.name}</p>
                    <p className="text-sm text-muted-foreground">{analyst.cases} casos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{analyst.successRate}%</p>
                  <p className="text-xs text-muted-foreground">{analyst.avgTime}d médio</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
