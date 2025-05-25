
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchField, setSearchField] = useState('');
  const [recognizedFields, setRecognizedFields] = useState([]);
  const [docContent, setDocContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setTemplateData(prev => ({ ...prev, file }));
      setUploadProgress(0);
      setIsLoading(true);
      
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const result = await mammoth.convertToHtml({ 
            arrayBuffer,
            styleMap: [
              "p[style-name='Normal'] => p:fresh",
              "b => strong",
              "i => em"
            ]
          });
          setDocContent(result.value);
          
          // Identificar campos dinâmicos no conteúdo
          const matches = result.value.match(/{{[^}]+}}/g) || [];
          const uniqueFields = [...new Set(matches)];
          setRecognizedFields(uniqueFields);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
      } finally {
        setIsLoading(false);
      }
      
      // Simular progresso do upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Aqui seria implementada a lógica de parsing do arquivo .docx
      // e identificação dos campos dinâmicos
      const mockRecognizedFields = ['{{nome_cliente}}', '{{data}}'];
      setRecognizedFields(mockRecognizedFields);
    }
  });

  const filteredFields = supportedFields.filter(field => 
    field.label.toLowerCase().includes(searchField.toLowerCase())
  );

  const insertField = (fieldId: string) => {
    const fieldTag = `{{${fieldId}}}`;
    
    // Inserir campo na posição do cursor
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const fieldNode = document.createTextNode(fieldTag);
      range.insertNode(fieldNode);
      
      // Atualizar o conteúdo
      const editorElement = document.querySelector('[contenteditable]') as HTMLDivElement;
      if (editorElement) {
        setDocContent(editorElement.innerHTML);
        
        // Atualizar campos reconhecidos
        const matches = editorElement.innerHTML.match(/{{[^}]+}}/g) || [];
        const uniqueFields = [...new Set(matches)];
        setRecognizedFields(uniqueFields);
      }
    }
  };

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
                {templateData.file && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">{templateData.file.name}</p>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">{uploadProgress}% carregado</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editor do Template</h3>
              {docContent && (
                <div className="text-sm text-muted-foreground">
                  Clique no texto para posicionar o cursor e inserir campos
                </div>
              )}
            </div>
            <div className="h-[400px] bg-white rounded-lg overflow-auto border">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : docContent ? (
                <div 
                  className="p-6 prose max-w-none cursor-text"
                  contentEditable
                  suppressContentEditableWarning={true}
                  dangerouslySetInnerHTML={{ __html: docContent }}
                  onInput={(e) => {
                    const target = e.target as HTMLDivElement;
                    setDocContent(target.innerHTML);
                    
                    // Atualizar campos reconhecidos
                    const matches = target.innerHTML.match(/{{[^}]+}}/g) || [];
                    const uniqueFields = [...new Set(matches)];
                    setRecognizedFields(uniqueFields);
                  }}
                  onClick={(e) => {
                    const selection = window.getSelection();
                    if (selection) {
                      setCursorPosition(selection.anchorOffset);
                    }
                  }}
                  style={{
                    minHeight: '300px',
                    lineHeight: '1.6',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Faça upload de um arquivo para visualizar o preview</p>
                </div>
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

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredFields.map(field => (
                  <div 
                    key={field.id}
                    className="p-3 rounded border hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => insertField(field.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{field.label}</span>
                      <Button size="sm" variant="outline">
                        Inserir
                      </Button>
                    </div>
                    <code className="text-xs text-muted-foreground block mt-1">
                      {'{{' + field.id + '}}'}
                    </code>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {recognizedFields.length > 0 && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Campos Detectados ({recognizedFields.length})
                </h4>
                <div className="space-y-2">
                  {recognizedFields.map((field, index) => (
                    <div 
                      key={index} 
                      className="text-sm font-mono bg-background p-2 rounded border"
                    >
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
