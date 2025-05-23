
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, CheckCircle, FileText, Search, X, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Approval {
  id: string;
  proofUrl: string;
  entryDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showConfettiAt, setShowConfettiAt] = useState<number[]>([50, 75, 100]);
  const [dialogCase, setDialogCase] = useState<{id: string, action: 'approve' | 'reject'} | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    console.log("Casos de aprovação:", approvals);
  }, [approvals]);

  const totalCases = approvals.length;
  const processedCases = approvals.filter(a => a.status !== 'pending').length;
  const progress = totalCases ? (processedCases / totalCases) * 100 : 0;

  useEffect(() => {
    if (showConfettiAt.includes(Math.round(progress))) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setShowConfettiAt(prev => prev.filter(p => p !== Math.round(progress)));
    }
  }, [progress]);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setDialogCase({ id, action });
  };

  const confirmAction = () => {
    if (!dialogCase) return;
    
    setApprovals(prev => prev.map(approval => 
      approval.id === dialogCase.id 
        ? { ...approval, status: dialogCase.action === 'approve' ? 'approved' : 'rejected' }
        : approval
    ));
    
    setDialogCase(null);
  };

  const handleBulkApprove = () => {
    setApprovals(prev => prev.map(approval => 
      approval.status === 'pending' ? { ...approval, status: 'approved' } : approval
    ));
  };

  const filteredApprovals = approvals
    .filter(approval => 
      approval.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedDate || format(new Date(approval.entryDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
    )
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalPages = Math.ceil(approvals.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso das Aprovações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Notificações pendentes: {processedCases} de {totalCases}</span>
                <span className="font-bold">{Math.round(progress)}% concluído</span>
              </div>
              <Progress value={progress} className="h-2" />
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription>
                  Média de tempo por aprovação: 2.5 minutos
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código do caso..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP', { locale: ptBR }) : <span>Filtrar por data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={handleBulkApprove}>Aprovar Todos</Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Casos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código do Caso</TableHead>
                  <TableHead>Prova</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>{approval.id}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Visualizar PDF
                      </Button>
                    </TableCell>
                    <TableCell>
                      {format(new Date(approval.entryDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAction(approval.id, 'approve')}
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAction(approval.id, 'reject')}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!dialogCase} onOpenChange={() => setDialogCase(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogCase?.action === 'approve' ? 'Aprovar' : 'Reprovar'} caso
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {dialogCase?.action === 'approve' ? 'aprovar' : 'reprovar'} o caso {dialogCase?.id}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
