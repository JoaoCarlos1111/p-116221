
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const FaturasPagamentos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [observacoes, setObservacoes] = useState({});

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

  const filteredParcelamentos = parcelamentos.filter(parc => {
    const matchesSearch = parc.caso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parc.contrafator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         parc.parcelas.some(p => p.status.toLowerCase() === statusFilter);
    return matchesSearch && matchesStatus;
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
        <Button onClick={() => navigate('/client/financeiro/dashboard')}>
          Voltar ao Dashboard
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
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
      </div>

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

      {/* Resumo */}
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
              <div className="text-2xl font-bold text-red-600">
                {filteredParcelamentos.reduce((acc, p) => acc + p.parcelas.filter(parc => parc.status === 'Vencido').length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Parcelas Vencidas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaturasPagamentos;
