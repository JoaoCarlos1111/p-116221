import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, CheckCircle, XCircle, ExternalLink, AlertTriangle, User, Calendar, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

interface SectionStatus {
  approved: boolean;
  rejected: boolean;
  rejectionReason?: string;
}

export default function AuditoriaCaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - replace with API call
  const caseData = {
    analyst: "João Silva",
    submissionDate: new Date(),
    status: "Pendente de Auditoria",
    urls: [
      "https://lojaexemplo.com",
      "https://marketplace.com/anuncio/123"
    ],
    basicInfo: {
      name: "Empresa Exemplo LTDA",
      document: "12.345.678/0001-90",
      phone: "(11) 98765-4321"
    },
    address: {
      street: "Rua das Flores, 123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    }
  };

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [sections, setSections] = useState({
    urls: { approved: false, rejected: false } as SectionStatus,
    basicInfo: { approved: false, rejected: false } as SectionStatus,
    address: { approved: false, rejected: false } as SectionStatus,
    docs: { approved: false, rejected: false } as SectionStatus
  });

  const handleSectionApproval = (section: keyof typeof sections, approved: boolean) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        approved,
        rejected: false,
        rejectionReason: undefined
      }
    }));
  };

  const handleSectionRejection = (section: keyof typeof sections, reason: string) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        approved: false,
        rejected: true,
        rejectionReason: reason
      }
    }));
  };

  const allSectionsReviewed = Object.values(sections).every(
    section => section.approved || section.rejected
  );

  const hasRejectedSections = Object.values(sections).some(
    section => section.rejected
  );

  const handleCaseApproval = async () => {
    try {
      // API call would go here
      toast({
        title: "Caso Aprovado",
        description: "O caso foi aprovado com sucesso.",
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

  const handleCaseRejection = async () => {
    try {
      // API call would go here
      toast({
        title: "Caso Rejeitado",
        description: "O caso foi devolvido para verificação.",
      });
      navigate('/auditoria');
    } catch (error) {
      toast({
        title: "Erro ao rejeitar",
        description: "Ocorreu um erro ao rejeitar o caso.",
        variant: "destructive",
      });
    }
  };

  const RejectDialog = ({ section, onConfirm, onCancel }: { 
    section: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
  }) => {
    const [reason, setReason] = useState('');

    return (
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Seção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="Descreva o motivo da reprovação..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Button
              variant="destructive"
              onClick={() => onConfirm(reason)}
              disabled={!reason}
              className="w-full"
            >
              Confirmar Reprovação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const [rejectionDialog, setRejectionDialog] = useState<{
    show: boolean;
    section: keyof typeof sections;
  } | null>(null);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="lg" onClick={() => navigate('/auditoria')}>
            <ChevronLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Auditoria do Caso #{id}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Analista: {caseData.analyst}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Enviado em: {format(caseData.submissionDate, 'dd/MM/yyyy')}</span>
              </div>
              <Badge variant="secondary">{caseData.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleCaseRejection}
            disabled={!allSectionsReviewed || !hasRejectedSections}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reprovar Caso
          </Button>
          <Button
            onClick={handleCaseApproval}
            disabled={!allSectionsReviewed || hasRejectedSections}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar Caso
          </Button>
        </div>
      </header>

      <div className="grid gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>URLs Suspeitas</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-red-50 hover:bg-red-100"
                onClick={() => setRejectionDialog({ show: true, section: 'urls' })}
                disabled={sections.urls.approved}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
              <Button
                variant="outline"
                className="bg-green-50 hover:bg-green-100"
                onClick={() => handleSectionApproval('urls', true)}
                disabled={sections.urls.rejected}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {caseData.urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a href={url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {url}
                  </a>
                </div>
              ))}
            </div>
            {sections.urls.rejected && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {sections.urls.rejectionReason}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Básicas</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-red-50 hover:bg-red-100"
                onClick={() => setRejectionDialog({ show: true, section: 'basicInfo' })}
                disabled={sections.basicInfo.approved}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
              <Button
                variant="outline"
                className="bg-green-50 hover:bg-green-100"
                onClick={() => handleSectionApproval('basicInfo', true)}
                disabled={sections.basicInfo.rejected}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome do responsável ou empresa</label>
                <p className="text-lg">{caseData.basicInfo.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CPF/CNPJ</label>
                <p className="text-lg">{caseData.basicInfo.document}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                <p className="text-lg">{caseData.basicInfo.phone}</p>
              </div>
            </div>
            {sections.basicInfo.rejected && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {sections.basicInfo.rejectionReason}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Endereço</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-red-50 hover:bg-red-100"
                onClick={() => setRejectionDialog({ show: true, section: 'address' })}
                disabled={sections.address.approved}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
              <Button
                variant="outline"
                className="bg-green-50 hover:bg-green-100"
                onClick={() => handleSectionApproval('address', true)}
                disabled={sections.address.rejected}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rua e Número</label>
                <p className="text-lg">{caseData.address.street}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bairro</label>
                <p className="text-lg">{caseData.address.neighborhood}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cidade - Estado</label>
                <p className="text-lg">{caseData.address.city} - {caseData.address.state}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CEP</label>
                <p className="text-lg">{caseData.address.zipCode}</p>
              </div>
            </div>
            {sections.address.rejected && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {sections.address.rejectionReason}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Anúncio do Produto</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleSectionApproval('docs', true)}
                    disabled={sections.docs?.approved}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setRejectionDialog({ show: true, section: 'docs' })}
                    disabled={sections.docs?.rejected}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reprovar
                  </Button>
                  <Button variant="ghost" size="sm">Visualizar</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Página de Venda</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleSectionApproval('docs', true)}
                    disabled={sections.docs?.approved}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setRejectionDialog({ show: true, section: 'docs' })}
                    disabled={sections.docs?.rejected}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reprovar
                  </Button>
                  <Button variant="ghost" size="sm">Visualizar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {rejectionDialog && (
        <RejectDialog
          section={rejectionDialog.section}
          onConfirm={(reason) => {
            handleSectionRejection(rejectionDialog.section, reason);
            setRejectionDialog(null);
          }}
          onCancel={() => setRejectionDialog(null)}
        />
      )}
    </div>
  );
}