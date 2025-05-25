
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FileEdit, Download, History } from "lucide-react";

const templateTypes = [
  "Notificação extrajudicial",
  "Contrato",
  "Procuração",
  "E-mail padrão",
  "Texto de alerta",
  "Outros"
];

const mockTemplates = [
  {
    id: 1,
    name: "Notificação de Phishing",
    type: "Notificação extrajudicial",
    lastUpdate: "10/05/2025",
    version: "1.2",
    isGlobal: true,
    content: "Conteúdo da notificação...",
    internalNotes: "Template usado para casos de phishing"
  },
  {
    id: 2,
    name: "Termo de Acordo",
    type: "Contrato",
    lastUpdate: "02/05/2025",
    version: "2.0",
    isGlobal: false,
    content: "Conteúdo do termo...",
    internalNotes: "Acordo padrão para resolução amigável"
  }
];

export default function AdminTemplates() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [filterType, setFilterType] = useState("all");
  const [editingTemplate, setEditingTemplate] = useState(null);

  const filteredTemplates = filterType === "all" 
    ? templates 
    : templates.filter(template => template.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Templates de Documentos e Mensagens</h1>
          <p className="text-muted-foreground">Gerencie os modelos de documentos do sistema</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input id="name" placeholder="Digite o nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea 
                  id="content" 
                  className="min-h-[200px]" 
                  placeholder="Digite o conteúdo do template..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações Internas</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Notas visíveis apenas para administradores..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="version">Versão</Label>
                  <Input id="version" defaultValue="1.0" />
                </div>
                <div className="flex-1">
                  <Label>Permissão</Label>
                  <Select defaultValue="global">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="brand">Específico por Marca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {templateTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Template</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>{template.type}</TableCell>
                <TableCell>{template.lastUpdate}</TableCell>
                <TableCell>v{template.version}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon">
                    <History className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
