
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Eye, FileUp, Save } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const templateTypes = [
  "Notificação Extrajudicial",
  "Acordo Extrajudicial",
  "Outro"
];

export default function NewTemplate() {
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: "",
    type: "",
    content: "",
    letterhead: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplate({ ...template, letterhead: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = () => {
    let previewContent = template.content;
    // Simulate variable replacement
    const mockData = {
      nome_cliente: "João Silva",
      endereco_infrator: "Rua Exemplo, 123",
      marca: "Marca Teste",
      data_atual: new Date().toLocaleDateString()
    };

    Object.entries(mockData).forEach(([key, value]) => {
      previewContent = previewContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    // Show preview in a new window
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Preview - ${template.name}</title>
          </head>
          <body>
            ${previewImage ? `<img src="${previewImage}" style="max-width: 100%; margin-bottom: 20px;" />` : ''}
            ${previewContent}
          </body>
        </html>
      `);
    }
  };

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
          <Button variant="outline" onClick={handlePreview}>
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
              value={template.content}
              onChange={(value) => setTemplate({ ...template, content: value })}
              placeholder="Digite o conteúdo do template..."
            />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Papel Timbrado</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {previewImage ? (
                <div className="space-y-2">
                  <img src={previewImage} alt="Preview" className="max-w-full rounded" />
                  <Button variant="ghost" className="w-full" onClick={() => {
                    setPreviewImage("");
                    setTemplate({ ...template, letterhead: null });
                  }}>
                    Remover
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <FileUp className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Clique para fazer upload
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Campos Disponíveis</Label>
            <div className="space-y-2 text-sm">
              <p className="p-2 bg-muted rounded-md cursor-pointer">{"{{nome_cliente}}"}</p>
              <p className="p-2 bg-muted rounded-md cursor-pointer">{"{{endereco_infrator}}"}</p>
              <p className="p-2 bg-muted rounded-md cursor-pointer">{"{{marca}}"}</p>
              <p className="p-2 bg-muted rounded-md cursor-pointer">{"{{data_atual}}"}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
