
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Copy, ExternalLink, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const sampleCases = [
  {
    id: "IP-2024-001",
    brand: "Nike",
    store: "SuperSports",
    platform: "Instagram",
    status: "Aguardando resposta",
    responsible: "Ana Silva",
    type: "Loja completa",
    links: ["instagram.com/store1", "whatsapp.com/link1"],
    column: "received",
    receivedDate: "2024-01-15",
    recipient: "John Doe",
    observations: "Caso prioritário",
    history: [
      { date: "2024-01-15 09:00", action: "Caso criado", user: "Sistema" },
      { date: "2024-01-15 10:30", action: "Links adicionados", user: "Ana Silva" }
    ]
  }
];

export default function IPToolsCaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newLink, setNewLink] = useState("");
  
  const selectedCase = sampleCases.find(c => c.id === id);

  const handleAddLink = () => {
    if (newLink && selectedCase) {
      selectedCase.links.push(newLink);
      selectedCase.history.push({
        date: new Date().toLocaleString(),
        action: "Link adicionado",
        user: "Usuário atual"
      });
      setNewLink("");
      toast({
        title: "Link adicionado com sucesso",
        description: "O novo link foi adicionado ao caso."
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência."
    });
  };

  const handleSendReport = () => {
    if (selectedCase && selectedCase.links.length > 0) {
      selectedCase.column = "inProgress";
      selectedCase.history.push({
        date: new Date().toLocaleString(),
        action: "Report enviado e caso movido para Em Andamento",
        user: "Usuário atual"
      });
      navigate('/iptools');
      toast({
        title: "Report enviado com sucesso",
        description: "O caso foi movido para a coluna Em Andamento."
      });
    }
  };

  if (!selectedCase) {
    return <div>Caso não encontrado</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/iptools')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Caso {selectedCase.id}</h1>
            <p className="text-sm text-muted-foreground">Visualização detalhada do caso</p>
          </div>
        </div>
        {selectedCase.column === "received" && (
          <Button
            className="bg-green-500 hover:bg-green-600"
            disabled={!selectedCase.links.length}
            onClick={handleSendReport}
          >
            Enviar report
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Links de Infrações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCase.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {link}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(link)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {selectedCase.column === "received" && (
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Adicionar novo link..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                />
                <Button onClick={handleAddLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Caso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Destinatário</h4>
                <p className="text-muted-foreground">{selectedCase.recipient}</p>
              </div>
              <div>
                <h4 className="font-medium">Marca</h4>
                <p className="text-muted-foreground">{selectedCase.brand}</p>
              </div>
              <div>
                <h4 className="font-medium">Data de Recebimento</h4>
                <p className="text-muted-foreground">{selectedCase.receivedDate}</p>
              </div>
              <div>
                <h4 className="font-medium">Plataforma</h4>
                <p className="text-muted-foreground">{selectedCase.platform}</p>
              </div>
              <div>
                <h4 className="font-medium">Quantidade de Links</h4>
                <p className="text-muted-foreground">{selectedCase.links?.length || 0}</p>
              </div>
              <div>
                <h4 className="font-medium">Total de Solicitações</h4>
                <p className="text-muted-foreground">{selectedCase.reportCount || '0'}</p>
              </div>
              {selectedCase.observations && (
                <div className="col-span-2">
                  <h4 className="font-medium">Observações</h4>
                  <p className="text-muted-foreground">{selectedCase.observations}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status da Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Status do Envio</h4>
                <Badge variant={
                  selectedCase.protectionStatus === "Respondido" ? "success" :
                  selectedCase.protectionStatus === "Enviado" ? "warning" : "secondary"
                }>
                  {selectedCase.protectionStatus || "Pendente"}
                </Badge>
              </div>
              {selectedCase.protectionStatus === "Respondido" && (
                <div>
                  <h4 className="font-medium">Data da Resposta</h4>
                  <p className="text-muted-foreground">{selectedCase.responseDate || "—"}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium">Status Logístico</h4>
                <Badge variant={
                  selectedCase.logisticStatus === "Entregue" ? "success" :
                  selectedCase.logisticStatus === "Em trânsito" ? "warning" :
                  selectedCase.logisticStatus === "Não entregue" ? "destructive" : "secondary"
                }>
                  {selectedCase.logisticStatus || "Aguardando envio"}
                </Badge>
              </div>
              {selectedCase.trackingCode && (
                <div>
                  <h4 className="font-medium">Código de Rastreio</h4>
                  <a
                    href={`https://rastreamento.correios.com.br/app/index.php?objeto=${selectedCase.trackingCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedCase.trackingCode}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico da Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedCase.history.map((entry, index) => (
                <div key={index} className="flex items-start gap-2 text-sm border-b border-gray-100 pb-2">
                  <div className="min-w-32">
                    <span className="font-medium">{entry.date}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-primary">{entry.action}</span>
                    <span className="text-muted-foreground"> por </span>
                    <span className="font-medium">{entry.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
