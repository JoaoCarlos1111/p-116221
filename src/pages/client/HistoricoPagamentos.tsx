
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Download, 
  Calendar as CalendarIcon,
  Filter,
  FileSpreadsheet,
  Search
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const HistoricoPagamentos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tipoServicoFilter, setTipoServicoFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const pagamentosFinalizados = [
    {
      id: 'PAG-001',
      caso: 'CASO-2023-045',
      contrafator: 'Empresa XYZ Ltda',
      tipoServico: 'Notificação',
      valorBruto: 5000,
      valorLiquido: 3500,
      dataPagamento: '2024-01-15',
      formaPagamento: 'Transferência',
      status: 'Finalizado',
      observacoes: 'Pagamento realizado conforme acordo'
    },
    {
      id: 'PAG-002',
      caso: 'CASO-2023-089',
      contrafator: 'Tech Solutions Inc',
      tipoServico: 'Acordo Extrajudicial',
      valorBruto: 12000,
      valorLiquido: 8400,
      dataPagamento: '2024-01-20',
      formaPagamento: 'PIX',
      status: 'Finalizado',
      observacoes: 'Acordo fechado com desconto de 20%'
    },
    {
      id: 'PAG-003',
      caso: 'CASO-2023-012',
      contrafator: 'Fashion Corp',
      tipoServico: 'Desativação',
      valorBruto: 3000,
      valorLiquido: 2100,
      dataPagamento: '2024-02-05',
      formaPagamento: 'Boleto',
      status: 'Finalizado',
      observacoes: 'Página desativada voluntariamente'
    },
    {
      id: 'PAG-004',
      caso: 'CASO-2023-156',
      contrafator: 'Digital Store Ltda',
      tipoServico: 'Blockchain/NFT',
      valorBruto: 8000,
      valorLiquido: 5600,
      dataPagamento: '2024-02-10',
      formaPagamento: 'Transferência',
      status: 'Finalizado',
      observacoes: 'Caso complexo envolvendo NFTs'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Finalizado': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoServicoColor = (tipo) => {
    switch (tipo) {
      case 'Notificação': return 'bg-blue-100 text-blue-800';
      case 'Acordo Extrajudicial': return 'bg-purple-100 text-purple-800';
      case 'Desativação': return 'bg-orange-100 text-orange-800';
      case 'Blockchain/NFT': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPagamentos = pagamentosFinalizados.filter(pagamento => {
    const matchesSearch = pagamento.caso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pagamento.contrafator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pagamento.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pagamento.status === statusFilter;
    const matchesTipo = tipoServicoFilter === 'all' || pagamento.tipoServico === tipoServicoFilter;
    
    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      const pagamentoDate = new Date(pagamento.dataPagamento);
      matchesDate = pagamentoDate >= dateRange.from && pagamentoDate <= dateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesTipo && matchesDate;
  });

  const totalValorBruto = filteredPagamentos.reduce((acc, p) => acc + p.valorBruto, 0);
  const totalValorLiquido = filteredPagamentos.reduce((acc, p) => acc + p.valorLiquido, 0);

  const exportToExcel = () => {
    // Lógica para exportar para Excel
    console.log('Exportando para Excel...');
  };

  const exportToCSV = () => {
    // Lógica para exportar para CSV
    console.log('Exportando para CSV...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Histórico de Pagamentos</h1>
          <p className="text-muted-foreground">Registro completo dos pagamentos finalizados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={() => navigate('/client/financeiro/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>

      {/* Filtros Avançados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Caso, contrafator ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Serviço</label>
              <Select value={tipoServicoFilter} onValueChange={setTipoServicoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Notificação">Notificação</SelectItem>
                  <SelectItem value="Acordo Extrajudicial">Acordo Extrajudicial</SelectItem>
                  <SelectItem value="Desativação">Desativação</SelectItem>
                  <SelectItem value="Blockchain/NFT">Blockchain/NFT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={ptBR}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalValorLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-sm text-muted-foreground">Total Líquido Recebido</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalValorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-sm text-muted-foreground">Total Bruto</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredPagamentos.length}
              </div>
              <p className="text-sm text-muted-foreground">Pagamentos Encontrados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Finalizados ({filteredPagamentos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID / Caso</th>
                  <th className="text-left p-3">Contrafator</th>
                  <th className="text-center p-3">Tipo de Serviço</th>
                  <th className="text-right p-3">Valor Bruto</th>
                  <th className="text-right p-3">Valor Líquido</th>
                  <th className="text-center p-3">Data Pagamento</th>
                  <th className="text-center p-3">Forma Pagamento</th>
                  <th className="text-center p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPagamentos.map((pagamento) => (
                  <tr key={pagamento.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{pagamento.id}</div>
                        <div className="text-muted-foreground text-xs">{pagamento.caso}</div>
                      </div>
                    </td>
                    <td className="p-3 font-medium">{pagamento.contrafator}</td>
                    <td className="p-3 text-center">
                      <Badge className={getTipoServicoColor(pagamento.tipoServico)}>
                        {pagamento.tipoServico}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {pagamento.valorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-right font-medium text-green-600">
                      {pagamento.valorLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-center">
                      {new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-3 text-center">{pagamento.formaPagamento}</td>
                    <td className="p-3 text-center">
                      <Badge className={getStatusColor(pagamento.status)}>
                        {pagamento.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricoPagamentos;
