
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ExternalLink, FileText, Download } from 'lucide-react';

export default function AtendimentoCaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const steps = [
    { id: 'waiting', title: 'Aguardando entrega', number: 1 },
    { id: 'delivered', title: 'Entregues', number: 2 },
    { id: 'firstContact', title: 'Primeiro contato', number: 3 },
    { id: 'proposal', title: 'Proposta de acordo', number: 4 }
  ];
  
  const [currentStatus, setCurrentStatus] = useState('waiting');

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    // Here you would typically make an API call to update the case status
    toast({
      description: `Status atualizado para ${steps.find(s => s.id === newStatus)?.title}`,
    });
  };

  // Mock data - replace with actual data fetching
  const caseData = {
    status: currentStatus,
    id,
    brand: "Nike",
    responsible: "Maria Santos",
    potentialValue: 50000,
    storeInfo: {
      name: "Loja Exemplo LTDA",
      document: "12.345.678/0001-90",
      phone: "(11) 99999-9999",
      alternativePhone: "(11) 98888-8888",
      email: "contato@lojaexemplo.com",
      alternativeEmail: "financeiro@lojaexemplo.com",
      address: {
        street: "Rua Augusta",
        number: "1500",
        neighborhood: "Consolação",
        city: "São Paulo",
        state: "SP",
        cep: "01305-000"
      }
    },
    suspectUrls: [
      "https://lojaexemplo.com/produto1",
      "https://marketplace.com/anuncio123"
    ],
    logistics: {
      trackingCode: "BR123456789",
      status: "Em trânsito",
      expectedDelivery: "2024-03-25",
      deliveryDate: null
    },
    ipTools: {
      deactivationProtocol: "PRO123456",
      linksCount: 3,
      links: [
        "https://plataforma1.com/anuncio1",
        "https://plataforma2.com/anuncio2",
        "https://plataforma3.com/anuncio3"
      ],
      protectionProgramStatus: "Enviado"
    },
    documents: {
      notification: { name: "Notificação Extrajudicial.pdf", url: "#" },
      powerOfAttorney: { name: "Procuração.pdf", url: "#" },
      evidence: { name: "Anúncio Suspeito.pdf", url: "#" }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-6 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/atendimento')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Caso #{id}</h1>
            <p className="text-sm text-muted-foreground">Visualização do caso</p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">🕒 5 dias nesta etapa</span>
            <Badge variant="secondary">Atendimento</Badge>
          </div>
        </div>
        
        <div className="bg-muted/30 p-6 rounded-lg">
          <div className="flex items-center justify-center w-full">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStatusChange(step.id)}
                  className={`flex items-center group cursor-pointer ${
                    currentStatus === step.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${currentStatus === step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {step.number}
                  </div>
                  <span className="ml-3 text-sm font-medium">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className="mx-3 h-[2px] w-24 bg-muted" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais do Caso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Número do caso</p>
              <p className="font-medium">#{caseData.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Marca</p>
              <p className="font-medium">{caseData.brand}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Analista responsável</p>
              <p className="font-medium">{caseData.responsible}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Potencial Indenizatório</p>
              <p className="font-medium text-green-600">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(caseData.potentialValue || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Lojista */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Lojista/Responsável</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome/Razão Social</p>
              <p className="font-medium">{caseData.storeInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
              <p className="font-medium">{caseData.storeInfo.document}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Potencial Indenizatório</p>
              <p className="font-medium text-green-600">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(caseData.potentialValue || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{caseData.storeInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="font-medium">{caseData.storeInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Endereço completo</p>
              <p className="font-medium">
                {caseData.storeInfo.address.street}, {caseData.storeInfo.address.number} - {caseData.storeInfo.address.neighborhood}, {caseData.storeInfo.address.city} - {caseData.storeInfo.address.state}, {caseData.storeInfo.address.cep}
              </p>
            </div>
          </CardContent>
        </Card>

        

        {/* Logística */}
        <Card>
          <CardHeader>
            <CardTitle>Logística / Notificação Extrajudicial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Código de rastreio</p>
              <a 
                href={`https://rastreamento.correios.com.br/app/index.php?objeto=${caseData.logistics.trackingCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {caseData.logistics.trackingCode}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status logístico</p>
              <Badge>{caseData.logistics.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Previsão de entrega</p>
              <p className="font-medium">{new Date(caseData.logistics.expectedDelivery).toLocaleDateString()}</p>
            </div>
            {caseData.logistics.deliveryDate && (
              <div>
                <p className="text-sm text-muted-foreground">Data da entrega</p>
                <p className="font-medium">{new Date(caseData.logistics.deliveryDate).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* IP Tools */}
        <Card>
          <CardHeader>
            <CardTitle>IP Tools / Ações em Plataformas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Protocolo de desativação</p>
              <p className="font-medium">{caseData.ipTools.deactivationProtocol}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantidade de links</p>
              <p className="font-medium">{caseData.ipTools.linksCount} links</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Links para desativação</p>
              <div className="space-y-2 mt-2">
                {caseData.ipTools.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status do programa de proteção</p>
              <Badge>{caseData.ipTools.protectionProgramStatus}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos do Caso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{caseData.documents.notification.name}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{caseData.documents.powerOfAttorney.name}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{caseData.documents.evidence.name}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
