import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, CheckCircle, FileText, Search, AlertTriangle, X, XCircle, Clock, Upload, MessageSquare, History, Flag, Eye, Download, Send } from 'lucide-react';
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';

interface Approval {
  id: string;
  proofUrl: string;
  entryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  title?: string;
  description?: string;
  platform?: string;
  brand?: string;
  rejectionReason?: string;
  clientPriority?: 'normal' | 'priority';
}

export default function Approvals() {
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [showInternalEvaluationDialog, setShowInternalEvaluationDialog] = useState(false);
  const [internalEvaluationReason, setInternalEvaluationReason] = useState('');
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [selectedCaseForDetails, setSelectedCaseForDetails] = useState<Approval | null>(null);
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{[key: string]: Array<{id: string, author: string, content: string, timestamp: string}>}>({});
  
  const [approvals, setApprovals] = useState<Approval[]>([
    { id: 'APROV-001', proofUrl: '/proofs/nike_store.pdf', entryDate: '2024-03-21', status: 'pending', title: 'Nike Store BR', description: 'Loja não autorizada vendendo produtos Nike', platform: 'Shopee', brand: 'Nike', clientPriority: 'priority' },
    { id: 'APROV-002', proofUrl: '/proofs/adidas_outlet.pdf', entryDate: '2024-03-21', status: 'pending', title: 'Adidas Outlet', description: 'Produtos falsificados Adidas', platform: 'Mercado Livre', brand: 'Adidas', clientPriority: 'normal' },
    { id: 'APROV-003', proofUrl: '/proofs/lv_bags.pdf', entryDate: '2024-03-21', status: 'pending', title: 'LV Bags Store', description: 'Bolsas Louis Vuitton falsificadas', platform: 'Instagram', brand: 'Louis Vuitton', clientPriority: 'priority' },
    { id: 'APROV-004', proofUrl: '/proofs/gucci_shoes.pdf', entryDate: '2024-03-21', status: 'pending', title: 'Gucci Shoes BR', description: 'Calçados Gucci não autorizados', platform: 'Facebook', brand: 'Gucci', clientPriority: 'normal' },
    { id: 'APROV-005', proofUrl: '/proofs/prada_store.pdf', entryDate: '2024-03-21', status: 'pending', title: 'Prada Store', description: 'Produtos Prada falsificados', platform: 'TikTok', brand: 'Prada', clientPriority: 'priority' },
    { id: 'APROV-006', proofUrl: '/proofs/nike_outlet.pdf', entryDate: '2024-03-20', status: 'pending', title: 'Nike Outlet BR', description: 'Outlet não autorizado Nike', platform: 'Facebook', brand: 'Nike', clientPriority: 'normal' },
    { id: 'APROV-007', proofUrl: '/proofs/adidas_store.pdf', entryDate: '2024-03-20', status: 'pending', title: 'Adidas Store', description: 'Loja não autorizada Adidas', platform: 'Instagram', brand: 'Adidas', clientPriority: 'priority' },
    { id: 'APROV-008', proofUrl: '/proofs/lv_accessories.pdf', entryDate: '2024-03-20', status: 'pending', title: 'LV Accessories', description: 'Acessórios LV falsificados', platform: 'Shopee', brand: 'Louis Vuitton', clientPriority: 'normal' },
    { id: 'APROV-009', proofUrl: '/proofs/gucci_bags.pdf', entryDate: '2024-03-20', status: 'pending', title: 'Gucci Bags', description: 'Bolsas Gucci falsificadas', platform: 'Mercado Livre', brand: 'Gucci', clientPriority: 'priority' },
    { id: 'APROV-010', proofUrl: '/proofs/prada_outlet.pdf', entryDate: '2024-03-20', status: 'pending', title: 'Prada Outlet', description: 'Outlet falso Prada', platform: 'TikTok', brand: 'Prada', clientPriority: 'normal' },
    { id: 'APROV-011', proofUrl: '/proofs/nike_shoes.pdf', entryDate: '2024-03-19', status: 'pending', title: 'Nike Shoes BR', description: 'Tênis Nike falsificados', platform: 'Shopee', brand: 'Nike', clientPriority: 'normal' },
    { id: 'APROV-012', proofUrl: '/proofs/adidas_shoes.pdf', entryDate: '2024-03-19', status: 'pending', title: 'Adidas Shoes', description: 'Tênis Adidas não autorizados', platform: 'Facebook', brand: 'Adidas', clientPriority: 'priority' },
    { id: 'APROV-013', proofUrl: '/proofs/lv_store.pdf', entryDate: '2024-03-19', status: 'pending', title: 'LV Store BR', description: 'Loja não autorizada LV', platform: 'Instagram', brand: 'Louis Vuitton', clientPriority: 'normal' },
    { id: 'APROV-014', proofUrl: '/proofs/gucci_outlet.pdf', entryDate: '2024-03-19', status: 'pending', title: 'Gucci Outlet', description: 'Outlet falso Gucci', platform: 'Mercado Livre', brand: 'Gucci', clientPriority: 'normal' },
    { id: 'APROV-015', proofUrl: '/proofs/prada_bags.pdf', entryDate: '2024-03-19', status: 'pending', title: 'Prada Bags', description: 'Bolsas Prada falsificadas', platform: 'TikTok', brand: 'Prada', clientPriority: 'priority' },
    { id: 'APROV-016', proofUrl: '/proofs/nike_accessories.pdf', entryDate: '2024-03-18', status: 'pending', title: 'Nike Accessories', description: 'Acessórios Nike falsificados', platform: 'Instagram', brand: 'Nike', clientPriority: 'normal' },
    { id: 'APROV-017', proofUrl: '/proofs/adidas_bags.pdf', entryDate: '2024-03-18', status: 'pending', title: 'Adidas Bags', description: 'Bolsas Adidas não autorizadas', platform: 'Shopee', brand: 'Adidas', clientPriority: 'normal' },
    { id: 'APROV-018', proofUrl: '/proofs/lv_shoes.pdf', entryDate: '2024-03-18', status: 'pending', title: 'LV Shoes BR', description: 'Calçados LV falsificados', platform: 'Facebook', brand: 'Louis Vuitton', clientPriority: 'priority' },
    { id: 'APROV-019', proofUrl: '/proofs/gucci_store.pdf', entryDate: '2024-03-18', status: 'pending', title: 'Gucci Store BR', description: 'Loja não autorizada Gucci', platform: 'TikTok', brand: 'Gucci', clientPriority: 'normal' },
    { id: 'APROV-020', proofUrl: '/proofs/prada_shoes.pdf', entryDate: '2024-03-18', status: 'pending', title: 'Prada Shoes', description: 'Calçados Prada não autorizados', platform: 'Mercado Livre', brand: 'Prada', clientPriority: 'normal' },
    { id: 'APROV-021', proofUrl: '/proofs/nike_clothing.pdf', entryDate: '2024-03-17', status: 'pending', title: 'Nike Clothing', description: 'Roupas Nike falsificadas', platform: 'TikTok', brand: 'Nike', clientPriority: 'priority' },
    { id: 'APROV-022', proofUrl: '/proofs/adidas_accessories.pdf', entryDate: '2024-03-17', status: 'pending', title: 'Adidas Accessories', description: 'Acessórios Adidas falsificados', platform: 'Mercado Livre', brand: 'Adidas', clientPriority: 'normal' },
    { id: 'APROV-023', proofUrl: '/proofs/lv_outlet.pdf', entryDate: '2024-03-17', status: 'pending', title: 'LV Outlet BR', description: 'Outlet não autorizado LV', platform: 'Shopee', brand: 'Louis Vuitton', clientPriority: 'normal' },
    { id: 'APROV-024', proofUrl: '/proofs/gucci_clothing.pdf', entryDate: '2024-03-17', status: 'pending', title: 'Gucci Clothing', description: 'Roupas Gucci falsificadas', platform: 'Instagram', brand: 'Gucci', clientPriority: 'priority' },
    { id: 'APROV-025', proofUrl: '/proofs/prada_accessories.pdf', entryDate: '2024-03-17', status: 'pending', title: 'Prada Accessories', description: 'Acessórios Prada não autorizados', platform: 'Facebook', brand: 'Prada', clientPriority: 'normal' },
    { id: 'APROV-026', proofUrl: '/proofs/nike_bags.pdf', entryDate: '2024-03-16', status: 'pending', title: 'Nike Bags BR', description: 'Bolsas Nike falsificadas', platform: 'Mercado Livre', brand: 'Nike', clientPriority: 'normal' },
    { id: 'APROV-027', proofUrl: '/proofs/adidas_clothing.pdf', entryDate: '2024-03-16', status: 'pending', title: 'Adidas Clothing', description: 'Roupas Adidas não autorizadas', platform: 'TikTok', brand: 'Adidas', clientPriority: 'normal' },
    { id: 'APROV-028', proofUrl: '/proofs/lv_clothing.pdf', entryDate: '2024-03-16', status: 'pending', title: 'LV Clothing BR', description: 'Roupas LV falsificadas', platform: 'Facebook', brand: 'Louis Vuitton', clientPriority: 'priority' },
    { id: 'APROV-029', proofUrl: '/proofs/gucci_accessories.pdf', entryDate: '2024-03-16', status: 'pending', title: 'Gucci Accessories', description: 'Acessórios Gucci não autorizados', platform: 'Shopee', brand: 'Gucci', clientPriority: 'normal' },
    { id: 'APROV-030', proofUrl: '/proofs/prada_clothing.pdf', entryDate: '2024-03-16', status: 'pending', title: 'Prada Clothing', description: 'Roupas Prada falsificadas', platform: 'Instagram', brand: 'Prada', clientPriority: 'normal' }
  ]);
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

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === id ? { ...approval, status: 'approved' } : approval
    ));
  };

  const handleReject = (id: string) => {
    setRejectingId(id);
    setShowRejectDialog(true);
  };

  const toggleClientPriority = (id: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === id 
        ? { 
            ...approval, 
            clientPriority: approval.clientPriority === 'priority' ? 'normal' : 'priority' 
          }
        : approval
    ));
  };

  const confirmReject = () => {
    if (!rejectingId || !rejectReason) return;

    setApprovals(prev => prev.map(approval => 
      approval.id === rejectingId 
        ? { ...approval, status: 'rejected', rejectionReason: rejectReason }
        : approval
    ));

    setShowRejectDialog(false);
    setRejectingId(null);
    setRejectReason('');
  };

  const handleInternalEvaluation = (id: string) => {
    setEvaluatingId(id);
    setShowInternalEvaluationDialog(true);
  };

  const confirmInternalEvaluation = () => {
    if (!evaluatingId || !internalEvaluationReason) return;

    // Aqui você pode adicionar a lógica para marcar o caso como "em avaliação interna"
    // Por exemplo, adicionar um novo status ou campo no objeto approval
    console.log(`Caso ${evaluatingId} enviado para avaliação interna: ${internalEvaluationReason}`);

    setShowInternalEvaluationDialog(false);
    setEvaluatingId(null);
    setInternalEvaluationReason('');
  };

  const handleBulkApprove = () => {
    setApprovals(prev => prev.map(approval => 
      selectedCases.includes(approval.id) ? { ...approval, status: 'approved' } : approval
    ));
    setSelectedCases([]);
  };

  const handleRowClick = (approval: Approval) => {
    setSelectedCaseForDetails(approval);
    setShowCaseDetails(true);
  };

  const handleAddComment = () => {
    if (!selectedCaseForDetails || !newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      author: 'João Silva',
      content: newComment,
      timestamp: new Date().toLocaleString('pt-BR')
    };

    setComments(prev => ({
      ...prev,
      [selectedCaseForDetails.id]: [...(prev[selectedCaseForDetails.id] || []), comment]
    }));
    
    setNewComment('');
  };

  const handleToggleUrgency = () => {
    if (!selectedCaseForDetails) return;
    
    setApprovals(prev => prev.map(approval => 
      approval.id === selectedCaseForDetails.id 
        ? { ...approval, clientPriority: approval.clientPriority === 'priority' ? 'normal' : 'priority' }
        : approval
    ));
    
    setSelectedCaseForDetails(prev => prev ? {
      ...prev,
      clientPriority: prev.clientPriority === 'priority' ? 'normal' : 'priority'
    } : null);
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
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedCases.length === filteredApprovals.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCases(filteredApprovals.map(a => a.id));
                        } else {
                          setSelectedCases([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Código do Caso</TableHead>
                  <TableHead>Certificação do Anúncio</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead className="text-center">Prioritário</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.map((approval) => (
                  <TableRow 
                    key={approval.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(approval)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedCases.includes(approval.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCases([...selectedCases, approval.id]);
                          } else {
                            setSelectedCases(selectedCases.filter(id => id !== approval.id));
                          }
                        }}
                      />
                    </TableCell>
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
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleClientPriority(approval.id)}
                        className={cn(
                          "h-8 w-8 p-0",
                          approval.clientPriority === 'priority' 
                            ? "text-black hover:text-black" 
                            : "text-gray-300 hover:text-red-400"
                        )}
                      >
                        <AlertTriangle 
                          className={cn(
                            "h-4 w-4",
                            approval.clientPriority === 'priority' ? "fill-red-500 stroke-black" : ""
                          )}
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(approval.id);
                          }}
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInternalEvaluation(approval.id);
                          }}
                          className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(approval.id);
                          }}
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

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da Rejeição</DialogTitle>
            <DialogDescription>
              Por favor, informe o motivo da rejeição para ajudar a otimizar análises futuras.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Descreva o motivo da rejeição..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmReject} disabled={!rejectReason}>
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInternalEvaluationDialog} onOpenChange={setShowInternalEvaluationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar para Avaliação Interna</DialogTitle>
            <DialogDescription>
              Nos ajude a evoluir nosso modelo algorítmico! Compartilhe informações que podem melhorar a análise automática para casos similares.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="evaluation-reason">Informações para evolução do modelo</Label>
              <Textarea
                id="evaluation-reason"
                value={internalEvaluationReason}
                onChange={(e) => setInternalEvaluationReason(e.target.value)}
                placeholder="Compartilhe detalhes que podem ajudar a melhorar nossa análise automática..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInternalEvaluationDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmInternalEvaluation} disabled={!internalEvaluationReason}>
              Enviar para Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drawer de Detalhes do Caso */}
      <Sheet open={showCaseDetails} onOpenChange={setShowCaseDetails}>
        <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
          {selectedCaseForDetails && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Caso {selectedCaseForDetails.id}
                </SheetTitle>
                <SheetDescription>
                  Detalhes completos do caso de contrafação
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                <Tabs defaultValue="resumo" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="resumo">Resumo</TabsTrigger>
                    <TabsTrigger value="provas">Provas</TabsTrigger>
                    <TabsTrigger value="comentarios">Comentários</TabsTrigger>
                    <TabsTrigger value="historico">Histórico</TabsTrigger>
                  </TabsList>

                  <TabsContent value="resumo" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informações Gerais</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Marca</Label>
                            <p className="text-sm font-semibold">{selectedCaseForDetails.brand}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Plataforma</Label>
                            <p className="text-sm">{selectedCaseForDetails.platform}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Status</Label>
                            <Badge variant={selectedCaseForDetails.status === 'pending' ? 'secondary' : selectedCaseForDetails.status === 'approved' ? 'default' : 'destructive'}>
                              {selectedCaseForDetails.status === 'pending' ? 'Pendente' : selectedCaseForDetails.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Prioridade</Label>
                            <Badge variant={selectedCaseForDetails.clientPriority === 'priority' ? 'destructive' : 'secondary'}>
                              {selectedCaseForDetails.clientPriority === 'priority' ? 'Urgente' : 'Normal'}
                            </Badge>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Título</Label>
                          <p className="text-sm">{selectedCaseForDetails.title}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Descrição</Label>
                          <p className="text-sm text-gray-700">{selectedCaseForDetails.description}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Data de Entrada</Label>
                          <p className="text-sm">{format(new Date(selectedCaseForDetails.entryDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={handleToggleUrgency}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          {selectedCaseForDetails.clientPriority === 'priority' ? 'Remover Urgência' : 'Marcar como Urgente'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-green-600 hover:text-green-700"
                          onClick={() => {
                            handleApprove(selectedCaseForDetails.id);
                            setShowCaseDetails(false);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprovar Caso
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={() => {
                            setShowCaseDetails(false);
                            handleReject(selectedCaseForDetails.id);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejeitar Caso
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="provas" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Evidências e Documentos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Arraste arquivos aqui ou clique para fazer upload</p>
                          <Button variant="outline" size="sm">
                            Selecionar Arquivos
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Arquivos Existentes</Label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">Certificação do Anúncio.pdf</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">Print da Página.jpg</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="comentarios" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Comentários Internos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {(comments[selectedCaseForDetails.id] || []).map((comment) => (
                            <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{comment.author}</span>
                                <span className="text-xs text-gray-500">{comment.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                          
                          {(!comments[selectedCaseForDetails.id] || comments[selectedCaseForDetails.id].length === 0) && (
                            <p className="text-sm text-gray-500 text-center py-4">Nenhum comentário ainda</p>
                          )}
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-comment">Adicionar Comentário</Label>
                          <Textarea
                            id="new-comment"
                            placeholder="Digite seu comentário..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button onClick={handleAddComment} disabled={!newComment.trim()} className="w-full">
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Comentário
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="historico" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Histórico do Caso</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Caso criado</p>
                              <p className="text-xs text-gray-500">{format(new Date(selectedCaseForDetails.entryDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                              <p className="text-xs text-gray-600">Sistema automatizado</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Enviado para análise</p>
                              <p className="text-xs text-gray-500">{format(new Date(selectedCaseForDetails.entryDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                              <p className="text-xs text-gray-600">Sistema automatizado</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Em análise</p>
                              <p className="text-xs text-gray-500">Agora</p>
                              <p className="text-xs text-gray-600">João Silva - Analista</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}