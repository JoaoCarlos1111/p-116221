
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CalendarIcon, ChevronLeft, Link, Paperclip, Plus, Send, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CaseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [comment, setComment] = useState('');

  const handleAddLink = () => {
    if (newLink) {
      setLinks([...links, newLink]);
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
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
            <h1 className="text-3xl font-bold text-[#2B2B2B]">Caso #1234 - Falsificação de Produto X</h1>
            <div className="flex gap-2 mt-2 text-sm text-[#6F767E]">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>Criado em: 01/01/2024</span>
              </div>
              <div className="flex items-center ml-4">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>Última atualização: 15/01/2024 14:30</span>
              </div>
            </div>
          </div>
          <Badge style={{ backgroundColor: '#3E64FF' }} className="text-white">
            Caso em Análise
          </Badge>
        </div>

        <div className="grid gap-6">
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

          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Informações do Caso</h2>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Endereço</label>
                  <Textarea placeholder="Endereço completo" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">CPF/CNPJ</label>
                  <Input placeholder="000.000.000-00" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo de Produto</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eletronico">Eletrônico</SelectItem>
                      <SelectItem value="vestuario">Vestuário</SelectItem>
                      <SelectItem value="cosmetico">Cosmético</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Estado</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sp">São Paulo</SelectItem>
                      <SelectItem value="rj">Rio de Janeiro</SelectItem>
                      <SelectItem value="mg">Minas Gerais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Potencial Indenizatório</label>
                  <Input type="number" placeholder="R$ 0,00" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Anexos</h2>
            <div className="space-y-4">
              <Button>
                <Paperclip className="h-4 w-4 mr-2" />
                Adicionar Anexo
              </Button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Placeholder for attachments gallery */}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Timeline</h2>
            <div className="space-y-4">
              {/* Timeline items will be rendered here */}
            </div>
          </Card>

          <Card className="p-6 bg-[#F2F2F2]">
            <h2 className="text-xl font-semibold mb-4 text-[#2B2B2B]">Comentários</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
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

          <div className="flex gap-4 justify-end">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Mover para Próximo Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analise">Análise</SelectItem>
                <SelectItem value="juridico">Jurídico</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Solicitar Informação</Button>
            <Button variant="outline">Aprovar Notificação</Button>
            <Button variant="outline">Gerar Relatório</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
