
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChevronLeft, Link, Paperclip, Plus, Send, Trash2 } from 'lucide-react';

const steps = [
  { id: 'received', title: 'Recebido', color: 'bg-primary' },
  { id: 'analysis', title: 'Caso em Análise', color: 'bg-warning' },
  { id: 'pending', title: 'Pendente de Informação', color: 'bg-orange-500' },
  { id: 'completed', title: 'Concluído', color: 'bg-success' }
];

export default function CaseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState('analysis');
  const [daysInStep, setDaysInStep] = useState(5);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [comment, setComment] = useState('');
  const [lastUpdate] = useState(new Date().toLocaleString());

  const handleAddLink = () => {
    if (newLink) {
      setLinks([...links, newLink]);
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleNextColumn = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Caso #{id} - Falsificação de Produto X
              <span className="ml-3 text-sm text-muted-foreground">
                🕒 {daysInStep} dias nesta etapa
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Última atualização: {lastUpdate}
            </p>
          </div>
          <Badge variant="secondary">
            Verificação
          </Badge>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between p-4 rounded-lg border">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step.id ? step.color + ' text-white' : 'bg-muted'
              }`}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm">{step.title}</span>
              {index < steps.length - 1 && (
                <div className="mx-2 h-1 w-16 bg-muted" />
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleNextColumn}>
            Enviar para Próxima Coluna
          </Button>
          <Button variant="outline">
            Enviar para Próximo Setor
          </Button>
        </div>

        <div className="grid gap-6">
          {/* SEÇÃO A - Links Suspeitos */}
          <Card>
            <CardHeader>
              <CardTitle>Links Suspeitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Adicionar novo link" 
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                />
                <Button onClick={handleAddLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Link
                </Button>
              </div>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg border">
                    <Link className="h-4 w-4" />
                    <a href={link} className="flex-1 text-primary hover:underline">{link}</a>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveLink(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO B - Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Nome do responsável ou empresa" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                  <SelectItem value="N">Não especificado</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="CPF/CNPJ" />
              <Input placeholder="Telefone" />
              <Input placeholder="E-mail" className="md:col-span-2" />
            </CardContent>
          </Card>

          {/* SEÇÃO C - Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Rua" />
              <Input placeholder="Número" />
              <Input placeholder="Bairro" />
              <Input placeholder="Cidade" />
              <Input placeholder="Estado (UF)" />
              <Input placeholder="CEP" />
            </CardContent>
          </Card>

          {/* SEÇÃO D - Detalhes do Caso */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Caso</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eletronico">Eletrônico</SelectItem>
                  <SelectItem value="vestuario">Vestuário</SelectItem>
                  <SelectItem value="cosmetico">Cosmético</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Potencial Indenizatório (R$)" />
              <Input type="number" placeholder="Quantidade de Seguidores" />
              <Input type="number" placeholder="Estimativa de Tamanho da Loja" />
            </CardContent>
          </Card>

          {/* SEÇÃO E - Anexos */}
          <Card>
            <CardHeader>
              <CardTitle>Anexos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>
                <Paperclip className="h-4 w-4 mr-2" />
                Adicionar Anexo
              </Button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Placeholder para galeria de anexos */}
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO F e G - Timeline e Comentários */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-muted pl-4 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[9px] w-3 h-3 rounded-full bg-primary"></div>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Hoje, 14:30</p>
                      <p className="text-sm">Caso movido para análise por João Silva</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Textarea
                    placeholder="Digite seu comentário..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button onClick={() => setComment('')}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
