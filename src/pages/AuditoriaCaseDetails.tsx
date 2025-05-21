
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, CheckCircle, XCircle, ExternalLink, AlertTriangle, User, Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

interface SectionStatus {
  approved: boolean;
  rejected: boolean;
  reason?: string;
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
      phone: "(11) 99999-9999"
    },
    address: {
      street: "Rua das Flores, 123",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    }
  };

  const [rejectionDialog, setRejectionDialog] = useState<{ show: boolean; section: string } | null>(null);
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
        approved: approved,
        rejected: !approved,
        reason: approved ? undefined : prev[section].reason
      }
    }));
  };

  const handleReject = (section: string, reason: string) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        approved: false,
        rejected: true,
        reason
      }
    }));
    setRejectionDialog(null);
    toast({
      title: "Seção Reprovada",
      description: "A seção foi marcada para revisão.",
    });
  };

  const allSectionsReviewed = Object.values(sections).every(section => section.approved || section.rejected);
  const hasRejectedSections = Object.values(sections).some(section => section.rejected);

  const RejectionDialogContent = ({ section, onConfirm, onCancel }: {
    section: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
  }) => {
    const [reason, setReason] = useState('');
    
    return (
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justificativa da Reprovação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="Digite o motivo da reprovação..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Button
              variant="destructive"
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim()}
              className="w-full"
            >
              Confirmar Reprovação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {caseData.analyst}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(caseData.submissionDate, 'dd/MM/yyyy HH:mm')}
              </div>
              <Badge variant="secondary">{caseData.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => setRejectionDialog({ show: true, section: 'case' })}
            disabled={!allSectionsReviewed || !hasRejectedSections}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reprovar Caso
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Caso Aprovado",
                description: "O caso foi aprovado com sucesso.",
              });
              navigate('/auditoria');
            }}
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
          <CardHeader>
            <CardTitle>URLs Suspeitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {caseData.urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {url}
                  </a>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button 
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleSectionApproval('urls', true)}
                disabled={sections.urls.approved}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => setRejectionDialog({ show: true, section: 'urls' })}
                disabled={sections.urls.rejected}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reprovar
              </Button>
            </div>
            {sections.urls.reason && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{sections.urls.reason}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium">Nome do responsável ou empresa</div>
                <div>{caseData.basicInfo.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium">CPF/CNPJ</div>
                <div>{caseData.basicInfo.document}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Telefone</div>
                <div>{caseData.basicInfo.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button 
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleSectionApproval('basicInfo', true)}
                disabled={sections.basicInfo.approved}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => setRejectionDialog({ show: true, section: 'basicInfo' })}
                disabled={sections.basicInfo.rejected}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reprovar
              </Button>
            </div>
            {sections.basicInfo.reason && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{sections.basicInfo.reason}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium">Endereço</div>
                <div>{caseData.address.street}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Bairro</div>
                <div>{caseData.address.district}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Cidade - Estado</div>
                <div>{caseData.address.city} - {caseData.address.state}</div>
              </div>
              <div>
                <div className="text-sm font-medium">CEP</div>
                <div>{caseData.address.zipCode}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button 
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleSectionApproval('address', true)}
                disabled={sections.address.approved}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => setRejectionDialog({ show: true, section: 'address' })}
                disabled={sections.address.rejected}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reprovar
              </Button>
            </div>
            {sections.address.reason && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{sections.address.reason}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Documentos Anexados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Anúncio do Produto</span>
                </div>
                <Button variant="ghost" size="sm">Visualizar</Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Página de Venda</span>
                </div>
                <Button variant="ghost" size="sm">Visualizar</Button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button 
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleSectionApproval('docs', true)}
                disabled={sections.docs.approved}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => setRejectionDialog({ show: true, section: 'docs' })}
                disabled={sections.docs.rejected}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reprovar
              </Button>
            </div>
            {sections.docs.reason && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{sections.docs.reason}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {rejectionDialog && (
        <RejectionDialogContent
          section={rejectionDialog.section}
          onConfirm={(reason) => handleReject(rejectionDialog.section, reason)}
          onCancel={() => setRejectionDialog(null)}
        />
      )}
    </div>
  );
}
