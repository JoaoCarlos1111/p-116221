import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Copy, ExternalLink, Plus } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    logisticStatus: "Em trânsito",
    expectedResponse: "2024-02-15",
    history: [
      { date: "2024-01-15 09:00", action: "Caso criado", user: "Sistema" },
      { date: "2024-01-15 10:30", action: "Links adicionados", user: "Ana Silva" }
    ]
  },
  {
    id: "IP-2024-002",
    brand: "Adidas",
    store: "TopSports",
    platform: "Shopee",
    status: "Respondido (positivamente)",
    responsible: "João Santos",
    type: "Anúncio individual",
    links: ["shopee.com/store2"],
    column: "inProgress",
    receivedDate: "2024-01-10",
    logisticStatus: "Entregue",
    expectedResponse: "2024-02-10",
    history: [
      { date: "2024-01-10 14:00", action: "Caso criado", user: "Sistema" }
    ]
  },
  {
    id: "IP-2024-003",
    brand: "Puma",
    store: "MegaSports",
    platform: "Mercado Livre",
    status: "Respondido (negativamente)",
    responsible: "Carlos Oliveira",
    type: "Link de WhatsApp",
    links: [],
    column: "analysis",
    receivedDate: "2024-01-05",
    logisticStatus: "Aguardando envio",
    history: [
      { date: "2024-01-05 11:00", action: "Caso criado", user: "Sistema" }
    ]
  }
];

export default function IPTools() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterDate, setFilterDate] = useState<Date>();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [newLink, setNewLink] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filterCases = (cases: typeof sampleCases) => {
    return cases.filter(caseItem => {
      const searchContent = `${caseItem.id} ${caseItem.brand} ${caseItem.store} ${caseItem.links.join(" ")}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());

      const matchesBrand = filterBrand === "all" || caseItem.brand === filterBrand;
      const matchesStatus = filterStatus === "all" || caseItem.status === filterStatus;
      const matchesPlatform = filterPlatform === "all" || caseItem.platform === filterPlatform;

      return matchesSearch && matchesBrand && matchesStatus && matchesPlatform;
    });
  };

  const getCasesByColumn = (column: string) => {
    return filterCases(sampleCases).filter(c => c.column === column);
  };

  const handleCaseClick = (caseItem: any) => {
    navigate(`/iptools/case/${caseItem.id}`);
  };

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

  const handleSendReport = () => {
    if (selectedCase && selectedCase.links.length > 0) {
      selectedCase.column = "inProgress";
      selectedCase.history.push({
        date: new Date().toLocaleString(),
        action: "Report enviado e caso movido para Em Andamento",
        user: "Usuário atual"
      });
      setIsDialogOpen(false);
      toast({
        title: "Report enviado com sucesso",
        description: "O caso foi movido para a coluna Em Andamento."
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

  return (
    <div className="space-y-8 p-8">
      <header className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">IP Tools</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciamento de casos de proteção à propriedade intelectual
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Buscar em todo o conteúdo dos casos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Nike">Nike</SelectItem>
                <SelectItem value="Adidas">Adidas</SelectItem>
                <SelectItem value="Puma">Puma</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Aguardando resposta">Aguardando resposta</SelectItem>
                <SelectItem value="Respondido (positivamente)">Respondido (positivamente)</SelectItem>
                <SelectItem value="Respondido (negativamente)">Respondido (negativamente)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Shopee">Shopee</SelectItem>
                <SelectItem value="Mercado Livre">Mercado Livre</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "PPP") : "Data de envio"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={setFilterDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Recebido
              <Badge variant="secondary">{getCasesByColumn("received").length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCasesByColumn("received").map((caseItem) => (
              <Card 
                key={caseItem.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCaseClick(caseItem)}
              >
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">{caseItem.id}</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Marca: {caseItem.brand}</p>
                    <p className="text-sm text-muted-foreground">Loja: {caseItem.store}</p>
                    <p className="text-sm text-muted-foreground">Plataforma: {caseItem.platform}</p>
                    {caseItem.links.length > 0 && (
                      <div className="text-sm text-primary">
                        {caseItem.links.length} link(s) adicionado(s)
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Em Andamento
              <Badge variant="secondary">{getCasesByColumn("inProgress").length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCasesByColumn("inProgress").map((caseItem) => (
              <Card 
                key={caseItem.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCaseClick(caseItem)}
              >
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">{caseItem.id}</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Marca: {caseItem.brand}</p>
                    <p className="text-sm text-muted-foreground">Loja: {caseItem.store}</p>
                    <p className="text-sm text-muted-foreground">Plataforma: {caseItem.platform}</p>
                    {caseItem.links.length > 0 && (
                      <div className="text-sm text-primary">
                        {caseItem.links.length} link(s) adicionado(s)
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Análise
              <Badge variant="secondary">{getCasesByColumn("analysis").length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCasesByColumn("analysis").map((caseItem) => (
              <Card 
                key={caseItem.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCaseClick(caseItem)}
              >
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">{caseItem.id}</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Marca: {caseItem.brand}</p>
                    <p className="text-sm text-muted-foreground">Loja: {caseItem.store}</p>
                    <p className="text-sm text-muted-foreground">Plataforma: {caseItem.platform}</p>
                    {caseItem.links.length > 0 && (
                      <div className="text-sm text-primary">
                        {caseItem.links.length} link(s) adicionado(s)
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Detalhes do Caso {selectedCase?.id}</DialogTitle>
              {selectedCase?.column === "received" && (
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  disabled={!selectedCase?.links.length}
                  onClick={handleSendReport}
                >
                  Enviar report
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Links de Infrações</h3>
              {selectedCase?.links.map((link: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
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

              {selectedCase?.column === "received" && (
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Marca</h4>
                <p className="text-muted-foreground">{selectedCase?.brand}</p>
              </div>
              <div>
                <h4 className="font-medium">Data de Recebimento</h4>
                <p className="text-muted-foreground">{selectedCase?.receivedDate}</p>
              </div>
              <div>
                <h4 className="font-medium">Plataforma</h4>
                <p className="text-muted-foreground">{selectedCase?.platform}</p>
              </div>
              <div>
                <h4 className="font-medium">Responsável</h4>
                <p className="text-muted-foreground">{selectedCase?.responsible}</p>
              </div>
              <div>
                <h4 className="font-medium">Status do Envio</h4>
                <p className="text-muted-foreground">{selectedCase?.status}</p>
              </div>
              <div>
                <h4 className="font-medium">Status Logístico</h4>
                <p className="text-muted-foreground">{selectedCase?.logisticStatus}</p>
              </div>
              {selectedCase?.expectedResponse && (
                <div>
                  <h4 className="font-medium">Previsão de Resposta</h4>
                  <p className="text-muted-foreground">{selectedCase.expectedResponse}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Histórico</h3>
              <div className="space-y-2">
                {selectedCase?.history.map((entry: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{entry.date}</span> - {entry.action} por {entry.user}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}