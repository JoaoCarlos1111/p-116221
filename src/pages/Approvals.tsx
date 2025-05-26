
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  MessageSquare,
  History,
  Paperclip,
  Download,
  ExternalLink,
  User,
  Calendar,
  Tag,
  FileText,
  Zap,
  Share
} from "lucide-react";

interface CaseData {
  id: string;
  title: string;
  brand: string;
  infractor: string;
  type: string;
  status: string;
  urgent: boolean;
  sector: string;
  analyst: string;
  submissionDate: string;
  lastUpdate: string;
  description: string;
  proofs: Array<{
    id: string;
    name: string;
    type: 'image' | 'video' | 'document';
    url: string;
    uploadDate: string;
  }>;
  comments: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    internal: boolean;
  }>;
  history: Array<{
    id: string;
    action: string;
    author: string;
    timestamp: string;
    details: string;
  }>;
}

const Approvals = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Mock data - casos pendentes de aprovação
  const [cases, setCases] = useState<CaseData[]>([
    {
      id: "12345",
      title: "Site falsificado da marca Adidas",
      brand: "Adidas",
      infractor: "dominiofalso.com",
      type: "Venda de produtos falsos",
      status: "Aguardando aprovação",
      urgent: true,
      sector: "Verificação",
      analyst: "João Silva",
      submissionDate: "2024-01-24",
      lastUpdate: "2024-01-26",
      description: "Site vendendo produtos falsificados da marca Adidas com preços muito abaixo do mercado. Domínio registrado recentemente e sem informações de contato válidas.",
      proofs: [
        { id: "1", name: "print_homepage.jpg", type: "image", url: "#", uploadDate: "2024-01-24" },
        { id: "2", name: "video_navegacao.mp4", type: "video", url: "#", uploadDate: "2024-01-24" },
        { id: "3", name: "whois_domain.pdf", type: "document", url: "#", uploadDate: "2024-01-25" }
      ],
      comments: [
        { id: "1", author: "João Silva", message: "Revisado, precisa de aprovação do coordenador", timestamp: "2024-01-25 14:30", internal: true },
        { id: "2", author: "Carla Santos", message: "Verifiquei CNPJ do domínio - não existe", timestamp: "2024-01-25 16:45", internal: true }
      ],
      history: [
        { id: "1", action: "Caso criado", author: "João Silva", timestamp: "2024-01-24 09:00", details: "Caso criado no setor de Verificação" },
        { id: "2", action: "Provas adicionadas", author: "João Silva", timestamp: "2024-01-24 14:30", details: "3 arquivos de prova enviados" },
        { id: "3", action: "Marcado como urgente", author: "Cliente", timestamp: "2024-01-26 08:15", details: "Cliente marcou o caso como prioritário" }
      ]
    },
    {
      id: "12346",
      title: "Perfil fake no Instagram - Nike",
      brand: "Nike",
      infractor: "@nike_oficial_br",
      type: "Perfil falso",
      status: "Em análise",
      urgent: false,
      sector: "Verificação",
      analyst: "Maria Costa",
      submissionDate: "2024-01-23",
      lastUpdate: "2024-01-25",
      description: "Perfil no Instagram se passando pela Nike Brasil, vendendo produtos falsificados através de direct.",
      proofs: [
        { id: "1", name: "perfil_instagram.jpg", type: "image", url: "#", uploadDate: "2024-01-23" },
        { id: "2", name: "conversas_direct.pdf", type: "document", url: "#", uploadDate: "2024-01-23" }
      ],
      comments: [
        { id: "1", author: "Maria Costa", message: "Perfil verificado como falso, preparando relatório", timestamp: "2024-01-25 11:20", internal: true }
      ],
      history: [
        { id: "1", action: "Caso criado", author: "Maria Costa", timestamp: "2024-01-23 10:30", details: "Caso criado no setor de Verificação" },
        { id: "2", action: "Investigação iniciada", author: "Maria Costa", timestamp: "2024-01-24 09:00", details: "Análise do perfil iniciada" }
      ]
    }
  ]);

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.infractor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || caseItem.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const openCaseDrawer = (caseData: CaseData) => {
    setSelectedCase(caseData);
    setIsDrawerOpen(true);
  };

  const handleApproveCase = (caseId: string) => {
    setCases(cases.filter(c => c.id !== caseId));
    toast({
      title: "Caso Aprovado",
      description: "O caso foi aprovado e seguirá para a próxima etapa.",
    });
    setIsDrawerOpen(false);
  };

  const handleRejectCase = (caseId: string) => {
    setCases(cases.filter(c => c.id !== caseId));
    toast({
      title: "Caso Devolvido",
      description: "O caso foi devolvido para revisão.",
      variant: "destructive",
    });
    setIsDrawerOpen(false);
  };

  const handleToggleUrgent = (caseId: string) => {
    setCases(cases.map(c => 
      c.id === caseId ? { ...c, urgent: !c.urgent } : c
    ));
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase({ ...selectedCase, urgent: !selectedCase.urgent });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedCase) return;

    const comment = {
      id: Date.now().toString(),
      author: "Coordenador", // seria o usuário logado
      message: newComment,
      timestamp: new Date().toLocaleString('pt-BR'),
      internal: true
    };

    const updatedCase = {
      ...selectedCase,
      comments: [...selectedCase.comments, comment]
    };

    setCases(cases.map(c => c.id === selectedCase.id ? updatedCase : c));
    setSelectedCase(updatedCase);
    setNewComment('');

    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi registrado no caso.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aguardando aprovação":
        return <Badge className="bg-yellow-100 text-yellow-800">Aguardando aprovação</Badge>;
      case "Em análise":
        return <Badge className="bg-blue-100 text-blue-800">Em análise</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Aprovações Pendentes</h1>
          <p className="text-muted-foreground">
            {filteredCases.length} casos aguardando sua aprovação
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por marca, infrator ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                <SelectItem value="Verificação">Verificação</SelectItem>
                <SelectItem value="Auditoria">Auditoria</SelectItem>
                <SelectItem value="Logística">Logística</SelectItem>
                <SelectItem value="IP Tools">IP Tools</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Casos */}
      <div className="space-y-4">
        {filteredCases.map((caseItem) => (
          <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">
                      #{caseItem.id} - {caseItem.title}
                    </h3>
                    {getStatusBadge(caseItem.status)}
                    {caseItem.urgent && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Urgente
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                    <div><strong>Marca:</strong> {caseItem.brand}</div>
                    <div><strong>Infrator:</strong> {caseItem.infractor}</div>
                    <div><strong>Analista:</strong> {caseItem.analyst}</div>
                    <div><strong>Data:</strong> {new Date(caseItem.lastUpdate).toLocaleDateString('pt-BR')}</div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {caseItem.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCaseDrawer(caseItem)}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApproveCase(caseItem.id)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRejectCase(caseItem.id)}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Devolver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCases.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum caso pendente</h3>
              <p className="text-muted-foreground">
                Todos os casos foram processados ou não há casos que correspondam aos filtros aplicados.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Drawer lateral para visualização do caso */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[600px] sm:w-[700px] max-w-[90vw]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Caso #{selectedCase?.id} - {selectedCase?.title}
            </SheetTitle>
          </SheetHeader>

          {selectedCase && (
            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
              <div className="space-y-6">
                {/* Informações principais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações do Caso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Marca</label>
                        <p className="font-medium">{selectedCase.brand}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Infrator</label>
                        <p className="font-medium">{selectedCase.infractor}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                        <p className="font-medium">{selectedCase.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Analista</label>
                        <p className="font-medium">{selectedCase.analyst}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge(selectedCase.status)}
                        {selectedCase.urgent && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Urgente
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                      <p className="text-sm mt-1">{selectedCase.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Ações rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedCase.urgent ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleToggleUrgent(selectedCase.id)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {selectedCase.urgent ? "Remover urgência" : "Marcar como urgente"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir em nova aba
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Provas e arquivos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Paperclip className="h-5 w-5" />
                      Provas e Arquivos ({selectedCase.proofs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCase.proofs.map((proof) => (
                        <div key={proof.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {proof.type === 'image' && <Eye className="h-5 w-5 text-primary" />}
                              {proof.type === 'video' && <Eye className="h-5 w-5 text-primary" />}
                              {proof.type === 'document' && <FileText className="h-5 w-5 text-primary" />}
                            </div>
                            <div>
                              <p className="font-medium">{proof.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Enviado em {new Date(proof.uploadDate).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Comentários internos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Comentários Internos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {selectedCase.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.message}</p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Textarea
                        placeholder="Adicionar comentário interno..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Adicionar Comentário
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Histórico */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Histórico do Caso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCase.history.map((event, index) => (
                        <div key={event.id} className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{event.action}</span>
                              <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.details}</p>
                            <p className="text-xs text-muted-foreground">por {event.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Botões de ação principais */}
                <div className="sticky bottom-0 bg-background pt-4 border-t">
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1"
                      onClick={() => handleApproveCase(selectedCase.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar Caso
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleRejectCase(selectedCase.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Devolver para Revisão
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Approvals;
