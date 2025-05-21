
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChevronLeft, Link, Paperclip, Plus, Send, Trash2, ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const steps = [
  { id: 'received', title: 'Recebido', color: 'bg-primary' },
  { id: 'analysis', title: 'Caso em Análise', color: 'bg-warning' },
  { id: 'pending', title: 'Pendente de Informação', color: 'bg-orange-500' },
  { id: 'completed', title: 'Concluído', color: 'bg-success' }
];

const storeSize = (followers: number) => {
  if (followers <= 1000) return 'Micro';
  if (followers <= 4000) return 'Pequeno';
  if (followers <= 15000) return 'Médio';
  return 'Grande';
};

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function CaseDetails() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState('analysis');
  const [daysInStep, setDaysInStep] = useState(5);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [comment, setComment] = useState('');
  const [lastUpdate] = useState(new Date().toLocaleString());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    responsibleName: '',
    gender: '',
    document: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    productType: '',
    potentialValue: 0,
    followers: 0,
    storeSize: 'Micro',
    files: {
      counterfeitAd: null as File | null,
      salesPage: null as File | null,
      others: [] as File[]
    }
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'followers') {
        newData.storeSize = storeSize(Number(value));
      }
      return newData;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Links validation
    if (links.length < 2) {
      newErrors.links = 'Adicione pelo menos 2 links suspeitos';
    }

    // Basic information validation
    if (!formData.responsibleName) newErrors.responsibleName = 'Nome é obrigatório';
    if (!formData.gender) newErrors.gender = 'Selecione o gênero';
    if (!formData.document) newErrors.document = 'CPF/CNPJ é obrigatório';
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';

    // Address validation
    if (!formData.street) newErrors.street = 'Rua é obrigatória';
    if (!formData.number) newErrors.number = 'Número é obrigatório';
    if (!formData.neighborhood) newErrors.neighborhood = 'Bairro é obrigatório';
    if (!formData.city) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state) newErrors.state = 'Estado é obrigatório';
    if (!formData.zipCode) newErrors.zipCode = 'CEP é obrigatório';

    // Case details validation
    if (!formData.productType) newErrors.productType = 'Selecione o tipo de produto';
    if (formData.potentialValue <= 0) newErrors.potentialValue = 'Valor deve ser maior que 0';

    // Files validation
    if (!formData.files.counterfeitAd) newErrors.counterfeitAd = 'Anúncio do produto contrafeito é obrigatório';
    if (!formData.files.salesPage) newErrors.salesPage = 'Página de venda é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId);
    // Update last movement date
    const now = new Date().toLocaleString();
    toast({
      title: "Status atualizado",
      description: `Caso movido para ${steps.find(s => s.id === stepId)?.title}`,
    });
  };

  const handlePreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      handleStepClick(steps[currentIndex - 1].id);
    }
  };

  const handleComplete = () => {
    if (validateForm()) {
      toast({
        title: "Caso concluído",
        description: "Enviando para o setor de Auditoria...",
      });
      // Navigate to next sector's received state
      navigate('/kanban/auditoria');
    } else {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros antes de concluir.",
        variant: "destructive",
      });
    }
  };

  const handleAddLink = () => {
    if (newLink) {
      setLinks([...links, newLink]);
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleFileUpload = (field: keyof typeof formData.files, file: File) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [field]: file
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Caso #{id} - Falsificação de Produto X
              <span className="ml-3 text-sm text-muted-foreground">
                🕒 {daysInStep} dias nesta etapa
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Última atualização: {lastUpdate}
            </p>
          </div>
          <Badge variant="secondary">
            Verificação
          </Badge>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between p-4 rounded-lg border">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`flex items-center focus:outline-none ${
                currentStep === step.id ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step.id ? step.color + ' text-white' : 'bg-muted'
              }`}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm">{step.title}</span>
              {index < steps.length - 1 && (
                <div className="mx-2 h-1 w-16 bg-muted" />
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
            disabled={currentStep === steps[0].id}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <Button 
            onClick={handleComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Concluído
          </Button>
        </div>

        <div className="grid gap-6">
          {/* SEÇÃO A - Links Suspeitos */}
          <Card>
            <CardHeader>
              <CardTitle>Links Suspeitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Adicionar novo link" 
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className={errors.links ? 'border-red-500' : ''}
                />
                <Button onClick={handleAddLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Link
                </Button>
              </div>
              {errors.links && (
                <p className="text-sm text-red-500">{errors.links}</p>
              )}
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg border">
                    <Link className="h-4 w-4" />
                    <a href={link} className="flex-1 text-primary hover:underline">{link}</a>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveLink(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO B - Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Nome do responsável ou empresa"
                  value={formData.responsibleName}
                  onChange={(e) => handleInputChange('responsibleName', e.target.value)}
                  className={errors.responsibleName ? 'border-red-500' : ''}
                />
                {errors.responsibleName && (
                  <p className="text-sm text-red-500">{errors.responsibleName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="N">Não especificado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input 
                  placeholder="CPF/CNPJ"
                  value={formData.document}
                  onChange={(e) => handleInputChange('document', e.target.value)}
                  className={errors.document ? 'border-red-500' : ''}
                />
                {errors.document && (
                  <p className="text-sm text-red-500">{errors.document}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input 
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO C - Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {/* Street */}
              <div className="space-y-2">
                <Input 
                  placeholder="Rua"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={errors.street ? 'border-red-500' : ''}
                />
                {errors.street && (
                  <p className="text-sm text-red-500">{errors.street}</p>
                )}
              </div>

              {/* Number */}
              <div className="space-y-2">
                <Input 
                  placeholder="Número"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  className={errors.number ? 'border-red-500' : ''}
                />
                {errors.number && (
                  <p className="text-sm text-red-500">{errors.number}</p>
                )}
              </div>

              {/* Neighborhood */}
              <div className="space-y-2">
                <Input 
                  placeholder="Bairro"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  className={errors.neighborhood ? 'border-red-500' : ''}
                />
                {errors.neighborhood && (
                  <p className="text-sm text-red-500">{errors.neighborhood}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Input 
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange('state', value)}
                >
                  <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Estado (UF)" />
                  </SelectTrigger>
                  <SelectContent>
                    {brazilianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state}</p>
                )}
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Input 
                  placeholder="CEP"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-500">{errors.zipCode}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO D - Detalhes do Caso */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Caso</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select
                  value={formData.productType}
                  onValueChange={(value) => handleInputChange('productType', value)}
                >
                  <SelectTrigger className={errors.productType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Tipo de Produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eletronico">Eletrônico</SelectItem>
                    <SelectItem value="vestuario">Vestuário</SelectItem>
                    <SelectItem value="cosmetico">Cosmético</SelectItem>
                  </SelectContent>
                </Select>
                {errors.productType && (
                  <p className="text-sm text-red-500">{errors.productType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input 
                  type="number"
                  placeholder="Potencial Indenizatório (R$)"
                  value={formData.potentialValue}
                  onChange={(e) => handleInputChange('potentialValue', Number(e.target.value))}
                  className={errors.potentialValue ? 'border-red-500' : ''}
                />
                {errors.potentialValue && (
                  <p className="text-sm text-red-500">{errors.potentialValue}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input 
                  type="number"
                  placeholder="Quantidade de Seguidores"
                  value={formData.followers}
                  onChange={(e) => handleInputChange('followers', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Input 
                  disabled
                  value={formData.storeSize}
                  placeholder="Tamanho da Loja"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO E - Anexos */}
          <Card>
            <CardHeader>
              <CardTitle>Anexos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('counterfeitAd', e.target.files?.[0] ?? null)}
                    className={`w-full ${errors.counterfeitAd ? 'border-red-500' : ''}`}
                  />
                  <p className="text-sm text-muted-foreground">
                    Anúncio do produto contrafeito (PDF)
                  </p>
                  {errors.counterfeitAd && (
                    <p className="text-sm text-red-500">{errors.counterfeitAd}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('salesPage', e.target.files?.[0] ?? null)}
                    className={`w-full ${errors.salesPage ? 'border-red-500' : ''}`}
                  />
                  <p className="text-sm text-muted-foreground">
                    Página de venda (PDF)
                  </p>
                  {errors.salesPage && (
                    <p className="text-sm text-red-500">{errors.salesPage}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData(prev => ({
                        ...prev,
                        files: {
                          ...prev.files,
                          others: files
                        }
                      }));
                    }}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Outros anexos (qualquer formato)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO F e G - Timeline e Comentários */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-muted pl-4 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[9px] w-3 h-3 rounded-full bg-primary"></div>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Hoje, 14:30</p>
                      <p className="text-sm">Caso movido para análise por João Silva</p>
                    </div>
                  </div>
                </div>

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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
