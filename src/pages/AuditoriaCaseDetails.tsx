import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, ChevronLeft, FileText, AlertTriangle, ExternalLink, User, Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function AuditoriaCaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [currentField, setCurrentField] = useState<{ section: string; field: string } | null>(null);
  const [sectionApprovals, setSectionApprovals] = useState({
    urls: [
      { field: 'https://lojaexemplo.com', status: null, reason: null },
      { field: 'https://marketplace.com/anuncio/123', status: null, reason: null }
    ],
    documents: [
      { field: 'anuncio', status: null, reason: null },
      { field: 'venda', status: null, reason: null }
    ],
    basicInfo: [
      { field: 'name', status: null, reason: null },
      { field: 'document', status: null, reason: null },
      { field: 'phone', status: null, reason: null }
    ],
    address: [
      { field: 'street', status: null, reason: null },
      { field: 'neighborhood', status: null, reason: null },
      { field: 'city', status: null, reason: null },
      { field: 'cep', status: null, reason: null }
    ],
    documents: [
      { field: 'anuncio', status: null, reason: null },
      { field: 'venda', status: null, reason: null }
    ]
  });

  const handleFieldApproval = (section: string, field: string, status: 'approved' | 'rejected', reason?: string) => {
    const newSectionApprovals = {
      ...sectionApprovals,
      [section]: sectionApprovals[section].map((item: any) => 
        item.field === field 
          ? { ...item, status, reason: reason || null }
          : item
      )
    };
    setSectionApprovals(newSectionApprovals);
    updateRequirements(newSectionApprovals);
  };

  const [requirements, setRequirements] = useState({
    basicInfo: false,
    attachments: false,
    validLinks: false,
    properDocumentation: false
  });

  // Update requirements based on section approvals
  const updateRequirements = (newSectionApprovals: any) => {
    setRequirements({
      basicInfo: newSectionApprovals.basicInfo?.every((field: any) => field.status === 'approved') && 
                newSectionApprovals.address?.every((field: any) => field.status === 'approved'),
      attachments: newSectionApprovals.documents?.every((field: any) => field.status === 'approved'),
      validLinks: newSectionApprovals.urls?.every((field: any) => field.status === 'approved'),
      properDocumentation: newSectionApprovals.documents?.every((field: any) => field.status === 'approved')
    });
  };
    const newSectionApprovals = {
      ...sectionApprovals,
      [section]: sectionApprovals[section].map((item: any) => 
        item.field === field 
          ? { ...item, status, reason: reason || null }
          : item
      )
    };
    setSectionApprovals(newSectionApprovals);
    updateRequirements(newSectionApprovals);
  };

  const handleSectionRejection = (section: string) => {
    setShowRejectDialog(true);
    // Store the section being rejected for when the dialog is confirmed
  };

  const allSectionsApproved = Object.values(sectionApprovals).every(value => value === true);

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  const handleApprove = async () => {
    try {
      // API call would go here
      toast({
        title: "Caso Aprovado",
        description: "O caso foi aprovado e seguirá para notificação.",
      });
      navigate('/auditoria');
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro ao aprovar o caso.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) return;
    try {
      // API call would go here
      toast({
        title: "Caso Rejeitado",
        description: "O caso foi devolvido para verificação.",
      });
      setShowRejectDialog(false);
      navigate('/auditoria');
    } catch (error) {
      toast({
        title: "Erro ao rejeitar",
        description: "Ocorreu um erro ao rejeitar o caso.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/auditoria')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Auditoria do Caso #{id}
            </h1>
            <p className="text-muted-foreground">
              Verificação de conformidade e aprovação final
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => setShowRejectDialog(true)}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
          <Button
            onClick={handleApprove}
            disabled={!allRequirementsMet}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Requisitos de Aprovação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-3">
            <div className="space-y-4">
              {Object.entries(requirements).map(([key, checked]) => (
                <div key={key} className="flex items-start space-x-2">
                  <Checkbox
                    id={key}
                    checked={checked}
                    disabled={true}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {key === 'basicInfo' && 'Informações básicas completas'}
                      {key === 'attachments' && 'Anexos obrigatórios presentes'}
                      {key === 'validLinks' && 'Links verificados e válidos'}
                      {key === 'properDocumentation' && 'Documentação adequada'}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {!allRequirementsMet && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Todos os requisitos precisam ser verificados para aprovar o caso.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className={`shadow-lg border-0 bg-white transition-colors ${
          sectionApprovals.documents?.every(field => field.status === 'approved') 
            ? 'bg-green-50' 
            : sectionApprovals.documents?.some(field => field.status === 'rejected')
              ? 'bg-red-50'
              : ''
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Documentos Anexados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Anúncio do Produto</span>
                  <Badge variant="secondary">Obrigatório</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">Visualizar</Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${
                    sectionApprovals.documents?.find(f => f.field === 'anuncio')?.status === 'approved'
                      ? 'text-green-600 bg-green-100'
                      : ''
                  }`}
                    onClick={() => handleFieldApproval('documents', 'anuncio', 'approved')}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${
                    sectionApprovals.documents?.find(f => f.field === 'anuncio')?.status === 'rejected'
                      ? 'text-red-600 bg-red-100'
                      : ''
                  }`}
                    onClick={() => {
                      setCurrentField({ section: 'documents', field: 'anuncio' });
                      setShowRejectDialog(true);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Página de Venda</span>
                  <Badge variant="secondary">Obrigatório</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">Visualizar</Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${
                    sectionApprovals.documents?.find(f => f.field === 'venda')?.status === 'approved'
                      ? 'text-green-600 bg-green-100'
                      : ''
                  }`}
                  onClick={() => handleFieldApproval('documents', 'venda', 'approved')}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${
                    sectionApprovals.documents?.find(f => f.field === 'venda')?.status === 'rejected'
                      ? 'text-red-600 bg-red-100'
                      : ''
                  }`}
                  onClick={() => {
                    setCurrentField({ section: 'documents', field: 'venda' });
                    setShowRejectDialog(true);
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URLs Suspeitas */}
        <Card className={`shadow-lg border-0 bg-white transition-colors ${
          sectionApprovals.urls?.every(field => field.status === 'approved') 
            ? 'bg-green-50' 
            : sectionApprovals.urls?.some(field => field.status === 'rejected')
              ? 'bg-red-50'
              : ''
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">URLs Suspeitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              {sectionApprovals.urls.map((urlItem, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-black/5">
                  <a href={urlItem.field} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {urlItem.field}
                  </a>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        sectionApprovals.urls?.find(f => f.field === urlItem.field)?.status === 'approved'
                          ? 'text-green-600 bg-green-100'
                          : ''
                      }`}
                      onClick={() => handleFieldApproval('urls', urlItem.field, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        sectionApprovals.urls?.find(f => f.field === urlItem.field)?.status === 'rejected'
                          ? 'text-red-600 bg-red-100'
                          : ''
                      }`}
                      onClick={() => {
                        setCurrentField({ section: 'urls', field: urlItem.field });
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações Básicas */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-4 transition-colors ${
            sectionApprovals.basicInfo?.every(field => field.status === 'approved') 
              ? 'bg-green-50' 
              : sectionApprovals.basicInfo?.some(field => field.status === 'rejected')
                ? 'bg-red-50'
                : ''
          }`}>
            <div className="grid gap-4">
              {[
                { label: 'Nome do responsável ou empresa', value: 'Empresa Exemplo LTDA', field: 'name' },
                { label: 'CPF/CNPJ', value: '12.345.678/0001-90', field: 'document' },
                { label: 'Telefone', value: '(11) 99999-9999', field: 'phone' }
              ].map((item) => (
                <div key={item.field} className="flex items-start justify-between gap-4 p-2 rounded hover:bg-black/5">
                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium">{item.label}</label>
                    <p className="text-sm">{item.value}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        sectionApprovals.basicInfo?.find(f => f.field === item.field)?.status === 'approved'
                          ? 'text-green-600 bg-green-100'
                          : ''
                      }`}
                      onClick={() => handleFieldApproval('basicInfo', item.field, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        sectionApprovals.basicInfo?.find(f => f.field === item.field)?.status === 'rejected'
                          ? 'text-red-600 bg-red-100'
                          : ''
                      }`}
                      onClick={() => {
                        setCurrentField({ section: 'basicInfo', field: item.field });
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className={`shadow-lg border-0 bg-white transition-colors ${
          sectionApprovals.address?.every(field => field.status === 'approved') 
            ? 'bg-green-50' 
            : sectionApprovals.address?.some(field => field.status === 'rejected')
              ? 'bg-red-50'
              : ''
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {[
                { label: 'Rua, Número', value: 'Rua Exemplo, 123', field: 'street' },
                { label: 'Bairro', value: 'Centro', field: 'neighborhood' },
                { label: 'Cidade - Estado (UF)', value: 'São Paulo - SP', field: 'city' },
                { label: 'CEP', value: '01234-567', field: 'cep' }
              ].map((item) => (
                <div key={item.field} className="flex items-start justify-between gap-4 p-2 rounded hover:bg-black/5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">{item.label}</label>
                    <p className="text-sm">{item.value}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        sectionApprovals.address?.find(f => f.field === item.field)?.status === 'approved'
                          ? 'text-green-600 bg-green-100'
                          : ''
                      }`}
                      onClick={() => handleFieldApproval('address', item.field, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        sectionApprovals.address?.find(f => f.field === item.field)?.status === 'rejected'
                          ? 'text-red-600 bg-red-100'
                          : ''
                      }`}
                      onClick={() => {
                        setCurrentField({ section: 'address', field: item.field });
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Case Info */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Informações do Caso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">Analista: João Silva</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Enviado em: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <Badge variant="secondary">Status: Pendente de Auditoria</Badge>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Caso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="Descreva o motivo da rejeição..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason}
              className="w-full"
            >
              Confirmar Rejeição
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}