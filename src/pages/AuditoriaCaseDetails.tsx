
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, CheckCircle, XCircle, ExternalLink, User, Calendar, AlertTriangle } from 'lucide-react';
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
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Mock data - replace with API data
  const [caseData] = useState({
    analyst: 'João Silva',
    submissionDate: '2024-03-21T10:30:00',
    status: 'Pendente de Auditoria',
    suspectUrls: [
      'https://lojaexemplo.com',
      'https://marketplace.com/anuncio/123'
    ],
    responsibleParty: 'Empresa ABC Ltda',
    document: '12.345.678/0001-90',
    phone: '(11) 99999-9999',
    address: {
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    }
  });

  const [sectionStatus, setSectionStatus] = useState<Record<string, SectionStatus>>({
    urls: { approved: false, rejected: false },
    basicInfo: { approved: false, rejected: false },
    address: { approved: false, rejected: false }
  });

  const handleApproveSection = (section: string) => {
    setSectionStatus(prev => ({
      ...prev,
      [section]: { approved: true, rejected: false }
    }));
  };

  const handleOpenRejectDialog = (section: string) => {
    setSelectedSection(section);
    setShowRejectDialog(true);
  };

  const handleRejectSection = () => {
    if (!rejectionReason) return;
    
    setSectionStatus(prev => ({
      ...prev,
      [selectedSection]: { approved: false, rejected: true, reason: rejectionReason }
    }));
    setShowRejectDialog(false);
    setRejectionReason('');
  };

  const allSectionsReviewed = Object.values(sectionStatus).every(
    status => status.approved || status.rejected
  );

  const allSectionsApproved = Object.values(sectionStatus).every(
    status => status.approved
  );

  const handleApproveCaseComplete = async () => {
    try {
      // API call would go here
      toast({
        title: "Caso Aprovado",
        description: "O caso foi aprovado com sucesso.",
      });
      navigate('/auditoria');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar o caso.",
        variant: "destructive"
      });
    }
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
                <span>Analista: {caseData.analyst}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Enviado em: {format(new Date(caseData.submissionDate), 'dd/MM/yyyy HH:mm')}</span>
              </div>
              <Badge variant="secondary">{caseData.status}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>URLs Suspeitas</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600"
                onClick={() => handleApproveSection('urls')}
                disabled={sectionStatus.urls.approved || sectionStatus.urls.rejected}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600"
                onClick={() => handleOpenRejectDialog('urls')}
                disabled={sectionStatus.urls.approved || sectionStatus.urls.rejected}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {caseData.suspectUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Básicas</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600"
                onClick={() => handleApproveSection('basicInfo')}
                disabled={sectionStatus.basicInfo.approved || sectionStatus.basicInfo.rejected}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600"
                onClick={() => handleOpenRejectDialog('basicInfo')}
                disabled={sectionStatus.basicInfo.approved || sectionStatus.basicInfo.rejected}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <p><strong>Nome:</strong> {caseData.responsibleParty}</p>
              <p><strong>CPF/CNPJ:</strong> {caseData.document}</p>
              <p><strong>Telefone:</strong> {caseData.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Endereço</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600"
                onClick={() => handleApproveSection('address')}
                disabled={sectionStatus.address.approved || sectionStatus.address.rejected}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600"
                onClick={() => handleOpenRejectDialog('address')}
                disabled={sectionStatus.address.approved || sectionStatus.address.rejected}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <p><strong>Rua:</strong> {caseData.address.street}</p>
              <p><strong>Bairro:</strong> {caseData.address.neighborhood}</p>
              <p><strong>Cidade:</strong> {caseData.address.city} - {caseData.address.state}</p>
              <p><strong>CEP:</strong> {caseData.address.zipCode}</p>
            </div>
          </CardContent>
        </Card>

        {allSectionsReviewed && (
          <div className="flex justify-end gap-4">
            {allSectionsApproved ? (
              <Button
                onClick={handleApproveCaseComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar Caso Completo
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => navigate('/auditoria')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar Caso
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justificativa da Reprovação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="Descreva o motivo da reprovação..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <Button
              variant="destructive"
              onClick={handleRejectSection}
              disabled={!rejectionReason}
              className="w-full"
            >
              Confirmar Reprovação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
