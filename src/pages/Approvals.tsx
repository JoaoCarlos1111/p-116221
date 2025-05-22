
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, FileText, Search, X, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";

interface Approval {
  id: string;
  proofUrl: string;
  entryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  selected?: boolean;
}

interface Approval {
  id: string;
  proofUrl: string;
  entryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  selected?: boolean;
}

export default function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>([
    { id: 'CASE-001', proofUrl: '/proofs/nike1.pdf', entryDate: '2024-03-01', status: 'pending' },
    { id: 'CASE-002', proofUrl: '/proofs/adidas1.pdf', entryDate: '2024-03-02', status: 'pending' },
    { id: 'CASE-003', proofUrl: '/proofs/gucci1.pdf', entryDate: '2024-03-03', status: 'pending' },
    { id: 'CASE-004', proofUrl: '/proofs/prada1.pdf', entryDate: '2024-03-04', status: 'pending' },
    { id: 'CASE-005', proofUrl: '/proofs/lv1.pdf', entryDate: '2024-03-05', status: 'pending' },
    { id: 'CASE-006', proofUrl: '/proofs/nike2.pdf', entryDate: '2024-03-06', status: 'pending' },
    { id: 'CASE-007', proofUrl: '/proofs/adidas2.pdf', entryDate: '2024-03-07', status: 'pending' },
    { id: 'CASE-008', proofUrl: '/proofs/gucci2.pdf', entryDate: '2024-03-08', status: 'pending' },
    { id: 'CASE-009', proofUrl: '/proofs/prada2.pdf', entryDate: '2024-03-09', status: 'pending' },
    { id: 'CASE-010', proofUrl: '/proofs/lv2.pdf', entryDate: '2024-03-10', status: 'pending' },
    { id: 'CASE-011', proofUrl: '/proofs/nike3.pdf', entryDate: '2024-03-11', status: 'pending' },
    { id: 'CASE-012', proofUrl: '/proofs/adidas3.pdf', entryDate: '2024-03-12', status: 'pending' },
    { id: 'CASE-013', proofUrl: '/proofs/gucci3.pdf', entryDate: '2024-03-13', status: 'pending' },
    { id: 'CASE-014', proofUrl: '/proofs/prada3.pdf', entryDate: '2024-03-14', status: 'pending' },
    { id: 'CASE-015', proofUrl: '/proofs/lv3.pdf', entryDate: '2024-03-15', status: 'pending' },
    { id: 'CASE-016', proofUrl: '/proofs/nike4.pdf', entryDate: '2024-03-16', status: 'pending' },
    { id: 'CASE-017', proofUrl: '/proofs/adidas4.pdf', entryDate: '2024-03-17', status: 'pending' },
    { id: 'CASE-018', proofUrl: '/proofs/gucci4.pdf', entryDate: '2024-03-18', status: 'pending' },
    { id: 'CASE-019', proofUrl: '/proofs/prada4.pdf', entryDate: '2024-03-19', status: 'pending' },
    { id: 'CASE-020', proofUrl: '/proofs/lv4.pdf', entryDate: '2024-03-20', status: 'pending' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<Approval | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedCase, setSelectedCase] = useState<Approval | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [selectAll, setSelectAll] = useState(false);

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

  const handleBulkAction = (actionType: 'approve' | 'reject') => {
    setApprovals(prev => prev.map(approval => {
      if (approval.selected && approval.status === 'pending') {
        return { ...approval, status: actionType === 'approve' ? 'approved' : 'rejected', selected: false };
      }
      return approval;
    }));
    setSelectAll(false);
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

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setApprovals(prev => prev.map(a => ({
      ...a,
      selected: checked && a.status === 'pending'
    })));
  };

  const handleSelectCase = (id: string, checked: boolean) => {
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, selected: checked } : a
    ));
  };

  const filteredApprovals = approvals.filter(a => {
    const matchesSearch = a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesDate = new Date(a.entryDate) >= dateRange.from! && 
                       new Date(a.entryDate) <= dateRange.to!;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const selectedCount = approvals.filter(a => a.selected).length;

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

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código do caso..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 bg-muted p-2 rounded">
            <span>{selectedCount} casos selecionados</span>
            <Button variant="secondary" size="sm" onClick={() => handleBulkAction('approve')}>
              Aprovar Selecionados
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleBulkAction('reject')}>
              Rejeitar Selecionados
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Código do Caso</TableHead>
                <TableHead>Visualizar Prova</TableHead>
                <TableHead>Data de Entrada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApprovals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell>
                    <Checkbox 
                      checked={approval.selected}
                      onCheckedChange={(checked) => handleSelectCase(approval.id, checked as boolean)}
                      disabled={approval.status !== 'pending'}
                    />
                  </TableCell>
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
                  <TableCell>
                    <Badge variant={
                      approval.status === 'approved' ? 'success' :
                      approval.status === 'rejected' ? 'destructive' :
                      'default'
                    }>
                      {approval.status === 'approved' ? 'Aprovado' :
                       approval.status === 'rejected' ? 'Rejeitado' :
                       'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {approval.status === 'pending' && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
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
                              <AlertDialogAction onClick={() => handleAction(approval, 'approve')}>Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2">
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
                              <AlertDialogAction onClick={() => handleAction(approval, 'reject')}>Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
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
