
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageSquare, Mail, Phone, FileText, Upload, Send, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "@/components/ui/use-toast";
import api from '@/services/api';

interface Interaction {
  id: string;
  type: 'WHATSAPP' | 'EMAIL' | 'PHONE' | 'MANUAL';
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
  metadata?: any;
  attachments?: string[];
  createdBy?: string;
  createdAt: string;
}

interface CaseInteractionsHistoryProps {
  caseId: string;
}

export default function CaseInteractionsHistory({ caseId }: CaseInteractionsHistoryProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewInteraction, setShowNewInteraction] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Form para nova interação
  const [newInteraction, setNewInteraction] = useState({
    type: 'MANUAL' as const,
    direction: 'OUTBOUND' as const,
    content: '',
    metadata: {}
  });

  useEffect(() => {
    loadInteractions();
  }, [caseId]);

  useEffect(() => {
    applyFilters();
  }, [interactions, filterType, searchTerm]);

  const loadInteractions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/interactions/case/${caseId}`);
      setInteractions(response.data.data || []);
    } catch (error) {
      console.error('Error loading interactions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de interações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = interactions;

    if (filterType !== 'ALL') {
      filtered = filtered.filter(i => i.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.metadata && JSON.stringify(i.metadata).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredInteractions(filtered);
  };

  const handleSendWhatsApp = async (phoneNumber: string, message: string) => {
    try {
      await api.post('/whatsapp/send', {
        caseId,
        to: phoneNumber,
        message
      });
      
      toast({
        title: "Mensagem enviada",
        description: "A mensagem do WhatsApp foi enviada com sucesso.",
      });
      
      loadInteractions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    }
  };

  const handleSaveManualInteraction = async () => {
    try {
      await api.post('/interactions', {
        caseId,
        ...newInteraction
      });

      toast({
        title: "Interação registrada",
        description: "A interação foi registrada com sucesso.",
      });

      setNewInteraction({
        type: 'MANUAL',
        direction: 'OUTBOUND',
        content: '',
        metadata: {}
      });
      setShowNewInteraction(false);
      loadInteractions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a interação.",
        variant: "destructive",
      });
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'WHATSAPP':
        return <MessageSquare className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'PHONE':
        return <Phone className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'WHATSAPP':
        return 'bg-green-100 text-green-800';
      case 'EMAIL':
        return 'bg-blue-100 text-blue-800';
      case 'PHONE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando histórico...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Histórico de Atendimento</CardTitle>
          <div className="flex gap-2">
            <Dialog open={showNewInteraction} onOpenChange={setShowNewInteraction}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Nova Interação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nova Interação</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={newInteraction.type} onValueChange={(value: any) => 
                      setNewInteraction(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHONE">Telefone</SelectItem>
                        <SelectItem value="MANUAL">Registro Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="direction">Direção</Label>
                    <Select value={newInteraction.direction} onValueChange={(value: any) => 
                      setNewInteraction(prev => ({ ...prev, direction: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INBOUND">Recebido</SelectItem>
                        <SelectItem value="OUTBOUND">Enviado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea
                      value={newInteraction.content}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Descreva a interação..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewInteraction(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveManualInteraction}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar nas interações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os tipos</SelectItem>
              <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
              <SelectItem value="EMAIL">E-mail</SelectItem>
              <SelectItem value="PHONE">Telefone</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Interações */}
        <div className="space-y-4">
          {filteredInteractions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma interação encontrada.
            </div>
          ) : (
            filteredInteractions.map((interaction) => (
              <div key={interaction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getInteractionColor(interaction.type)}>
                      {getInteractionIcon(interaction.type)}
                      <span className="ml-1">{interaction.type}</span>
                    </Badge>
                    <Badge variant={interaction.direction === 'INBOUND' ? 'secondary' : 'outline'}>
                      {interaction.direction === 'INBOUND' ? 'Recebido' : 'Enviado'}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(interaction.createdAt), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm">{interaction.content}</p>
                </div>

                {interaction.metadata && Object.keys(interaction.metadata).length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Detalhes:</strong> {JSON.stringify(interaction.metadata, null, 2)}
                  </div>
                )}

                {interaction.attachments && interaction.attachments.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Anexos:</div>
                    {interaction.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs block"
                      >
                        {attachment}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
