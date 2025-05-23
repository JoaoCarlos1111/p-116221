
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, ExternalLink } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/financeiro')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Caso #{id}</h1>
          <p className="text-sm text-muted-foreground">Detalhes financeiros</p>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="font-medium">
                  {caseData.acordo.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor da Parcela</p>
                <p className="font-medium">
                  {caseData.acordo.valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                <p className="font-medium">{caseData.acordo.formaPagamento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data do Acordo</p>
                <p className="font-medium">{new Date(caseData.acordo.dataAcordo).toLocaleDateString()}</p>
              </div>
            </div>
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
                  {caseData.parcelas.map((parcela) => (
                    <tr key={parcela.numero} className="border-b">
                      <td className="px-4 py-2">{parcela.numero}/{caseData.acordo.parcelas}</td>
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
