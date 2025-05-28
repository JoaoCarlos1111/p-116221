
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Copy, ExternalLink, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Initialize cases array that will store all cases
let sampleCases = [
  {
    id: "101",
    brand: "Gucci",
    store: "Luxury Store",
    platform: "Instagram",
    status: "Recebido",
    responsible: "Amanda Silva",
    type: "Loja completa",
    links: [],
    recipient: "Maria Santos",
    notificationDate: "2024-03-25",
    trackingCode: "BR456789123",
    deliveryStatus: "Em análise",
    observations: "Caso de alta prioridade",
    history: [
      { date: "2024-03-25 10:00", action: "Caso recebido da Logística", user: "Sistema" }
    ]
  },
  {
    id: "102",
    brand: "Louis Vuitton",
    store: "LV Store",
    platform: "Facebook",
    status: "Recebido",
    responsible: "Ricardo Santos",
    type: "Loja completa",
    links: [],
    recipient: "João Silva",
    notificationDate: "2024-03-24",
    trackingCode: "BR456789124",
    deliveryStatus: "Em análise",
    observations: "Verificar urgente",
    history: [
      { date: "2024-03-24 10:00", action: "Caso recebido da Logística", user: "Sistema" }
    ]
  },
  {
    id: "201",
    brand: "Balenciaga",
    store: "Fashion World",
    platform: "Shopee",
    status: "Em andamento",
    responsible: "Carolina Lima",
    type: "Loja completa",
    links: ["shopee.com/fashionworld"],
    recipient: "Pedro Oliveira",
    notificationDate: "2024-03-23",
    trackingCode: "BR789123456",
    deliveryStatus: "Em andamento",
    observations: "Múltiplos canais de venda",
    history: [
      { date: "2024-03-23 09:00", action: "Caso recebido da Logística", user: "Sistema" }ema" },
      { date: "2024-03-23 10:15", action: "Link adicionado", user: "Carolina Lima" }
    ]
  },
  {
    id: "202",
    brand: "Dior",
    store: "Dior Official",
    platform: "Mercado Livre",
    status: "Em andamento",
    responsible: "Paulo Mendes",
    type: "Loja completa",
    links: [],
    recipient: "Ana Costa",
    notificationDate: "2024-03-22",
    trackingCode: "BR789123457",
    deliveryStatus: "Em andamento",
    observations: "Caso prioritário",
    history: [
      { date: "2024-03-22 09:00", action: "Caso recebido da Logística", user: "Sistema" }
    ]
  }
];

// Function to add new case to array
const addNewCase = (newCase) => {
  if (!sampleCases.find(c => c.id === newCase.id)) {
    sampleCases.push({
      ...newCase,
      history: [
        { date: new Date().toLocaleString(), action: "Caso recebido da Logística", user: "Sistema" }
      ]
    });
  }
};

export default function IPToolsCaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newLink, setNewLink] = useState("");

  const selectedCase = sampleCases.find(c => c.id === id);

  useEffect(() => {
    // If case doesn't exist in array, add it with default values
    if (!selectedCase && id) {
      const newCase = {
        id: id,
        brand: "Nova Marca",
        store: "Nova Loja",
        platform: "Plataforma",
        status: "Recebido",
        responsible: "Responsável",
        type: "Loja completa",
        links: [],
        recipient: "Destinatário",
        notificationDate: new Date().toISOString().split('T')[0],
        trackingCode: "",
        deliveryStatus: "Em análise",
        observations: "",
        history: []
      };
      addNewCase(newCase);
    }
  }, [id]);

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
      // Update local state
      selectedCase.status = "inProgress";
      selectedCase.history.push({
        date: new Date().toLocaleString(),
        action: "Report enviado e caso movido para Em Andamento",
        user: "Usuário atual"
      });
      
      // Update global state
      const caseIndex = sampleCases.findIndex(c => c.id === selectedCase.id);
      if (caseIndex !== -1) {
        sampleCases[caseIndex] = { ...selectedCase };
      }
      
      // Force refresh of parent component
      window.dispatchEvent(new CustomEvent('caseStatusUpdated', { 
        detail: { id: selectedCase.id, status: "inProgress" } 
      }));
      
      navigate('/iptools');
      toast({
        title: "Report enviado com sucesso",
        description: "O caso foi movido para a coluna Em Andamento."
      });
    } else {
      toast({
        title: "Erro ao enviar report",
        description: "É necessário ter pelo menos 2 links para enviar o report.",
        variant: "destructive"
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
                <div className="h-4 w-4 text-muted-foreground">🔗</div>
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
