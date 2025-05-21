
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ExternalLink } from 'lucide-react';

export default function LogisticsCaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data - replace with actual data fetching
  const caseData = {
    id: id,
    storeName: "Loja Esportiva SP",
    address: "Rua Augusta, 1500 - São Paulo, SP",
    brand: "Nike",
    approvalDate: "2024-03-20",
    status: "Aprovado",
    document: "12.345.678/0001-90",
    phone: "(11) 99999-9999",
    cep: "01305-000",
    verificationAnalyst: "João Silva",
    auditAnalyst: "Maria Santos",
    urls: [
      "https://lojaexemplo.com/produto1",
      "https://marketplace.com/anuncio123"
    ],
    trackingCode: "BR789456123",
    fullAddress: {
      street: "Rua Augusta",
      number: "1500",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP"
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/logistica')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Caso #{id}</h1>
          <p className="text-sm text-muted-foreground">Visualização do caso</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Marca</p>
              <p className="font-medium">{caseData.brand}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{caseData.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nome da Loja</p>
              <p className="font-medium">{caseData.storeName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CNPJ</p>
              <p className="font-medium">{caseData.document}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{caseData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Aprovação</p>
              <p className="font-medium">{new Date(caseData.approvalDate).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço Completo</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Logradouro</p>
              <p className="font-medium">{caseData.fullAddress.street}, {caseData.fullAddress.number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bairro</p>
              <p className="font-medium">{caseData.fullAddress.neighborhood}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cidade/UF</p>
              <p className="font-medium">{caseData.fullAddress.city} - {caseData.fullAddress.state}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CEP</p>
              <p className="font-medium">{caseData.cep}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>URLs Suspeitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {caseData.urls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {url}
                </a>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Analista de Verificação</p>
              <p className="font-medium">{caseData.verificationAnalyst}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Analista de Auditoria</p>
              <p className="font-medium">{caseData.auditAnalyst}</p>
            </div>
            {caseData.trackingCode && (
              <div>
                <p className="text-sm text-muted-foreground">Código de Rastreamento</p>
                <p className="font-medium">{caseData.trackingCode}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
