
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, FileUp, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Badge } from "@/components/ui/badge";

const templateTypes = [
  { value: "notification", label: "Notificação Extrajudicial" },
  { value: "agreement", label: "Acordo Extrajudicial" },
  { value: "other", label: "Outro" }
];

const dynamicFields = [
  { key: "nome_cliente", description: "Nome do Cliente" },
  { key: "nome_marca", description: "Nome da Marca" },
  { key: "numero_processo", description: "Número do Processo" },
  { key: "endereco_infrator", description: "Endereço do Infrator" },
  { key: "data", description: "Data Atual" },
  { key: "nome_advogado", description: "Nome do Advogado" }
];

export default function NewTemplate() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setDocxFile(file);
      // In a real implementation, you would upload the file and get a preview URL
      // setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    // Implement save logic here
    console.log("Saving template:", { templateName, templateType, docxFile });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Novo Template de Documento</h1>
          <p className="text-muted-foreground mt-2">
            Crie e gerencie templates para documentos automatizados
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Template</label>
                <Input
                  placeholder="Ex: Notificação Extrajudicial Padrão"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Template</label>
                <Select value={templateType} onValueChange={setTemplateType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Arquivo .docx</label>
                <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="docx-upload"
                  />
                  <label
                    htmlFor="docx-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <FileUp className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Clique para fazer upload do arquivo .docx
                    </span>
                    {docxFile && (
                      <Badge variant="secondary" className="mt-2">
                        {docxFile.name}
                      </Badge>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {previewUrl && (
            <Card>
              <CardContent className="p-6">
                <iframe
                  src={previewUrl}
                  className="w-full h-[600px] border rounded"
                  title="Preview do documento"
                />
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Campos Dinâmicos Disponíveis</h2>
            <div className="space-y-2">
              {dynamicFields.map((field) => (
                <div
                  key={field.key}
                  className="p-2 bg-muted rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-mono text-sm">{"{{" + field.key + "}}"}</p>
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("{{" + field.key + "}}");
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
