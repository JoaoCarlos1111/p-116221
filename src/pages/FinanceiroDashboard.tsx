
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar,
  Download,
  Plus,
  CreditCard,
  FileText,
  Receipt
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const FinanceiroDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [stats, setStats] = useState({
    totalRevenue: 125000,
    pendingPayments: 18500,
    overduePayments: 5200,
    thisMonthCases: 42,
    avgTicket: 2800,
    collectionRate: 87
  });

  const recentPayments = [
    {
      id: 'PAG-001',
      case: 'NIKE-042',
      client: 'Empresa XYZ Ltda',
      amount: 3500,
      status: 'Pago',
      dueDate: '2024-01-15',
      paymentDate: '2024-01-15',
      method: 'Boleto',
      installment: '1/3'
    },
    {
      id: 'PAG-002',
      case: 'ADIDAS-089',
      client: 'Tech Solutions',
      amount: 1800,
      status: 'Em atraso',
      dueDate: '2024-01-10',
      paymentDate: null,
      method: 'PIX',
      installment: '2/4'
    },
    {
      id: 'PAG-003',
      case: 'NIKE-041',
      client: 'Fashion Corp',
      amount: 5200,
      status: 'Pendente',
      dueDate: '2024-01-20',
      paymentDate: null,
      method: 'Transferência',
      installment: '1/1'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Em atraso': return 'bg-red-100 text-red-800';
      case 'Cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = recentPayments.filter(payment => {
    const matchesSearch = payment.case.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header com botão destacado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">Gestão de pagamentos e documentos fiscais</p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg" onClick={() => navigate('/client/financeiro/faturas')}>
          <Plus className="h-5 w-5 mr-2" />
          Ver Faturas
        </Button>
      </div>

      {/* Stats Cards Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-600">+12% vs mês anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingPayments.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              A receber este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overduePayments.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonthCases} casos este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Financeira */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance de Cobrança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Taxa de Recebimento</span>
                <span>{stats.collectionRate}%</span>
              </div>
              <Progress value={stats.collectionRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Meta Mensal</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center" onClick={() => navigate('/financeiro')}>
                <CreditCard className="h-5 w-5 mb-1" />
                <span className="text-xs">Gestão Pagamentos</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Receipt className="h-5 w-5 mb-1" />
                <span className="text-xs">Gerar Boletos</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Download className="h-5 w-5 mb-1" />
                <span className="text-xs">Exportar Relatório</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <FileText className="h-5 w-5 mb-1" />
                <span className="text-xs">Contratos</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Buscar por caso, cliente ou código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Pago">Pago</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Em atraso">Em atraso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Pagamentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pagamentos Recentes ({filteredPayments.length})</CardTitle>
          <Button variant="outline" onClick={() => navigate('/financeiro')}>
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/financeiro/${payment.id}`)}>
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{payment.client}</h4>
                      <span className="text-sm text-muted-foreground">({payment.installment})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>#{payment.id}</span>
                      <span>•</span>
                      <span>Caso {payment.case}</span>
                      <span>•</span>
                      <span>{payment.method}</span>
                      <span>•</span>
                      <span>Venc: {payment.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold">
                      {payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    {payment.paymentDate && (
                      <div className="text-xs text-muted-foreground">
                        Pago em {payment.paymentDate}
                      </div>
                    )}
                  </div>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroDashboard;
