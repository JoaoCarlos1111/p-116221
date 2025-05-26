
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  TrendingDown,
  Mail,
  FileBarChart,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { format, subMonths, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const FaturasPagamentos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodoFilter, setPeriodoFilter] = useState('todos');
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [observacoes, setObservacoes] = useState({});
  const [showInadimplenciaReport, setShowInadimplenciaReport] = useState(false);

  // Dados de inadimplência agrupados por contrafator
  const inadimplenciaReport = [
    {
      contrafator: 'Tech Solutions Inc',
      parcelasVencidas: 2,
      valorTotal: 4500,
      ultimoPagamento: '2024-01-15',
      proximaAcao: 'Reenvio de boleto',
      diasAtraso: 15,
      casos: ['CASO-2024-002']
    },
    {
      contrafator: 'MKT Falsos Corp',
      parcelasVencidas: 1,
      valorTotal: 2300,
      ultimoPagamento: '2024-02-01',
      proximaAcao: 'Cobrança extrajudicial',
      diasAtraso: 8,
      casos: ['CASO-2024-005']
    }
  ];

  const parcelamentos = [
    {
      id: 'PARC-001',
      caso: 'CASO-2024-001',
      contrafator: 'Empresa ABC Ltda',
      valorTotal: 15000,
      totalParcelas: 5,
      parcelas: [
        { numero: 1, valor: 3000, vencimento: '2024-02-15', status: 'Pago', pagamento: '2024-02-15', comprovante: true },
        { numero: 2, valor: 3000, vencimento: '2024-03-15', status: 'Pago', pagamento: '2024-03-15', comprovante: true },
        { numero: 3, valor: 3000, vencimento: '2024-04-15', status: 'Pendente', pagamento: null, comprovante: false },
        { numero: 4, valor: 3000, vencimento: '2024-05-15', status: 'Pendente', pagamento: null, comprovante: false },
        { numero: 5, valor: 3000, vencimento: '2024-06-15', status: 'Pendente', pagamento: null, comprovante: false }
      ],
      totalRecebido: 6000,
      observacoes: 'Cliente demonstrou boa vontade em regularizar.'
    },
    {
      id: 'PARC-002',
      caso: 'CASO-2024-002',
      contrafator: 'Tech Solutions Inc',
      valorTotal: 8000,
      totalParcelas: 4,
      parcelas: [
        { numero: 1, valor: 2000, vencimento: '2024-01-15', status: 'Pago', pagamento: '2024-01-15', comprovante: true },
        { numero: 2, valor: 2000, vencimento: '2024-02-15', status: 'Vencido', pagamento: null, comprovante: false },
        { numero: 3, valor: 2000, vencimento: '2024-03-15', status: 'Pendente', pagamento: null, comprovante: false },
        { numero: 4, valor: 2000, vencimento: '2024-04-15', status: 'Pendente', pagamento: null, comprovante: false }
      ],
      totalRecebido: 2000,
      observacoes: ''
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pago': return <CheckCircle className="h-4 w-4" />;
      case 'Pendente': return <Clock className="h-4 w-4" />;
      case 'Vencido': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDateRangeForFilter = () => {
    const now = new Date();
    switch (periodoFilter) {
      case 'ultimo_mes':
        return { from: subMonths(now, 1), to: now };
      case 'ultimos_3_meses':
        return { from: subMonths(now, 3), to: now };
      case 'ultimos_6_meses':
        return { from: subMonths(now, 6), to: now };
      case 'ultimo_ano':
        return { from: subMonths(now, 12), to: now };
      case 'personalizado':
        return dateRange;
      default:
        return null;
    }
  };

  const filteredParcelamentos = parcelamentos.filter(parc => {
    const matchesSearch = parc.caso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parc.contrafator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         parc.parcelas.some(p => p.status.toLowerCase() === statusFilter);
    
    // Filtro de período baseado na data de vencimento das parcelas
    let matchesPeriod = true;
    const filterDateRange = getDateRangeForFilter();
    if (filterDateRange && filterDateRange.from && filterDateRange.to) {
      matchesPeriod = parc.parcelas.some(parcela => {
        const vencimento = new Date(parcela.vencimento);
        return isWithinInterval(vencimento, {
          start: startOfDay(filterDateRange.from),
          end: endOfDay(filterDateRange.to)
        });
      });
    }
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const handleObservacaoChange = (parcId, value) => {
    setObservacoes(prev => ({
      ...prev,
      [parcId]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Faturas e Pagamentos</h1>
          <p className="text-muted-foreground">Gestão de indenizações parceladas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showInadimplenciaReport ? "default" : "outline"}
            onClick={() => setShowInadimplenciaReport(!showInadimplenciaReport)}
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            {showInadimplenciaReport ? "Ocultar" : "Ver"} Inadimplência
          </Button>
          <Button onClick={() => navigate('/client/financeiro/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>

      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredParcelamentos.reduce((acc, p) => acc + p.totalRecebido, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-sm text-muted-foreground">Total Recebido</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredParcelamentos.reduce((acc, p) => acc + (p.valorTotal - p.totalRecebido), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-sm text-muted-foreground">A Receber</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredParcelamentos.length}
              </div>
              <p className="text-sm text-muted-foreground">Parcelamentos Ativos</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                <AlertTriangle className="h-6 w-6" />
                {filteredParcelamentos.reduce((acc, p) => acc + p.parcelas.filter(parc => parc.status === 'Vencido').length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Parcelas Vencidas</p>
              <p className="text-xs text-red-600 font-medium">Requer atenção urgente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Buscar por caso ou contrafator..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status da parcela" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>

        <Select value={periodoFilter} onValueChange={(value) => {
          setPeriodoFilter(value);
          if (value !== 'personalizado') {
            setDateRange({ from: undefined, to: undefined });
          }
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os períodos</SelectItem>
            <SelectItem value="ultimo_mes">Último mês</SelectItem>
            <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
            <SelectItem value="ultimos_6_meses">Últimos 6 meses</SelectItem>
            <SelectItem value="ultimo_ano">Último ano</SelectItem>
            <SelectItem value="personalizado">Período personalizado</SelectItem>
          </SelectContent>
        </Select>

        {periodoFilter === 'personalizado' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecionar período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                locale={ptBR}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Relatório de Inadimplência */}
      {showInadimplenciaReport && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <FileBarChart className="h-5 w-5" />
                Relatório de Inadimplência por Contrafator
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Enviar Lembretes
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-red-200">
                    <th className="text-left p-3 font-semibold">Contrafator</th>
                    <th className="text-center p-3 font-semibold">Parcelas Vencidas</th>
                    <th className="text-right p-3 font-semibold">Valor Total</th>
                    <th className="text-center p-3 font-semibold">Último Pagamento</th>
                    <th className="text-center p-3 font-semibold">Dias em Atraso</th>
                    <th className="text-center p-3 font-semibold">Próxima Ação</th>
                    <th className="text-center p-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {inadimplenciaReport.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-red-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{item.contrafator}</div>
                          <div className="text-xs text-gray-500">
                            Casos: {item.casos.join(', ')}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">
                          {item.parcelasVencidas} parcela(s)
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-bold text-red-600">
                        {item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-3 text-center">
                        {new Date(item.ultimoPagamento).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="destructive">
                          {item.diasAtraso} dias
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {item.proximaAcao}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <Button variant="ghost" size="sm" title="Enviar lembrete">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Ver detalhes">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Resumo da Inadimplência:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total de Contrafatores:</span>
                  <span className="font-bold ml-2">{inadimplenciaReport.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Parcelas em Atraso:</span>
                  <span className="font-bold ml-2">
                    {inadimplenciaReport.reduce((acc, item) => acc + item.parcelasVencidas, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Valor Total Inadimplente:</span>
                  <span className="font-bold ml-2 text-red-600">
                    {inadimplenciaReport.reduce((acc, item) => acc + item.valorTotal, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Parcelamentos */}
      <div className="space-y-6">
        {filteredParcelamentos.map((parcelamento) => (
          <Card key={parcelamento.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {parcelamento.caso} - {parcelamento.contrafator}
                  </CardTitle>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span>Total: {parcelamento.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span>Recebido: {parcelamento.totalRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span>Parcelas: {parcelamento.totalParcelas}x</span>
                  </div>
                </div>
                <Badge variant="outline">
                  {parcelamento.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Parcelas */}
              <div className="space-y-3 mb-4">
                <h4 className="font-medium">Parcelas:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Nº</th>
                        <th className="text-right p-2">Valor</th>
                        <th className="text-center p-2">Vencimento</th>
                        <th className="text-center p-2">Pagamento</th>
                        <th className="text-center p-2">Status</th>
                        <th className="text-center p-2">Comprovante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parcelamento.parcelas.map((parcela) => (
                        <tr key={parcela.numero} className="border-b hover:bg-muted/50">
                          <td className="p-2">{parcela.numero}/{parcelamento.totalParcelas}</td>
                          <td className="p-2 text-right font-medium">
                            {parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="p-2 text-center">
                            {new Date(parcela.vencimento).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-2 text-center">
                            {parcela.pagamento ? new Date(parcela.pagamento).toLocaleDateString('pt-BR') : '—'}
                          </td>
                          <td className="p-2 text-center">
                            <Badge className={getStatusColor(parcela.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(parcela.status)}
                                {parcela.status}
                              </div>
                            </Badge>
                          </td>
                          <td className="p-2 text-center">
                            {parcela.comprovante ? (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Baixar
                              </Button>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <h4 className="font-medium">Observações Internas:</h4>
                </div>
                <Textarea
                  placeholder="Adicionar observações sobre este parcelamento..."
                  value={observacoes[parcelamento.id] || parcelamento.observacoes}
                  onChange={(e) => handleObservacaoChange(parcelamento.id, e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button size="sm" variant="outline">
                    Salvar Observação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      
    </div>
  );
};

export default FaturasPagamentos;
