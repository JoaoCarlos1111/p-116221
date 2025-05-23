
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const columns = [
  { id: "emitir", title: "Emitir pagamento" },
  { id: "primeira", title: "1° parcela" },
  { id: "segunda", title: "2° parcela" },
  { id: "terceira", title: "3° parcela" },
  { id: "quarta", title: "4° parcela" },
  { id: "inadimplente", title: "Inadimplente" },
  { id: "finalizado", title: "Pagamento finalizado" }
];

const mockPayments = [
  {
    id: 'PAY001',
    codigo: 'CASO-001',
    valorTotal: caseData.acordo.valorTotal,
    valorParcela: caseData.acordo.valorParcela,
    status: 'emitir',
    statusPagamento: caseData.acordo.statusPagamento,
    vencimentoParcela: caseData.acordo.primeiroVencimento,
    parcelasPagas: caseData.acordo.parcelasPagas,
    totalParcelas: caseData.acordo.parcelas
  },
  {
    id: 'PAY002',
    codigo: 'CASO-002',
    valorTotal: 8000,
    valorParcela: 2000,
    status: 'primeira',
    statusPagamento: 'em_atraso',
    vencimentoParcela: '2024-03-30',
    parcelasPagas: 0,
    totalParcelas: 4
  },
  {
    id: 'PAY003',
    codigo: 'CASO-003',
    valorTotal: 6000,
    valorParcela: 1500,
    status: 'segunda',
    statusPagamento: 'em_dia',
    vencimentoParcela: '2024-04-10',
    parcelasPagas: 1,
    totalParcelas: 4
  },
  {
    id: 'PAY004',
    codigo: 'CASO-004',
    valorTotal: 12000,
    valorParcela: 3000,
    status: 'finalizado',
    statusPagamento: 'pago',
    vencimentoParcela: '2024-03-15',
    parcelasPagas: 4,
    totalParcelas: 4
  },
  {
    id: 'PAY005',
    codigo: 'CASO-005',
    valorTotal: 4000,
    valorParcela: 1000,
    status: 'inadimplente',
    statusPagamento: 'em_atraso',
    vencimentoParcela: '2024-03-01',
    parcelasPagas: 2,
    totalParcelas: 4
  }
];

export default function Financeiro() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getPaymentsByColumn = (columnId) => {
    return payments.filter(payment => {
      const matchesSearch = payment.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.statusPagamento === statusFilter;
      return payment.status === columnId && matchesSearch && matchesStatus;
    });
  };

  const getColumnTotal = (columnId) => {
    return getPaymentsByColumn(columnId)
      .reduce((total, payment) => total + payment.valorTotal, 0)
      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'em_dia': return 'bg-green-500';
      case 'em_atraso': return 'bg-red-500';
      case 'pago': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'em_dia': return 'Em dia';
      case 'em_atraso': return 'Em atraso';
      case 'pago': return 'Pago';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-primary">Financeiro</h1>
        <p className="text-muted-foreground">Gestão de Pagamentos</p>
      </header>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Pesquisar por código..."
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
            <SelectItem value="em_dia">Em dia</SelectItem>
            <SelectItem value="em_atraso">Em atraso</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[300px]">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{column.title}</h3>
                <div className="text-sm text-muted-foreground">
                  <div>{getPaymentsByColumn(column.id).length} casos</div>
                  <div>{getColumnTotal(column.id)}</div>
                </div>
              </div>

              <div className="space-y-3">
                {getPaymentsByColumn(column.id).map((payment) => (
                  <Card
                    key={payment.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/financeiro/${payment.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{payment.codigo}</span>
                      <Badge className={getStatusColor(payment.statusPagamento)}>
                        {getStatusText(payment.statusPagamento)}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>{payment.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parcela:</span>
                        <span>{payment.valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vencimento:</span>
                        <span>{new Date(payment.vencimentoParcela).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parcelas:</span>
                        <span>{payment.parcelasPagas}/{payment.totalParcelas}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
