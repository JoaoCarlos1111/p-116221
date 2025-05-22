import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Copy, ExternalLink, Plus, Link, Trash2, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const sampleCases = [
  {
    id: "001",
    brand: "Nike",
    store: "Sport Center",
    platform: "Instagram",
    status: "Recebido",
    responsible: "João Silva",
    type: "Produtos Isolados",
    links: [],
    recipient: "Carlos Santos",
    notificationDate: "2024-03-26",
    trackingCode: "BR123456789",
    deliveryStatus: "Aguardando",
    observations: "Caso novo - necessita adicionar links",
    history: [
      { date: "2024-03-26 09:00", action: "Caso criado", user: "Sistema" }
    ]
  },
  {
    id: "002",
    brand: "Adidas",
    store: "Mega Sports",
    platform: "Facebook",
    status: "Recebido",
    responsible: "Maria Oliveira",
    type: "Loja Completa",
    links: ["facebook.com/megasports", "instagram.com/megasports.store"],
    recipient: "Ana Lima",
    notificationDate: "2024-03-26",
    trackingCode: "BR987654321",
    deliveryStatus: "Em análise",
    observations: "Pronto para enviar report",
    history: [
      { date: "2024-03-26 10:00", action: "Caso criado", user: "Sistema" },
      { date: "2024-03-26 10:30", action: "Links adicionados", user: "Maria Oliveira" }
    ]
  },
  {
    id: "003",
    brand: "Puma",
    store: "Athletic Shop",
    platform: "Shopee",
    status: "Em andamento",
    responsible: "Pedro Santos",
    type: "Dropshipping",
    links: ["shopee.com/athletic", "whatsapp.com/athleticshop"],
    recipient: "Roberto Costa",
    notificationDate: "2024-03-25",
    trackingCode: "BR456123789",
    deliveryStatus: "Em progresso",
    observations: "Report enviado - aguardando retorno",
    history: [
      { date: "2024-03-25 14:00", action: "Caso criado", user: "Sistema" },
      { date: "2024-03-25 14:30", action: "Links adicionados", user: "Pedro Santos" },
      { date: "2024-03-25 15:00", action: "Report enviado", user: "Pedro Santos" }
    ]
  }
];

export default function IPToolsCaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newLink, setNewLink] = useState("");
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  const selectedCase = sampleCases.find(c => c.id === id);

  if (!selectedCase) {
    return <div className="p-6">Caso não encontrado</div>;
  }

  const handleAddLink = () => {
    if (newLink) {
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

  const handleSendReport = () => {
    if (selectedCase.links.length >= 2) {
      selectedCase.status = "Em andamento";
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
        {selectedCase.status === "Recebido" && (
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleSendReport}
            disabled={selectedCase.links.length < 2}
          >
            Enviar Report
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Links de Infrações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Cole aqui o link da infração..."
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newLink.trim()) {
                  handleAddLink();
                }
              }}
            />
            <Button onClick={handleAddLink} disabled={!newLink.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            {selectedCase.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg border">
                <Link className="h-4 w-4 text-muted-foreground" />
                <a
                  href={link.startsWith('http') ? link : `https://${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex-1"
                >
                  {link}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(link);
                    toast({
                      title: "Link copiado",
                      description: "O link foi copiado para a área de transferência."
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(link.startsWith('http') ? link : `https://${link}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
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
              <h4 className="font-medium">Número do Caso</h4>
              <p className="text-muted-foreground">{selectedCase.id}</p>
            </div>
            <div>
              <h4 className="font-medium">Marca</h4>
              <p className="text-muted-foreground">{selectedCase.brand}</p>
            </div>
            <div>
              <h4 className="font-medium">Data da Notificação</h4>
              <p className="text-muted-foreground">{selectedCase.notificationDate}</p>
            </div>
            <div>
              <h4 className="font-medium">Plataforma</h4>
              <p className="text-muted-foreground">{selectedCase.platform}</p>
            </div>
            <div>
              <h4 className="font-medium">Código de Rastreio</h4>
              <p className="text-muted-foreground">{selectedCase.trackingCode}</p>
            </div>
            <div>
              <h4 className="font-medium">Status de Entrega</h4>
              <Badge>{selectedCase.deliveryStatus}</Badge>
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
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedCase.history.map((entry, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{entry.date}</span> - {entry.action} por {entry.user}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}