import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  Paperclip, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Filter,
  Search,
  Plus,
  Archive,
  Star,
  Calendar,
  Building,
  User,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Atendimento {
  id: string;
  canal: 'whatsapp' | 'email' | 'telefone';
  cliente: string;
  telefone?: string;
  email?: string;
  assunto: string;
  status: 'pendente' | 'respondido' | 'resolvido' | 'urgente';
  ultimaMensagem: string;
  dataUltimaInteracao: string;
  casoVinculado?: string;
  marca?: string;
  analista?: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  mensagens: Mensagem[];
}

interface Mensagem {
  id: string;
  remetente: 'cliente' | 'analista';
  nome: string;
  conteudo: string;
  timestamp: string;
  anexos?: string[];
  lida: boolean;
}

interface CasoVinculado {
  id: string;
  marca: string;
  status: string;
  dataAbertura: string;
  valorPotencial: number;
  responsavel: string;
  etapaAtual: string;
}

const mockAtendimentos: Atendimento[] = [
  {
    id: 'ATD-001',
    canal: 'whatsapp',
    cliente: 'João Silva',
    telefone: '(11) 99999-9999',
    assunto: 'Questionamento sobre notificação',
    status: 'pendente',
    ultimaMensagem: 'Gostaria de entender melhor o processo',
    dataUltimaInteracao: '2024-01-26T10:30:00Z',
    casoVinculado: 'CAS-123',
    marca: 'Nike',
    prioridade: 'alta',
    mensagens: [
      {
        id: 'msg1',
        remetente: 'cliente',
        nome: 'João Silva',
        conteudo: 'Olá, recebi uma notificação sobre minha loja. Gostaria de entender melhor o processo.',
        timestamp: '2024-01-26T10:30:00Z',
        lida: true
      }
    ]
  },
  {
    id: 'ATD-002',
    canal: 'email',
    cliente: 'Maria Santos',
    email: 'maria@loja.com',
    assunto: 'Proposta de acordo',
    status: 'respondido',
    ultimaMensagem: 'Enviamos a proposta por email',
    dataUltimaInteracao: '2024-01-26T09:15:00Z',
    casoVinculado: 'CAS-124',
    marca: 'Adidas',
    prioridade: 'media',
    mensagens: [
      {
        id: 'msg2',
        remetente: 'cliente',
        nome: 'Maria Santos',
        conteudo: 'Gostaria de negociar um acordo para resolver a questão.',
        timestamp: '2024-01-26T09:00:00Z',
        lida: true
      },
      {
        id: 'msg3',
        remetente: 'analista',
        nome: 'Ana Costa',
        conteudo: 'Olá Maria, enviamos uma proposta de acordo por email. Por favor, verifique.',
        timestamp: '2024-01-26T09:15:00Z',
        lida: true
      }
    ]
  },
  {
    id: 'ATD-003',
    canal: 'telefone',
    cliente: 'Pedro Oliveira',
    telefone: '(21) 88888-8888',
    assunto: 'Ligação 0800 - Questionamento',
    status: 'urgente',
    ultimaMensagem: 'Cliente solicitou contato urgente',
    dataUltimaInteracao: '2024-01-26T11:45:00Z',
    prioridade: 'urgente',
    mensagens: [
      {
        id: 'msg4',
        remetente: 'analista',
        nome: 'Carlos Lima',
        conteudo: 'Registro: Cliente ligou às 11:45 questionando sobre prazo para resposta. Solicitou contato urgente.',
        timestamp: '2024-01-26T11:45:00Z',
        lida: true
      }
    ]
  }
];

const mockCaso: CasoVinculado = {
  id: 'CAS-123',
  marca: 'Nike',
  status: 'Em análise',
  dataAbertura: '2024-01-20',
  valorPotencial: 15000,
  responsavel: 'Ana Costa',
  etapaAtual: 'Atendimento'
};

const templatesMensagem = [
  {
    id: 'temp1',
    titulo: 'Primeira Resposta',
    conteudo: 'Olá! Agradecemos seu contato. Nossa equipe irá analisar sua solicitação e retornar em até 24 horas úteis.'
  },
  {
    id: 'temp2',
    titulo: 'Proposta de Acordo',
    conteudo: 'Prezado(a), gostaríamos de propor um acordo extrajudicial para resolver esta questão. Nossa proposta segue em anexo.'
  },
  {
    id: 'temp3',
    titulo: 'Solicitação de Documentos',
    conteudo: 'Para prosseguirmos com a análise, necessitamos que nos envie os seguintes documentos: [listar documentos]'
  }
];

export default function CentralAtendimento() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>(mockAtendimentos);
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState<Atendimento | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todos');
  const [filtroCanal, setFiltroCanal] = useState('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (atendimentos.length > 0) {
      setAtendimentoSelecionado(atendimentos[0]);
    }
  }, []);

  const atendimentosFiltrados = atendimentos.filter(atendimento => {
    const matchStatus = filtroStatus === 'todos' || atendimento.status === filtroStatus;
    const matchPrioridade = filtroPrioridade === 'todos' || atendimento.prioridade === filtroPrioridade;
    const matchCanal = filtroCanal === 'todos' || atendimento.canal === filtroCanal;
    const matchBusca = busca === '' || 
      atendimento.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      atendimento.assunto.toLowerCase().includes(busca.toLowerCase());

    return matchStatus && matchPrioridade && matchCanal && matchBusca;
  });

  const getIconeCanal = (canal: string) => {
    switch (canal) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'telefone': return <Phone className="h-4 w-4 text-orange-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCorStatus = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'respondido': return 'bg-blue-100 text-blue-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCorPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-gray-100 text-gray-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !atendimentoSelecionado) return;

    const novaMensagemObj: Mensagem = {
      id: `msg-${Date.now()}`,
      remetente: 'analista',
      nome: 'Analista Sistema',
      conteudo: novaMensagem,
      timestamp: new Date().toISOString(),
      lida: true
    };

    setAtendimentos(prev => prev.map(atendimento => 
      atendimento.id === atendimentoSelecionado.id 
        ? {
            ...atendimento,
            mensagens: [...atendimento.mensagens, novaMensagemObj],
            ultimaMensagem: novaMensagem,
            dataUltimaInteracao: new Date().toISOString(),
            status: 'respondido'
          }
        : atendimento
    ));

    setNovaMensagem('');
  };

  const aplicarTemplate = (template: string) => {
    setNovaMensagem(template);
  };

  const formatarTempo = (timestamp: string) => {
    const data = new Date(timestamp);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutos = Math.floor(diffMs / (1000 * 60));

    if (diffMinutos < 60) {
      return `${diffMinutos}min atrás`;
    } else if (diffHoras < 24) {
      return `${diffHoras}h atrás`;
    } else {
      return data.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Atendimento</h1>
            <p className="text-muted-foreground">Gerencie atendimentos de WhatsApp, e-mail e telefone</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              {atendimentosFiltrados.filter(a => a.status === 'pendente').length} Pendentes
            </Badge>
            <Badge variant="outline" className="text-red-600">
              {atendimentosFiltrados.filter(a => a.prioridade === 'urgente').length} Urgentes
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Colunas */}
      <div className="flex-1 flex overflow-hidden">

        {/* Coluna 1: Lista de Atendimentos */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Filtros */}
          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente, assunto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="respondido">Respondidos</SelectItem>
                  <SelectItem value="resolvido">Resolvidos</SelectItem>
                  <SelectItem value="urgente">Urgentes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroCanal} onValueChange={setFiltroCanal}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="urgentes" />
              <Label htmlFor="urgentes" className="text-sm">Apenas urgentes</Label>
            </div>
          </div>

          {/* Lista de Atendimentos */}
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {atendimentosFiltrados.map((atendimento) => (
                <Card
                  key={atendimento.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-gray-50",
                    atendimentoSelecionado?.id === atendimento.id && "bg-blue-50 border-blue-200"
                  )}
                  onClick={() => setAtendimentoSelecionado(atendimento)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getIconeCanal(atendimento.canal)}
                          <span className="font-medium text-sm">{atendimento.cliente}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={cn("text-xs", getCorStatus(atendimento.status))}>
                            {atendimento.status}
                          </Badge>
                          {atendimento.prioridade === 'urgente' && (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground truncate">
                        {atendimento.assunto}
                      </p>

                      <p className="text-xs text-muted-foreground truncate">
                        {atendimento.ultimaMensagem}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatarTempo(atendimento.dataUltimaInteracao)}</span>
                        {atendimento.casoVinculado && (
                          <Badge variant="outline" className="text-xs">
                            {atendimento.casoVinculado}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Coluna 2: Conversa Ativa */}
        <div className="flex-1 flex flex-col bg-white">
          {atendimentoSelecionado ? (
            <>
              {/* Header da Conversa */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getIconeCanal(atendimentoSelecionado.canal)}
                    <div>
                      <h3 className="font-semibold">{atendimentoSelecionado.cliente}</h3>
                      <p className="text-sm text-muted-foreground">
                        {atendimentoSelecionado.telefone || atendimentoSelecionado.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(getCorPrioridade(atendimentoSelecionado.prioridade))}>
                      {atendimentoSelecionado.prioridade}
                    </Badge>
                    <Badge className={cn(getCorStatus(atendimentoSelecionado.status))}>
                      {atendimentoSelecionado.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {atendimentoSelecionado.mensagens.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={cn(
                        "flex",
                        mensagem.remetente === 'analista' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3 space-y-1",
                          mensagem.remetente === 'analista'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{mensagem.nome}</span>
                          <span className="text-xs opacity-70">
                            {new Date(mensagem.timestamp).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{mensagem.conteudo}</p>
                        {mensagem.anexos && mensagem.anexos.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Paperclip className="h-3 w-3" />
                            <span className="text-xs">{mensagem.anexos.length} anexo(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Templates de Resposta */}
              <div className="px-4 py-2 bg-gray-50 border-t">
                <div className="flex gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Templates:</span>
                  {templatesMensagem.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => aplicarTemplate(template.conteudo)}
                      className="text-xs h-6"
                    >
                      {template.titulo}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Campo de Resposta */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    className="flex-1 min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        enviarMensagem();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button onClick={enviarMensagem} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  Selecione um atendimento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Escolha um atendimento da lista para visualizar a conversa
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Coluna 3: Detalhes do Caso */}
        <div className="w-80 bg-white border-l flex flex-col">
          {atendimentoSelecionado ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3">Detalhes do Caso</h3>

                {atendimentoSelecionado.casoVinculado ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Caso vinculado:</span>
                      <Button variant="ghost" size="sm" className="h-6 p-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>

                    <Card className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{mockCaso.id}</span>
                          <Badge variant="outline">{mockCaso.status}</Badge>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Building className="h-3 w-3 text-muted-foreground" />
                            <span>{mockCaso.marca}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span>{mockCaso.responsavel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(mockCaso.dataAbertura).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span>R$ {mockCaso.valorPotencial.toLocaleString('pt-BR')}</span>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <span className="text-sm font-medium">Etapa atual:</span>
                          <p className="text-sm text-muted-foreground">{mockCaso.etapaAtual}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Nenhum caso vinculado
                    </p>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Vincular Caso
                    </Button>
                  </div>
                )}
              </div>

              {/* Ações Rápidas */}
              <div className="p-4 space-y-3">
                <h4 className="font-medium text-sm">Ações Rápidas</h4>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CheckCircle className="h-3 w-3 mr-2" />
                    Marcar como Resolvido
                  </Button>

                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <AlertTriangle className="h-3 w-3 mr-2" />
                    Marcar como Urgente
                  </Button>

                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Archive className="h-3 w-3 mr-2" />
                    Encaminhar para Financeiro
                  </Button>

                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Clock className="h-3 w-3 mr-2" />
                    Agendar Follow-up
                  </Button>
                </div>
              </div>

              {/* Histórico Resumido */}
              <div className="p-4 border-t">
                <h4 className="font-medium text-sm mb-3">Histórico Recente</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">Atendimento iniciado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">Primeira resposta enviada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-muted-foreground">Aguardando resposta do cliente</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <Building className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Detalhes aparecerão aqui
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}