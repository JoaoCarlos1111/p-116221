
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
    urls: null,
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
    ]
  });

  const handleFieldApproval = (section: string, field: string, status: 'approved' | 'rejected', reason?: string) => {
    setSectionApprovals(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.field === field 
          ? { ...item, status, reason: reason || null }
          : item
      )
    }));
  };

  const [requirements, setRequirements] = useState({
    basicInfo: false,
    attachments: false,
    validLinks: false,
    properDocumentation: false
  });

  const handleSectionApproval = (section: string, approved: boolean) => {
    setSectionApprovals(prev => ({
      ...prev,
      [section]: approved
    }));
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Requisitos de Aprovação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {Object.entries(requirements).map(([key, checked]) => (
                <div key={key} className="flex items-start space-x-2">
                  <Checkbox
                    id={key}
                    checked={checked}
                    onCheckedChange={(checked) =>
                      setRequirements(prev => ({
                        ...prev,
                        [key]: checked === true
                      }))
                    }
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

        <Card>
          <CardHeader>
            <CardTitle>Documentos Anexados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Anúncio do Produto</span>
                  <Badge variant="secondary">Obrigatório</Badge>
                </div>
                <Button variant="ghost" size="sm">Visualizar</Button>
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Página de Venda</span>
                  <Badge variant="secondary">Obrigatório</Badge>
                </div>
                <Button variant="ghost" size="sm">Visualizar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URLs Suspeitas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>URLs Suspeitas</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="text-green-600" onClick={() => handleSectionApproval('urls', true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button variant="outline" className="text-red-600" onClick={() => handleSectionRejection('urls')}>
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              {['https://lojaexemplo.com', 'https://marketplace.com/anuncio/123'].map((url, index) => (
                <div key={index} className="flex items-center">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações Básicas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Básicas</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="text-green-600" onClick={() => handleSectionApproval('basicInfo', true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button variant="outline" className="text-red-600" onClick={() => handleSectionRejection('basicInfo')}>
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
            </div>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Endereço</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="text-green-600" onClick={() => handleSectionApproval('address', true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button variant="outline" className="text-red-600" onClick={() => handleSectionRejection('address')}>
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rua, Número</label>
                <p className="text-sm">Rua Exemplo, 123</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bairro</label>
                <p className="text-sm">Centro</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cidade - Estado (UF)</label>
                <p className="text-sm">São Paulo - SP</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CEP</label>
                <p className="text-sm">01234-567</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Case Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Caso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
