
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CalendarIcon, ChevronLeft, Link, Paperclip, Plus, Send, Trash2 } from 'lucide-react';

const steps = [
  { id: 'received', title: 'Recebido', color: '#3E64FF' },
  { id: 'analysis', title: 'Caso em Análise', color: '#FF9F43' },
  { id: 'pending', title: 'Pendente de Informação', color: '#FFB240' },
  { id: 'completed', title: 'Concluído', color: '#3EC165' }
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

      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2B2B2B]">
              Caso #{id} - Falsificação de Produto X
              <span className="ml-3 text-sm text-gray-500">
                🕒 {daysInStep} dias nesta etapa
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Última atualização: {lastUpdate}
            </p>
          </div>
          <Badge style={{ backgroundColor: '#3E64FF' }} className="text-white">
            Verificação
          </Badge>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-6 bg-gray-100 p-4 rounded-lg">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm">{step.title}</span>
              {index < steps.length - 1 && (
                <div className="mx-2 h-1 w-16 bg-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button onClick={handleNextColumn}>
            Enviar para Próxima Coluna
          </Button>
          <Button variant="outline">
            Enviar para Próximo Setor
          </Button>
        </div>

        <div className="grid gap-6">
          {/* SEÇÃO A - Links Suspeitos */}
          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Links Suspeitos</h2>
            <div className="space-y-4">
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
                  <div key={index} className="flex items-center gap-2 bg-white p-2 rounded">
                    <Link className="h-4 w-4" />
                    <a href={link} className="flex-1 text-blue-600 hover:underline">{link}</a>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveLink(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* SEÇÃO B - Informações Básicas */}
          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Informações Básicas</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Nome do responsável ou empresa" />
              <select className="rounded-md border border-gray-300 p-2">
                <option value="">Selecione o gênero</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="N">Não especificado</option>
              </select>
              <Input placeholder="CPF/CNPJ" />
              <Input placeholder="Telefone" />
              <Input placeholder="E-mail" className="md:col-span-2" />
            </div>
          </Card>

          {/* SEÇÃO C - Endereço */}
          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Endereço</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Rua" />
              <Input placeholder="Número" />
              <Input placeholder="Bairro" />
              <Input placeholder="Cidade" />
              <Input placeholder="Estado (UF)" />
              <Input placeholder="CEP" />
            </div>
          </Card>

          {/* SEÇÃO D - Detalhes do Caso */}
          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Detalhes do Caso</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <select className="rounded-md border border-gray-300 p-2">
                <option value="">Tipo de Produto</option>
                <option value="eletronico">Eletrônico</option>
                <option value="vestuario">Vestuário</option>
                <option value="cosmetico">Cosmético</option>
              </select>
              <Input type="number" placeholder="Potencial Indenizatório (R$)" />
              <Input type="number" placeholder="Quantidade de Seguidores" />
              <Input type="number" placeholder="Estimativa de Tamanho da Loja" />
            </div>
          </Card>

          {/* SEÇÃO E - Anexos */}
          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Anexos</h2>
            <div className="space-y-4">
              <Button>
                <Paperclip className="h-4 w-4 mr-2" />
                Adicionar Anexo
              </Button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Placeholder para galeria de anexos */}
              </div>
            </div>
          </Card>

          {/* SEÇÃO F e G - Timeline e Comentários */}
          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Timeline</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                {/* Exemplo de item na timeline */}
                <div className="relative">
                  <div className="absolute -left-6 w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Hoje, 14:30</p>
                    <p className="text-sm">Caso movido para análise por João Silva</p>
                  </div>
                </div>
              </div>

              {/* Campo de comentário */}
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
          </Card>
        </div>
      </div>
    </div>
  );
}
