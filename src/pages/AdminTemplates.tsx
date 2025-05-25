
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    internalNotes: "Template usado para casos de phishing",
    brand: "Nike",
    client: "Nike Inc."
  },
  {
    id: 2,
    name: "Termo de Acordo",
    type: "Contrato",
    lastUpdate: "02/05/2025",
    version: "2.0",
    isGlobal: false,
    content: "Conteúdo do termo...",
    internalNotes: "Acordo padrão para resolução amigável",
    brand: "Adidas",
    client: "Adidas Group"
  }
];

const availableBrands = ["Nike", "Adidas", "Louis Vuitton", "Gucci", "Prada"];

export default function AdminTemplates() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [filterType, setFilterType] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTemplate, setEditingTemplate] = useState(null);

  const filteredTemplates = templates.filter(template => {
    const matchesType = filterType === "all" || template.type === filterType;
    const matchesBrand = filterBrand === "all" || template.brand === filterBrand;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesBrand && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Templates de Documentos e Mensagens</h1>
          <p className="text-muted-foreground">Gerencie os modelos de documentos do sistema</p>
        </div>
        <Button onClick={() => navigate('/admin/templates/new')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Template
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6 items-center">
          <Input
            placeholder="Buscar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
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
          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as marcas</SelectItem>
              {availableBrands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Template</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cliente</TableHead>
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
                <TableCell>{template.client}</TableCell>
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
