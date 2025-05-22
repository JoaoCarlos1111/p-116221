
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Copy, ExternalLink, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function IPToolsCaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newLink, setNewLink] = useState("");

  // Find case by id from sample data
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/iptools')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Caso {selectedCase.id}</h1>
          <p className="text-sm text-muted-foreground">Visualização do caso</p>
        </div>
        {selectedCase.column === "received" && (
          <Button
            className="ml-auto bg-green-500 hover:bg-green-600"
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
          <CardContent className="grid md:grid-cols-2 gap-4">
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
              <h4 className="font-medium">Responsável</h4>
              <p className="text-muted-foreground">{selectedCase.responsible}</p>
            </div>
            <div>
              <h4 className="font-medium">Status do Envio</h4>
              <p className="text-muted-foreground">{selectedCase.status}</p>
            </div>
            <div>
              <h4 className="font-medium">Status Logístico</h4>
              <p className="text-muted-foreground">{selectedCase.logisticStatus}</p>
            </div>
            {selectedCase.expectedResponse && (
              <div>
                <h4 className="font-medium">Previsão de Resposta</h4>
                <p className="text-muted-foreground">{selectedCase.expectedResponse}</p>
              </div>
            )}
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
    </div>
  );
}
