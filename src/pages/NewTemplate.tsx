
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUp, Search } from 'lucide-react';

const templateTypes = [
  "Notificação Extrajudicial",
  "Acordo Extrajudicial",
  "Outros"
];

const dynamicFields = [
  { key: "nome_cliente", description: "Nome do Cliente" },
  { key: "nome_marca", description: "Nome da Marca" },
  { key: "numero_processo", description: "Número do Processo" },
  { key: "endereco_infrator", description: "Endereço do Infrator" },
  { key: "data", description: "Data Atual" },
  { key: "nome_advogado", description: "Nome do Advogado" },
  { key: "codigo_caso", description: "Código do Caso" },
  { key: "tipo_infracao", description: "Tipo de Infração" },
  { key: "link_arquivo", description: "Link do Arquivo" }
];

export default function NewTemplate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    searchField: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    }
  });

  const filteredFields = dynamicFields.filter(field => 
    field.key.includes(formData.searchField.toLowerCase()) ||
    field.description.toLowerCase().includes(formData.searchField.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Template de Documento</h1>
        <p className="text-muted-foreground mt-2">
          Crie um novo template para geração automática de documentos
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  placeholder="Ex: Notificação Extrajudicial"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo do Template</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload do Arquivo</Label>
                <div 
                  {...getRootProps()} 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                >
                  <input {...getInputProps()} />
                  <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : "Arraste um arquivo .docx ou clique para selecionar"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Visualização do Template</h3>
              <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  {file ? "Processando visualização..." : "Faça upload de um arquivo para visualizar"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Campos Dinâmicos</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar campos..."
                  value={formData.searchField}
                  onChange={(e) => setFormData({ ...formData, searchField: e.target.value })}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {filteredFields.map((field) => (
                    <div key={field.key} className="p-2 rounded bg-muted">
                      <p className="font-mono text-sm">{"{{" + field.key + "}}"}</p>
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/templates')}>
          Cancelar
        </Button>
        <Button>
          Salvar Template
        </Button>
      </div>
    </div>
  );
}
