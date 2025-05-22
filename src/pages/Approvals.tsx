
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, FileText, Search, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Approval {
  id: string;
  proofUrl: string;
  entryDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>([
    { id: 'CASE-001', proofUrl: '/proof1.pdf', entryDate: '2024-03-20', status: 'pending' },
    { id: 'CASE-002', proofUrl: '/proof2.pdf', entryDate: '2024-03-21', status: 'pending' },
    // Add more mock data as needed
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedCase, setSelectedCase] = useState<Approval | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const totalCases = approvals.length;
  const completedCases = approvals.filter(a => a.status !== 'pending').length;

  useEffect(() => {
    const newProgress = (completedCases / totalCases) * 100;
    setProgress(newProgress);
    
    if (newProgress >= 50 && newProgress < 51) triggerConfetti();
    if (newProgress >= 75 && newProgress < 76) triggerConfetti();
    if (newProgress === 100) triggerConfetti();
  }, [completedCases, totalCases]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAction = (approval: Approval, actionType: 'approve' | 'reject') => {
    setSelectedCase(approval);
    setAction(actionType);
  };

  const confirmAction = () => {
    if (!selectedCase || !action) return;
    
    setApprovals(prev => prev.map(a => 
      a.id === selectedCase.id 
        ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' }
        : a
    ));
    
    setSelectedCase(null);
    setAction(null);
  };

  const filteredApprovals = approvals.filter(a => 
    a.status === 'pending' && 
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">Aprovações Pendentes</h1>
        <p className="text-muted-foreground">Gerencie as notificações extrajudiciais que precisam de sua aprovação</p>
      </header>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Progresso das Aprovações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              🔔 Notificações pendentes: {completedCases} de {totalCases}
              <span className="ml-2">({Math.round(progress)}% concluído)</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código do caso..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código do Caso</TableHead>
                <TableHead>Visualizar Prova</TableHead>
                <TableHead>Data de Entrada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApprovals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell className="font-medium">{approval.id}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Ver Prova
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(approval.entryDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction(approval, 'approve')}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Aprovação</AlertDialogTitle>
                          <AlertDialogDescription>
                            Você está prestes a aprovar o caso {approval.id}. Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmAction}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2" onClick={() => handleAction(approval, 'reject')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Reprovação</AlertDialogTitle>
                          <AlertDialogDescription>
                            Você está prestes a reprovar o caso {approval.id}. Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmAction}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
