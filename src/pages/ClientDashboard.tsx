import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Eye,
  Download
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCases: 156,
    activeCases: 42,
    resolvedCases: 98,
    pendingApproval: 16,
    thisMonthCases: 23,
    avgResolutionTime: 8.5
  });

  const recentCases = [
    {
      id: 'NIKE-001',
      title: 'Produto falsificado no Mercado Livre',
      brand: 'Nike',
      status: 'Em análise',
      priority: 'Alta',
      date: '2024-01-15',
      platform: 'Mercado Livre'
    },
    {
      id: 'ADIDAS-003',
      title: 'Loja não autorizada no Instagram',
      brand: 'Adidas',
      status: 'Aguardando aprovação',
      priority: 'Média',
      date: '2024-01-14',
      platform: 'Instagram'
    },
    {
      id: 'NIKE-005',
      title: 'Violação de marca no Facebook',
      brand: 'Nike',
      status: 'Resolvido',
      priority: 'Baixa',
      date: '2024-01-13',
      platform: 'Facebook'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolvido': return 'bg-green-100 text-green-800';
      case 'Em análise': return 'bg-blue-100 text-blue-800';
      case 'Aguardando aprovação': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Média': return 'bg-orange-100 text-orange-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard - Cliente</h1>
          <p className="text-muted-foreground">Acompanhe seus casos de proteção de marca</p>
        </div>
        <Button onClick={() => navigate('/cases/new')}>
          Novo Caso
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Casos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCases}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.thisMonthCases} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCases}</div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Resolvidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedCases}</div>
            <p className="text-xs text-muted-foreground">
              Taxa de sucesso: 94%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">
              Requer sua aprovação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance do Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Casos Resolvidos</span>
                <span>18/23 (78%)</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tempo Médio de Resolução</span>
                <span>{stats.avgResolutionTime} dias</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Taxa de Aprovação</span>
                <span>94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Minhas Marcas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Nike</h4>
                  <p className="text-sm text-muted-foreground">28 casos ativos</p>
                </div>
                <Badge variant="secondary">Ativa</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Adidas</h4>
                  <p className="text-sm text-muted-foreground">14 casos ativos</p>
                </div>
                <Badge variant="secondary">Ativa</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Casos Recentes</CardTitle>
          <Button variant="outline" onClick={() => navigate('/cases')}>
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCases.map((case_item) => (
              <div key={case_item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium">{case_item.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>#{case_item.id}</span>
                      <span>•</span>
                      <span>{case_item.brand}</span>
                      <span>•</span>
                      <span>{case_item.platform}</span>
                      <span>•</span>
                      <span>{case_item.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(case_item.status)}>
                    {case_item.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(case_item.priority)}>
                    {case_item.priority}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center" onClick={() => navigate('/cases/new')}>
              <AlertTriangle className="h-6 w-6 mb-2" />
              Reportar Violação
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => navigate('/client/approvals')}>
              <CheckCircle className="h-6 w-6 mb-2" />
              Revisar Aprovações
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => navigate('/reports')}>
              <Download className="h-6 w-6 mb-2" />
              Baixar Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;