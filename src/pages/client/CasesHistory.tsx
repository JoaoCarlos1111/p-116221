
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CalendarIcon, Download, Filter, ArrowLeft, Eye, FileText, CheckCircle2, AlertTriangle, ShieldCheck, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface HistoryCase {
  id: string;
  marca: string;
  tipoInfracao: string;
  statusFinal: string;
  dataDecisao: string;
  analisadoPor: string;
  valorPotencial: number;
  links: string[];
  observacoes: string;
}

const CasesHistory: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState<HistoryCase | null>(null);
  const [filteredCases, setFilteredCases] = useState<HistoryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    marca: 'all',
    tipoInfracao: 'all',
    dataInicio: null as Date | null,
    dataFim: null as Date | null,
  });

  // Mock data
  const historyCases: HistoryCase[] = [
    {
      id: '12345',
      marca: 'Nike',
      tipoInfracao: 'Venda de falsificados',
      statusFinal: 'Resolvido com Sucesso',
      dataDecisao: '2024-01-20',
      analisadoPor: 'João Silva',
      valorPotencial: 15000,
      links: ['https://loja-falsa.com/nike-air', 'https://marketplace.com/fake-nike'],
      observacoes: 'Acordo cumprido integralmente. Infrator pagou R$ 15.000, removeu todos os produtos falsificados e informou fornecedores.'
    },
    {
      id: '12346',
      marca: 'Adidas',
      tipoInfracao: 'Phishing',
      statusFinal: 'Acordo Negado, Conteúdo Removido',
      dataDecisao: '2024-01-18',
      analisadoPor: 'Maria Santos',
      valorPotencial: 8500,
      links: ['https://fake-adidas.net'],
      observacoes: 'Infrator recusou acordo mas removeu site após notificação extrajudicial.'
    },
    {
      id: '12347',
      marca: 'Nike',
      tipoInfracao: 'Uso indevido de marca',
      statusFinal: 'Inadimplente com Acordo',
      dataDecisao: '2024-01-15',
      analisadoPor: 'Pedro Oliveira',
      valorPotencial: 25000,
      links: ['https://loja-replica.com'],
      observacoes: 'Acordo aceito de R$ 12.000 em 6 parcelas, mas infrator está inadimplente há 2 meses.'
    },
    {
      id: '12348',
      marca: 'Puma',
      tipoInfracao: 'Venda de falsificados',
      statusFinal: 'Sem Retorno',
      dataDecisao: '2024-01-10',
      analisadoPor: 'Ana Costa',
      valorPotencial: 5000,
      links: ['https://mercado-livre.com/puma-fake'],
      observacoes: 'Após 3 tentativas de contato, não houve resposta do infrator.'
    },
    {
      id: '12349',
      marca: 'Nike',
      tipoInfracao: 'Venda de falsificados',
      statusFinal: 'Acordo Negado, Sem Ação',
      dataDecisao: '2024-01-05',
      analisadoPor: 'Carlos Santos',
      valorPotencial: 3000,
      links: ['https://pequena-loja.com'],
      observacoes: 'Infrator recusou acordo e mantém atividade. Caso escalado para ações legais.'
    }
  ];

  const statusOptions = [
    'Resolvido com Sucesso', 
    'Inadimplente com Acordo', 
    'Acordo Negado, Conteúdo Removido', 
    'Acordo Negado, Sem Ação',
    'Sem Retorno'
  ];
  const marcasOptions = ['Nike', 'Adidas', 'Puma'];
  const tipoInfracaoOptions = ['Venda de falsificados', 'Phishing', 'Uso indevido de marca'];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setFilteredCases(historyCases);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar histórico de casos');
        setFilteredCases([]);
      } finally {
        setLoading(false);
      }
    };

    loadData().catch(err => {
      console.error('Erro no loadData:', err);
      setError('Erro ao carregar dados');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    try {
      let filtered = [...historyCases];

      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(caso => caso.statusFinal === filters.status);
      }

      if (filters.marca && filters.marca !== 'all') {
        filtered = filtered.filter(caso => caso.marca === filters.marca);
      }

      if (filters.tipoInfracao && filters.tipoInfracao !== 'all') {
        filtered = filtered.filter(caso => caso.tipoInfracao === filters.tipoInfracao);
      }

      if (filters.dataInicio && filters.dataFim) {
        filtered = filtered.filter(caso => {
          const dataDecisao = new Date(caso.dataDecisao);
          return dataDecisao >= filters.dataInicio! && dataDecisao <= filters.dataFim!;
        });
      }

      setFilteredCases(filtered);
    } catch (err) {
      console.error('Erro ao filtrar casos:', err);
      setError('Erro ao aplicar filtros');
    }
  }, [filters]);

  const getStatusIcon = (status: string) => {
    const icons: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
      'Resolvido com Sucesso': { 
        icon: <CheckCircle2 className="h-4 w-4" />, 
        color: 'text-green-700', 
        bgColor: 'bg-green-100 border-green-200' 
      },
      'Inadimplente com Acordo': { 
        icon: <AlertTriangle className="h-4 w-4" />, 
        color: 'text-yellow-700', 
        bgColor: 'bg-yellow-100 border-yellow-200' 
      },
      'Acordo Negado, Conteúdo Removido': { 
        icon: <ShieldCheck className="h-4 w-4" />, 
        color: 'text-blue-700', 
        bgColor: 'bg-blue-100 border-blue-200' 
      },
      'Acordo Negado, Sem Ação': { 
        icon: <XCircle className="h-4 w-4" />, 
        color: 'text-red-700', 
        bgColor: 'bg-red-100 border-red-200' 
      },
      'Sem Retorno': { 
        icon: <Clock className="h-4 w-4" />, 
        color: 'text-gray-700', 
        bgColor: 'bg-gray-100 border-gray-200' 
      }
    };
    return icons[status] || { 
      icon: <XCircle className="h-4 w-4" />, 
      color: 'text-gray-700', 
      bgColor: 'bg-gray-100 border-gray-200' 
    };
  };

  const clearFilters = () => {
    try {
      setFilters({
        status: 'all',
        marca: 'all',
        tipoInfracao: 'all',
        dataInicio: null,
        dataFim: null,
      });
    } catch (err) {
      console.error('Erro ao limpar filtros:', err);
    }
  };

  const exportToCSV = () => {
    try {
      const headers = ['ID do Caso', 'Marca', 'Tipo de Infração', 'Status Final', 'Data da Decisão', 'Analisado por'];
      const csvContent = [
        headers.join(','),
        ...filteredCases.map(caso => [
          caso.id,
          caso.marca,
          caso.tipoInfracao,
          caso.statusFinal,
          format(new Date(caso.dataDecisao), 'dd/MM/yyyy'),
          caso.analisadoPor
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'historico-casos.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      setError('Erro ao exportar arquivo CSV');
    }
  };

  const handleNavigateBack = () => {
    try {
      navigate('/client/dashboard');
    } catch (err) {
      console.error('Erro ao navegar:', err);
      window.history.back();
    }
  };

  const handleOpenLink = (link: string) => {
    try {
      window.open(link, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Erro ao abrir link:', err);
    }
  };

  const statusSummary = statusOptions.reduce((acc, status) => {
    acc[status] = filteredCases.filter(caso => caso.statusFinal === status).length;
    return acc;
  }, {} as Record<string, number>);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold">Erro</p>
            <p>{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando histórico de casos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleNavigateBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Histórico de Casos</h1>
            <p className="text-sm text-muted-foreground">
              Visualização de casos encerrados - Total: {filteredCases.length} casos
            </p>
          </div>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Resumo por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(statusSummary).map(([status, count]) => {
              const statusInfo = getStatusIcon(status);
              return (
                <div key={status} className={`text-center p-4 rounded-lg border-2 ${statusInfo.bgColor}`}>
                  <div className={`flex justify-center mb-2 ${statusInfo.color}`}>
                    {statusInfo.icon}
                  </div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-center leading-tight mt-1">{status}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Marca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Marca</label>
              <Select 
                value={filters.marca} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, marca: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {marcasOptions.map(marca => (
                    <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Infração */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Infração</label>
              <Select 
                value={filters.tipoInfracao} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, tipoInfracao: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {tipoInfracaoOptions.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data Início */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dataInicio ? format(filters.dataInicio, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dataInicio}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dataInicio: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dataFim ? format(filters.dataFim, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dataFim}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dataFim: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Casos Encerrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Caso</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Tipo de Infração</TableHead>
                  <TableHead>Status Final</TableHead>
                  <TableHead>Data da Decisão</TableHead>
                  <TableHead>Analisado por</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhum caso encontrado com os filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCases.map((caso) => (
                    <TableRow key={caso.id}>
                      <TableCell className="font-medium">#{caso.id}</TableCell>
                      <TableCell>{caso.marca}</TableCell>
                      <TableCell>{caso.tipoInfracao}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 ${getStatusIcon(caso.statusFinal).bgColor} ${getStatusIcon(caso.statusFinal).color}`}>
                          {getStatusIcon(caso.statusFinal).icon}
                          <span className="text-xs font-medium">{caso.statusFinal}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(caso.dataDecisao), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{caso.analisadoPor}</TableCell>
                      <TableCell>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedCase(caso)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="min-w-[500px]">
                            <SheetHeader>
                              <SheetTitle>Detalhes do Caso #{selectedCase?.id}</SheetTitle>
                            </SheetHeader>
                            {selectedCase && (
                              <div className="space-y-6 mt-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Marca</label>
                                    <p className="font-medium">{selectedCase.marca}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status Final</label>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 ${getStatusIcon(selectedCase.statusFinal).bgColor} ${getStatusIcon(selectedCase.statusFinal).color}`}>
                                      {getStatusIcon(selectedCase.statusFinal).icon}
                                      <span className="text-sm font-medium">{selectedCase.statusFinal}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tipo de Infração</label>
                                    <p className="font-medium">{selectedCase.tipoInfracao}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Valor Potencial</label>
                                    <p className="font-medium text-green-600">
                                      {new Intl.NumberFormat('pt-BR', { 
                                        style: 'currency', 
                                        currency: 'BRL' 
                                      }).format(selectedCase.valorPotencial)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Data da Decisão</label>
                                    <p className="font-medium">
                                      {format(new Date(selectedCase.dataDecisao), 'dd/MM/yyyy', { locale: ptBR })}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Analisado por</label>
                                    <p className="font-medium">{selectedCase.analisadoPor}</p>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Links Suspeitos</label>
                                  <div className="space-y-2 mt-2">
                                    {selectedCase.links.map((link, index) => (
                                      <div key={index} className="p-2 bg-muted rounded flex items-center justify-between">
                                        <span className="text-sm truncate">{link}</span>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => handleOpenLink(link)}
                                        >
                                          <FileText className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Observações</label>
                                  <div className="mt-2 p-3 bg-muted rounded-lg">
                                    <p className="text-sm">{selectedCase.observacoes}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CasesHistory;
