import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Eye, FileUp, Save } from "lucide-react";

// Import the RichTextEditor component (assuming it's in the components directory)
import RichTextEditor from "@/components/ui/RichTextEditor"; // Adjust the path if necessary


const templateTypes = [
  "Notificação extrajudicial",
  "Contrato",
  "Procuração",
  "E-mail padrão",
  "Texto de alerta",
  "Outros"
];

export default function NewTemplate() {
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: "",
    type: "",
    content: "",
    letterhead: null as File | null,
    isGlobal: true,
  });

  // State for the rich text editor content
  const [content, setContent] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/admin/templates")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Novo Template</h1>
          </div>
          <p className="text-muted-foreground">Crie um novo modelo de documento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Salvar Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-3 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Template</Label>
              <Input
                id="name"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                placeholder="Digite o nome do template"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select 
                value={template.type}
                onValueChange={(value) => setTemplate({ ...template, type: value })}
              >
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
            <Label>Conteúdo do Template</Label>
            <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Digite o conteúdo do template..."
              />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Papel Timbrado</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Button variant="ghost" className="w-full">
                <FileUp className="mr-2 h-4 w-4" />
                Upload do Timbrado
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Campos Disponíveis</Label>
            <div className="space-y-2 text-sm">
              <p className="p-2 bg-muted rounded-md">{"{{nome_cliente}}"}</p>
              <p className="p-2 bg-muted rounded-md">{"{{nome_marca}}"}</p>
              <p className="p-2 bg-muted rounded-md">{"{{endereco_infrator}}"}</p>
              <p className="p-2 bg-muted rounded-md">{"{{data_atual}}"}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}