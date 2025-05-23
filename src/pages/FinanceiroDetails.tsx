import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

export default function FinanceiroDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for example
  const caseData = {
    id: "FIN-001",
    devedor: "João Silva",
    cpf: "123.456.789-00",
    setorOrigem: "Atendimento",
    statusPagamento: "Em dia",
    acordo: {
      valorTotal: 1500,
      parcelas: 3,
      valorParcela: 500,
      formaPagamento: "Boleto",
      dataAcordo: "2024-01-15",
      primeiroVencimento: "2024-02-15",
      diasAtraso: 0,
      multa: 0
    },
    parcelas: [
      { numero: 1, valor: 500, vencimento: "2024-02-15", pagamento: "2024-02-15", status: "Pago", comprovante: true },
      { numero: 2, valor: 500, vencimento: "2024-03-15", pagamento: null, status: "Em aberto", comprovante: false },
      { numero: 3, valor: 500, vencimento: "2024-04-15", pagamento: null, status: "Em aberto", comprovante: false }
    ],
    comprovantes: [
      { nome: "comprovante_01.pdf", data: "2024-02-15", tipo: "PDF" }
    ],
    observacoes: "Cliente demonstrou boa vontade em regularizar a situação.",
    reativacao: {
      solicitada: true,
      dataSolicitacao: "2024-02-16",
      status: "Aprovado",
      linkPagina: "https://exemplo.com/pagina-vendas",
      observacoesIPTools: "Página em conformidade com as diretrizes."
    }
  };

  const [paymentConfig, setPaymentConfig] = useState({
    method: caseData.acordo.formaPagamento,
    installments: caseData.acordo.parcelas,
    firstPaymentDate: caseData.acordo.primeiroVencimento,
    installmentValue: caseData.acordo.valorParcela,
    totalValue: caseData.acordo.valorTotal,
    status: caseData.acordo.statusPagamento,
    paidInstallments: caseData.acordo.parcelasPagas
  });

  const [paymentHistory, setPaymentHistory] = useState(caseData.parcelas);
  
  const [previewInstallments, setPreviewInstallments] = useState(
    Array(parseInt(caseData.acordo.parcelas)).fill(null).map((_, index) => {
      const date = new Date(caseData.acordo.primeiroVencimento);
      date.setMonth(date.getMonth() + index);
      return {
        numero: index + 1,
        valor: caseData.acordo.valorParcela,
        vencimento: date.toISOString().split('T')[0],
        status: 'Em aberto'
      };
    })
  );

  const updatePreviewInstallments = (numInstallments: number, firstDate: string, totalValue: number) => {
    const installmentValue = totalValue / numInstallments;
    const newInstallments = Array(numInstallments).fill(null).map((_, index) => {
      const date = new Date(firstDate);
      date.setMonth(date.getMonth() + index);
      return {
        numero: index + 1,
        valor: installmentValue,
        vencimento: date.toISOString().split('T')[0],
        status: 'Em aberto'
      };
    });
    setPreviewInstallments(newInstallments);
    setPaymentConfig(prev => ({
      ...prev,
      installments: numInstallments,
      installmentValue: installmentValue
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/financeiro')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Caso #{id}</h1>
            <p className="text-sm text-muted-foreground">Detalhes financeiros</p>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg">
          <div className="flex items-center justify-center w-full">
            {[
              { id: 'emitir', title: 'Emitir pagamento', number: 1 },
              { id: 'primeira', title: '1° parcela', number: 2 },
              { id: 'segunda', title: '2° parcela', number: 3 },
              { id: 'terceira', title: '3° parcela', number: 4 },
              { id: 'quarta', title: '4° parcela', number: 5 },
              { id: 'inadimplente', title: 'Inadimplente', number: 6 },
              { id: 'finalizado', title: 'Pagamento finalizado', number: 7 }
            ].map((step, index, steps) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    // Aqui você pode adicionar a lógica para mudar o status
                    caseData.status = step.id;
                    // Atualizar o estado local e fazer chamada à API
                  }}
                  className={`flex items-center group cursor-pointer ${
                    caseData.status === step.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${caseData.status === step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {step.number}
                  </div>
                  <span className="ml-3 text-sm font-medium">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className="mx-3 h-[2px] w-12 bg-muted" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identificação do Caso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Devedor</p>
              <p className="font-medium">{caseData.devedor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
              <p className="font-medium">{caseData.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Setor de Origem</p>
              <p className="font-medium">{caseData.setorOrigem}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status do Pagamento</p>
              <Badge>{caseData.statusPagamento}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Acordo</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-medium">
                    {caseData.acordo.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Forma de Pagamento</label>
                  <Select defaultValue={caseData.acordo.formaPagamento} onValueChange={(value) => setPaymentConfig(prev => ({ ...prev, method: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto Bancário</SelectItem>
                      <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Número de Parcelas</label>
                  <Select defaultValue={caseData.acordo.parcelas.toString()} onValueChange={(value) => {
                    const parcelas = parseInt(value);
                    updatePreviewInstallments(parcelas, paymentConfig.firstPaymentDate, caseData.acordo.valorTotal);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o número de parcelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}x de {(caseData.acordo.valorTotal / num).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Data do Primeiro Pagamento</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      defaultValue={caseData.acordo.primeiroVencimento}
                      onChange={(e) => {
                        const date = e.target.value;
                        updatePreviewInstallments(paymentConfig.installments, date, caseData.acordo.valorTotal);
                        setPaymentConfig(prev => ({ ...prev, firstPaymentDate: date }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Previsão das Parcelas</p>
                <div className="space-y-2">
                  {previewInstallments.map((parcela, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span>Parcela {index + 1}</span>
                      <span>{new Date(parcela.vencimento).toLocaleDateString()}</span>
                      <span>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit" onClick={(e) => {
                  e.preventDefault();
                  const updatedPayments = previewInstallments.map(parcela => ({
                    numero: parcela.numero,
                    valor: parcela.valor,
                    vencimento: parcela.vencimento,
                    pagamento: null,
                    status: 'Em aberto',
                    comprovante: false
                  }));
                  
                  setPaymentHistory(updatedPayments);
                  caseData.parcelas = updatedPayments;
                  caseData.acordo = {
                    ...caseData.acordo,
                    formaPagamento: paymentConfig.method,
                    parcelas: paymentConfig.installments,
                    valorParcela: paymentConfig.installmentValue,
                    primeiroVencimento: paymentConfig.firstPaymentDate
                  };
                  
                  console.log('Saving payment configurations', paymentConfig);
                  console.log('Updated installments:', updatedPayments);
                }}>
                  Confirmar Configuração
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Parcelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th className="px-4 py-2">Nº Parcela</th>
                    <th className="px-4 py-2">Valor</th>
                    <th className="px-4 py-2">Vencimento</th>
                    <th className="px-4 py-2">Pagamento</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Comprovante</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((parcela) => (
                    <tr key={parcela.numero} className="border-b">
                      <td className="px-4 py-2">{parcela.numero}/{paymentConfig.installments}</td>
                      <td className="px-4 py-2">
                        {parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="px-4 py-2">{new Date(parcela.vencimento).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        {parcela.pagamento ? new Date(parcela.pagamento).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={parcela.status === "Pago" ? "default" : "secondary"}>
                          {parcela.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        {parcela.comprovante ? (
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Ver recibo
                          </Button>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações Internas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{caseData.observacoes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reativação da Página de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status da Reativação</p>
              <Badge>{caseData.reativacao.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Link da Página</p>
              <a href={caseData.reativacao.linkPagina} target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1">
                Acessar página <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Observações IP Tools</p>
              <p className="text-sm">{caseData.reativacao.observacoesIPTools}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}