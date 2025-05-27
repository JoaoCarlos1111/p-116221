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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  ipToolsStatus?: 'Ativa' | 'Desativada';
  mensagensNaoLidas?: number; // Adicionado contador de mensagens não lidas
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
    ],
    ipToolsStatus: 'Ativa',
    mensagensNaoLidas: 2
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
    ],
    ipToolsStatus: 'Desativada',
    mensagensNaoLidas: 0
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
    ],
    ipToolsStatus: 'Ativa',
    mensagensNaoLidas: 1
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
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    data: '',
    hora: '',
    tipo: '',
    observacoes: '',
    notificacao: false
  });
  const [showCelebration, setShowCelebration] = useState(false);

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

  const handlePropostaAceita = (atendimentoId: string) => {
    // Atualizar status do atendimento para "Proposta Aceita"
    setAtendimentos(prev => prev.map(atendimento => 
      atendimento.id === atendimentoId 
        ? {
            ...atendimento,
            status: 'resolvido',
            ultimaMensagem: 'Proposta aceita pelo cliente',
            dataUltimaInteracao: new Date().toISOString()
          }
        : atendimento
    ));

    // Simular envio para pipeline de atendimento (etapa "Proposta aceita")
    console.log(`Caso ${atendimentoId} enviado para etapa "Proposta aceita" no pipeline`);
    
    // Mostrar notificação de sucesso
    alert('✅ Proposta aceita! Caso enviado para a etapa "Proposta aceita" no pipeline.');
  };

  const handleAcordoAssinado = (atendimentoId: string) => {
    // Mostrar animação de celebração
    setShowCelebration(true);
    
    // Atualizar status do atendimento
    setAtendimentos(prev => prev.map(atendimento => 
      atendimento.id === atendimentoId 
        ? {
            ...atendimento,
            status: 'resolvido',
            ultimaMensagem: 'Acordo assinado - Enviado para Financeiro',
            dataUltimaInteracao: new Date().toISOString()
          }
        : atendimento
    ));

    // Simular envio para setor Financeiro
    console.log(`Caso ${atendimentoId} enviado para Financeiro - etapa "Emitir Pagamento"`);
    
    setTimeout(() => {
      setShowCelebration(false);
      alert('💰 Acordo assinado! Caso enviado automaticamente para o Financeiro na etapa "Emitir Pagamento".');
    }, 3000);
  };

  const handleAgendarFollowUp = () => {
    if (!followUpData.data || !followUpData.hora || !followUpData.tipo) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Simular agendamento do follow-up
    console.log('Follow-up agendado:', {
      caso: atendimentoSelecionado?.id,
      ...followUpData
    });

    // Adicionar mensagem ao histórico
    if (atendimentoSelecionado) {
      const novaMensagemObj: Mensagem = {
        id: `msg-${Date.now()}`,
        remetente: 'analista',
        nome: 'Sistema',
        conteudo: `Follow-up agendado para ${followUpData.data} às ${followUpData.hora} via ${followUpData.tipo}. Observações: ${followUpData.observacoes || 'Nenhuma'}`,
        timestamp: new Date().toISOString(),
        lida: true
      };

      setAtendimentos(prev => prev.map(atendimento => 
        atendimento.id === atendimentoSelecionado.id 
          ? {
              ...atendimento,
              mensagens: [...atendimento.mensagens, novaMensagemObj],
              ultimaMensagem: 'Follow-up agendado',
              dataUltimaInteracao: new Date().toISOString()
            }
          : atendimento
      ));
    }

    // Resetar formulário e fechar modal
    setFollowUpData({
      data: '',
      hora: '',
      tipo: '',
      observacoes: '',
      notificacao: false
    });
    setShowFollowUpModal(false);
    
    alert('📅 Follow-up agendado com sucesso!');
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

  const getEtapaAtualPipeline = (atendimentoId: string) => {
    // Mapeamento das etapas do pipeline de atendimento
    const etapasPipeline = {
      'waiting': 'Aguardando entrega',
      'delivered': 'Entregues', 
      'firstContact': 'Em atendimento',
      'proposal': 'Proposta aceita'
    };

    // Simular busca da etapa atual baseada no ID do atendimento
    // Em uma implementação real, isso viria de uma API ou estado global
    const casosEtapas = {
      'ATD-001': 'waiting',
      'ATD-002': 'firstContact', 
      'ATD-003': 'delivered'
    };

    const etapaId = casosEtapas[atendimentoId as keyof typeof casosEtapas] || 'waiting';
    return etapasPipeline[etapaId as keyof typeof etapasPipeline] || 'Não definida';
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Main Content - 3 Colunas */}
      <div className="flex-1 flex">

        {/* Coluna 1: Lista de Atendimentos */}
        <div className="w-80 bg-white border-r flex flex-col overflow-hidden">
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
                      {/* Header com cliente e status centralizados */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2 flex-1 justify-center">
                          {getIconeCanal(atendimento.canal)}
                          <span className="font-medium text-sm text-center">{atendimento.cliente}</span>
                          {atendimento.mensagensNaoLidas && atendimento.mensagensNaoLidas > 0 && (
                            <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                              {atendimento.mensagensNaoLidas}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Badges centralizados */}
                      <div className="flex items-center justify-center gap-2">
                        <Badge className={cn("text-xs h-5 px-2", getCorStatus(atendimento.status))}>
                          {atendimento.status === 'pendente' ? 'Pendente' : 
                           atendimento.status === 'respondido' ? 'Respondido' :
                           atendimento.status === 'resolvido' ? 'Resolvido' : 'Urgente'}
                        </Badge>
                        {atendimento.prioridade === 'urgente' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>

                      {/* Assunto centralizado */}
                      <p className="text-sm text-muted-foreground text-center truncate">
                        {atendimento.assunto}
                      </p>

                      {/* Footer com tempo e caso vinculado */}
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span>{formatarTempo(atendimento.dataUltimaInteracao)}</span>
                        {atendimento.casoVinculado && (
                          <Badge variant="outline" className="text-xs h-4 px-2">
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
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
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
        <div className="w-80 bg-white border-l flex flex-col overflow-hidden">
          {atendimentoSelecionado ? (
            <ScrollArea className="flex-1">
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-4 text-center">Detalhes do Caso</h3>

                {atendimentoSelecionado.casoVinculado ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground block mb-2">Caso vinculado:</span>
                      <Button variant="ghost" size="sm" className="h-6 p-1 mx-auto">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>

                    <Card className="p-4">
                      <div className="space-y-3">
                        {/* ID e Status centralizados */}
                        <div className="text-center space-y-2">
                          <span className="font-medium text-lg block">{mockCaso.id}</span>
                          <Badge variant="outline" className="mx-auto">{mockCaso.status}</Badge>
                        </div>

                        <Separator />

                        {/* Informações centralizadas */}
                        <div className="space-y-3 text-sm">
                          <div className="text-center">
                            <Building className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                            <span className="font-medium block">{mockCaso.marca}</span>
                          </div>
                          
                          <div className="text-center">
                            <User className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                            <span className="block">{mockCaso.responsavel}</span>
                          </div>
                          
                          <div className="text-center">
                            <Tag className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                            <span className="font-medium block">R$ {mockCaso.valorPotencial.toLocaleString('pt-BR')}</span>
                          </div>
                          
                          <div className="text-center">
                            <span className="text-sm font-medium block mb-2">Status IP Tools:</span>
                            <Badge 
                              className={`text-xs mx-auto ${
                                atendimentoSelecionado.ipToolsStatus === 'Ativa' 
                                  ? 'bg-red-100 text-red-800 border-red-200' 
                                  : 'bg-green-100 text-green-800 border-green-200'
                              }`}
                            >
                              {atendimentoSelecionado.ipToolsStatus || 'N/A'}
                            </Badge>
                          </div>
                        </div>

                        <Separator />

                        <div className="text-center">
                          <span className="text-sm font-medium block mb-1">Etapa atual:</span>
                          <p className="text-sm text-muted-foreground">
                            {atendimentoSelecionado.casoVinculado ? 
                              getEtapaAtualPipeline(atendimentoSelecionado.id) : 
                              'Não definida'
                            }
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Nenhum caso vinculado
                    </p>
                    <Button size="sm" variant="outline" className="mx-auto">
                      <Plus className="h-3 w-3 mr-2" />
                      Vincular Caso
                    </Button>
                  </div>
                )}
              </div>

              {/* Ações Rápidas */}
              <div className="p-4 space-y-4">
                <h4 className="font-medium text-sm text-center">Ações Rápidas</h4>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-center text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handlePropostaAceita(atendimentoSelecionado.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-2" />
                    Proposta Aceita
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleAcordoAssinado(atendimentoSelecionado.id)}
                  >
                    <Star className="h-3 w-3 mr-2" />
                    Acordo Assinado
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-center"
                    onClick={() => setShowFollowUpModal(true)}
                  >
                    <Calendar className="h-3 w-3 mr-2" />
                    Agendar Follow-up
                  </Button>
                </div>
              </div>

              {/* Histórico Resumido */}
              <div className="p-4 border-t">
                <h4 className="font-medium text-sm mb-4 text-center">Histórico Recente</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground text-center">Atendimento iniciado</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground text-center">Primeira resposta enviada</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-muted-foreground text-center">Aguardando resposta</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-3">
                <Building className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-muted-foreground mb-1">Detalhes do Caso</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione um atendimento para visualizar os detalhes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Follow-up */}
      <Dialog open={showFollowUpModal} onOpenChange={setShowFollowUpModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agendar Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={followUpData.data}
                  onChange={(e) => setFollowUpData(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora *</Label>
                <Input
                  id="hora"
                  type="time"
                  value={followUpData.hora}
                  onChange={(e) => setFollowUpData(prev => ({ ...prev, hora: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="tipo">Tipo de Contato *</Label>
              <Select value={followUpData.tipo} onValueChange={(value) => setFollowUpData(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de contato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Internas</Label>
              <Textarea
                id="observacoes"
                placeholder="Adicione observações sobre o follow-up..."
                value={followUpData.observacoes}
                onChange={(e) => setFollowUpData(prev => ({ ...prev, observacoes: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notificacao"
                checked={followUpData.notificacao}
                onCheckedChange={(checked) => setFollowUpData(prev => ({ ...prev, notificacao: checked }))}
              />
              <Label htmlFor="notificacao">Receber notificação por e-mail</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFollowUpModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAgendarFollowUp}>
              Agendar Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Animação de Celebração */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-blue-500/20 pointer-events-none">
          {/* Confetes animados */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          {/* Card principal com animação */}
          <div className="text-center space-y-6 transform animate-bounce">
            {/* Ícone principal rotacionando */}
            <div className="relative">
              <div className="text-8xl animate-spin-slow">💰</div>
              <div className="absolute -top-2 -right-2 text-4xl animate-pulse">✨</div>
              <div className="absolute -bottom-2 -left-2 text-4xl animate-bounce">🎯</div>
            </div>
            
            {/* Mensagem principal */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-transform">
              <div className="text-3xl font-bold mb-2">ACORDO ASSINADO!</div>
              <div className="text-lg">Parabéns pela conquista! 🚀</div>
            </div>
            
            {/* Barra de progresso animada */}
            <div className="bg-white px-6 py-4 rounded-lg shadow-xl">
              <div className="text-sm text-gray-600 mb-2">Enviando para o Financeiro...</div>
              <div className="w-64 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse transform translate-x-0 animate-slide-right"></div>
              </div>
            </div>
            
            {/* Medalha de conquista */}
            <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full shadow-lg animate-pulse">
              <span className="text-sm font-bold">🏆 MISSÃO CUMPRIDA</span>
            </div>
          </div>
          
          {/* Partículas flutuantes */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute text-2xl animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {['🎊', '🎈', '⭐', '💫', '🌟'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}