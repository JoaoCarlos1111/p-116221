import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, ChevronLeft, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function AuditoriaCaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [requirements, setRequirements] = useState({
    basicInfo: false,
    attachments: false,
    validLinks: false,
    properDocumentation: false
  });

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
            <p className="text-muted-foreground text-lg">
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
        <Card className="glass-card">
          <CardHeader className="p-6 pb-3">
            <CardTitle>Requisitos de Aprovação</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-6">
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
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Anúncio do Produto</span>
                  <Badge variant="secondary">Obrigatório</Badge>
                </div>
                <Button variant="ghost" size="sm">Visualizar</Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:bg-muted/50 transition-colors">
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