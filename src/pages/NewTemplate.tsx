
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Upload, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const templateTypes = [
  "Notificação Extrajudicial",
  "Acordo Extrajudicial"
];

const availableBrands = [
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour"
];

const supportedFields = [
  { id: 'nome_cliente', label: 'Nome do Cliente' },
  { id: 'nome_marca', label: 'Nome da Marca' },
  { id: 'endereco_infrator', label: 'Endereço do Infrator' },
  { id: 'data', label: 'Data' },
  { id: 'codigo_caso', label: 'Código do Caso' },
  { id: 'tipo_infracao', label: 'Tipo de Infração' },
  { id: 'link_arquivo', label: 'Link do Arquivo' }
];

const NewTemplate = () => {
  const navigate = useNavigate();
  const [templateData, setTemplateData] = useState({
    name: '',
    type: '',
    brand: '',
    file: null,
  });
  const [searchField, setSearchField] = useState('');
  const [recognizedFields, setRecognizedFields] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setTemplateData(prev => ({ ...prev, file }));
      
      // Aqui seria implementada a lógica de parsing do arquivo .docx
      // e identificação dos campos dinâmicos
      const mockRecognizedFields = ['{{nome_cliente}}', '{{data}}'];
      setRecognizedFields(mockRecognizedFields);
    }
  });

  const filteredFields = supportedFields.filter(field => 
    field.label.toLowerCase().includes(searchField.toLowerCase())
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!templateData.name.trim()) {
      newErrors.name = 'Nome do template é obrigatório';
    }
    
    if (!templateData.type) {
      newErrors.type = 'Tipo do template é obrigatório';
    }
    
    if (!templateData.brand) {
      newErrors.brand = 'Marca é obrigatória';
    }
    
    if (!templateData.file) {
      newErrors.file = 'Arquivo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', templateData.name);
      formData.append('type', templateData.type);
      formData.append('brand', templateData.brand);
      if (templateData.file instanceof File) {
        formData.append('file', templateData.file);
      } else {
        throw new Error('Arquivo inválido');
      }

      const response = await fetch('/api/templates', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar template');
      }

      const data = await response.json();
      console.log('Template criado:', data);

      navigate('/admin/templates');
    } catch (error) {
      console.error('Erro ao salvar template:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/templates')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Novo Template de Documento</h1>
          <p className="text-sm text-muted-foreground">Configure um novo template para documentos</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Template</Label>
              <Input 
                id="name" 
                placeholder="Ex: Notificação Extrajudicial" 
                value={templateData.name}
                onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo do Template</Label>
              <Select 
                value={templateData.type}
                onValueChange={(value) => setTemplateData(prev => ({ ...prev, type: value }))}
                className={errors.type ? 'border-red-500' : ''}>
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
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

            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Select 
                value={templateData.brand}
                onValueChange={(value) => setTemplateData(prev => ({ ...prev, brand: value }))}
                className={errors.brand ? 'border-red-500' : ''}>
              {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {availableBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload do Arquivo</Label>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary ${errors.file ? 'border-red-500' : ''}`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p>Arraste um arquivo .docx ou clique para selecionar</p>
                <p className="text-sm text-muted-foreground">Apenas arquivos .docx são aceitos</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Visualização do Template</h3>
            <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
              {pdfPreview ? (
                <div>Preview do PDF aqui</div>
              ) : (
                <p className="text-muted-foreground">Faça upload de um arquivo para visualizar o preview</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Campos Dinâmicos</h3>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar campos..."
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="pl-8"
              />
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {filteredFields.map(field => (
                  <div 
                    key={field.id}
                    className="p-2 rounded hover:bg-accent flex items-center justify-between"
                  >
                    <span>{field.label}</span>
                    <code className="text-sm text-muted-foreground">{'{{' + field.id + '}}'}</code>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {recognizedFields.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Campos Reconhecidos no Arquivo</h4>
                <div className="space-y-1">
                  {recognizedFields.map((field, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Salvar Template
        </Button>
      </div>
    </div>
  );
};

export default NewTemplate;
