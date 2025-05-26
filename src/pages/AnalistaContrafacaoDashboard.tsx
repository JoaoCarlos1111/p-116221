
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  Plus,
  Eye,
  MessageSquare,
  Upload,
  Flag
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AnalistaContrafacaoDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [stats, setStats] = useState({
    totalCases: 89,
    pendingApproval: 12,
    inAnalysis: 24,
    urgent: 5,
    thisWeekApproved: 18,
    avgResponseTime: 2.3
  });

  const pendingCases = [
    {
      id: 'NIKE-042',
      title: 'Loja falsificada no Instagram',
      brand: 'Nike',
      status: 'Aguardando aprovação',
      priority: 'Alta',
      date: '2024-01-15',
      platform: 'Instagram',
      evidences: 3,
      hasAIsuggestion: true
    },
    {
      id: 'ADIDAS-089',
      title: 'Produto falsificado marketplace',
      brand: 'Adidas',
      status: 'Em análise interna',
      priority: 'Média',
      date: '2024-01-14',
      platform: 'Mercado Livre',
      evidences: 5,
      hasAIsuggestion: false
    },
    {
      id: 'NIKE-041',
      title: 'Violação de marca Facebook',
      brand: 'Nike',
      status: 'Aguardando cliente',
      priority: 'Urgente',
      date: '2024-01-13',
      platform: 'Facebook',
      evidences: 2,
      hasAIsuggestion: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aguardando aprovação': return 'bg-yellow-100 text-yellow-800';
      case 'Em análise interna': return 'bg-blue-100 text-blue-800';
      case 'Aguardando cliente': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgente': return 'bg-red-100 text-red-800';
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Média': return 'bg-orange-100 text-orange-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = pendingCases.filter(case_item => {
    const matchesSearch = case_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header com botão destacado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Analista de Contrafação</h1>
          <p className="text-muted-foreground">Validação e aprovação de casos operacionais</p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg" onClick={() => navigate('/cases/new')}>
          <Plus className="h-5 w-5 mr-2" />
          Novo Caso
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Casos</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCases}</div>
            <p className="text-xs text-muted-foreground">
              Total atribuído a mim
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">
              Requer minha aprovação
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inAnalysis}</div>
            <p className="text-xs text-muted-foreground">
              Em análise interna
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <Flag className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">
              Alta prioridade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Minha Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Casos Aprovados esta Semana</span>
                <span>{stats.thisWeekApproved}/25 (72%)</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tempo Médio de Resposta</span>
                <span>{stats.avgResponseTime} horas</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center" onClick={() => navigate('/client/approvals')}>
                <CheckCircle className="h-5 w-5 mb-1" />
                <span className="text-xs">Revisar Aprovações</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <MessageSquare className="h-5 w-5 mb-1" />
                <span className="text-xs">IA Sugestões</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Upload className="h-5 w-5 mb-1" />
                <span className="text-xs">Upload Provas</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Flag className="h-5 w-5 mb-1" />
                <span className="text-xs">Marcar Urgente</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por caso, marca ou plataforma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Aguardando aprovação">Aguardando aprovação</SelectItem>
            <SelectItem value="Em análise interna">Em análise interna</SelectItem>
            <SelectItem value="Aguardando cliente">Aguardando cliente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Casos Pendentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Casos Pendentes ({filteredCases.length})</CardTitle>
          <Button variant="outline" onClick={() => navigate('/cases')}>
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCases.map((case_item) => (
              <div key={case_item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/case/${case_item.id}`)}>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{case_item.title}</h4>
                      {case_item.hasAIsuggestion && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          IA
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>#{case_item.id}</span>
                      <span>•</span>
                      <span>{case_item.brand}</span>
                      <span>•</span>
                      <span>{case_item.platform}</span>
                      <span>•</span>
                      <span>{case_item.evidences} provas</span>
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
    </div>
  );
};

export default AnalistaContrafacaoDashboard;
