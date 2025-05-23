import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { PaymentsService } from '@/services/api';

const columns = [
  { id: "emitir", title: "Emitir pagamento" },
  { id: "primeira", title: "1° parcela" },
  { id: "segunda", title: "2° parcela" },
  { id: "terceira", title: "3° parcela" },
  { id: "quarta", title: "4° parcela" },
  { id: "inadimplente", title: "Inadimplente" },
  { id: "finalizado", title: "Pagamento finalizado" }
];

export default function Financeiro() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await PaymentsService.getPayments();
        setPayments(data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const getPaymentsByColumn = (columnId) => {
    return payments.filter(payment => payment.status === columnId);
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-primary">Financeiro</h1>
        <p className="text-muted-foreground">Gestão de Pagamentos</p>
      </header>

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
                        {payment.statusPagamento}
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