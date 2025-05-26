
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Receipt,
  DollarSign
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Solicitacoes = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: '',
    prioridade: 'normal',
    assunto: '',
    descricao: '',
    casoRelacionado: ''
  });

  const minhasSolicitacoes = [
    {
      id: 'SOL-001',
      tipo: 'Segunda Via Boleto',
      assunto: 'Segunda via boleto - Parcela 2/4',
      descricao: 'Preciso da segunda via do boleto da parcela 2 do caso CASO-2024-001',
      prioridade: 'alta',
      status: 'Atendida',
      dataAbertura: '2024-03-10',
      dataResposta: '2024-03-10',
      resposta: 'Segunda via do boleto enviada por email. Vencimento mantido para 15/03/2024.',
      casoRelacionado: 'CASO-2024-001'
    },
    {
      id: 'SOL-002',
      tipo: 'Renegociação',
      assunto: 'Solicitação de parcelamento adicional',
      descricao: 'Gostaria de renegociar o valor da próxima parcela devido a dificuldades financeiras temporárias.',
      prioridade: 'normal',
      status: 'Em Análise',
      dataAbertura: '2024-03-15',
      dataResposta: null,
      resposta: null,
      casoRelacionado: 'CASO-2024-002'
    },
    {
      id: 'SOL-003',
      tipo: 'Dúvida Financeira',
      assunto: 'Questionamento sobre taxa de serviço',
      descricao: 'Gostaria de entender melhor como é calculada a taxa da Totall nos acordos extrajudiciais.',
      prioridade: 'baixa',
      status: 'Respondida',
      dataAbertura: '2024-03-08',
      dataResposta: '2024-03-09',
      resposta: 'A taxa varia de acordo com a complexidade do caso. Enviamos detalhamento por email.',
      casoRelacionado: null
    }
  ];

  const tiposSolicitacao = [
    { value: 'segunda_via', label: 'Segunda Via de Boleto', icon: <Receipt className="h-4 w-4" /> },
    { value: 'renegociacao', label: 'Renegociação de Parcela', icon: <DollarSign className="h-4 w-4" /> },
    { value: 'duvida_financeira', label: 'Dúvida Financeira', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'documento', label: 'Solicitação de Documento', icon: <FileText className="h-4 w-4" /> },
    { value: 'outros', label: 'Outros', icon: <AlertCircle className="h-4 w-4" /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Atendida': return 'bg-green-100 text-green-800';
      case 'Respondida': return 'bg-blue-100 text-blue-800';
      case 'Em Análise': return 'bg-yellow-100 text-yellow-800';
      case 'Pendente': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Atendida': return <CheckCircle className="h-4 w-4" />;
      case 'Respondida': return <CheckCircle className="h-4 w-4" />;
      case 'Em Análise': return <Clock className="h-4 w-4" />;
      case 'Pendente': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nova solicitação:', formData);
    setIsDialogOpen(false);
    setFormData({
      tipo: '',
      prioridade: 'normal',
      assunto: '',
      descricao: '',
      casoRelacionado: ''
    });
  };

  const resumoSolicitacoes = {
    total: minhasSolicitacoes.length,
    atendidas: minhasSolicitacoes.filter(s => s.status === 'Atendida' || s.status === 'Respondida').length,
    pendentes: minhasSolicitacoes.filter(s => s.status === 'Em Análise' || s.status === 'Pendente').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Solicitações</h1>
          <p className="text-muted-foreground">Canal de comunicação com o setor financeiro</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Solicitação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nova Solicitação</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Solicitação</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de solicitação" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposSolicitacao.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          <div className="flex items-center gap-2">
                            {tipo.icon}
                            {tipo.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select value={formData.prioridade} onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="casoRelacionado">Caso Relacionado (opcional)</Label>
                  <Input
                    id="casoRelacionado"
                    placeholder="Ex: CASO-2024-001"
                    value={formData.casoRelacionado}
                    onChange={(e) => setFormData(prev => ({ ...prev, casoRelacionado: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    placeholder="Resumo da sua solicitação"
                    value={formData.assunto}
                    onChange={(e) => setFormData(prev => ({ ...prev, assunto: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva detalhadamente sua solicitação..."
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Enviar Solicitação
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => navigate('/client/financeiro/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{resumoSolicitacoes.total}</div>
              <p className="text-sm text-muted-foreground">Total de Solicitações</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{resumoSolicitacoes.atendidas}</div>
              <p className="text-sm text-muted-foreground">Atendidas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{resumoSolicitacoes.pendentes}</div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canais de Contato */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle>Canais de Contato Direto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Phone className="h-6 w-6 mb-2" />
              <span className="text-sm">WhatsApp</span>
              <span className="text-xs text-muted-foreground">(11) 99999-9999</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Mail className="h-6 w-6 mb-2" />
              <span className="text-sm">E-mail</span>
              <span className="text-xs text-muted-foreground">financeiro@totall.com.br</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span className="text-sm">Chat Online</span>
              <span className="text-xs text-muted-foreground">Seg a Sex - 9h às 18h</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Solicitações */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações ({minhasSolicitacoes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {minhasSolicitacoes.map((solicitacao) => (
              <div key={solicitacao.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {getStatusIcon(solicitacao.status)}
                    </div>
                    <div>
                      <h4 className="font-medium">{solicitacao.assunto}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{solicitacao.id}</Badge>
                        <Badge className={getPrioridadeColor(solicitacao.prioridade)}>
                          {solicitacao.prioridade}
                        </Badge>
                        {solicitacao.casoRelacionado && (
                          <Badge variant="secondary">{solicitacao.casoRelacionado}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(solicitacao.status)}>
                    {solicitacao.status}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  <p><strong>Tipo:</strong> {solicitacao.tipo}</p>
                  <p><strong>Descrição:</strong> {solicitacao.descricao}</p>
                </div>

                {solicitacao.resposta && (
                  <div className="bg-muted/50 p-3 rounded-lg mb-3">
                    <p className="text-sm font-medium mb-1">Resposta da Equipe Financeira:</p>
                    <p className="text-sm">{solicitacao.resposta}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Aberta em: {new Date(solicitacao.dataAbertura).toLocaleDateString('pt-BR')}</span>
                  {solicitacao.dataResposta && (
                    <span>Respondida em: {new Date(solicitacao.dataResposta).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações Úteis */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p><strong>Tempo de Resposta:</strong> Solicitações são respondidas em até 24 horas (dias úteis).</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p><strong>Segunda Via de Boleto:</strong> Disponível para boletos vencidos ou próximos ao vencimento.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p><strong>Renegociações:</strong> Analisadas caso a caso, mediante apresentação de justificativa.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p><strong>Horário de Atendimento:</strong> Segunda a Sexta, das 9h às 18h.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Solicitacoes;
