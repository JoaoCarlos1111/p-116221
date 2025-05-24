
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, CalendarIcon, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  department: string;
  actionType: 'create' | 'edit' | 'delete' | 'view' | 'login';
  description: string;
  target?: string;
  details?: {
    before?: string;
    after?: string;
    userAgent?: string;
    ip?: string;
  };
}

export default function Audit() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  // Mock data - replace with API call
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-03-25 14:30:00',
      userId: 'USR001',
      userName: 'João Silva',
      department: 'Verificação',
      actionType: 'create',
      description: 'Criou novo caso de verificação',
      target: 'CASO-001',
      details: {
        userAgent: 'Chrome/Windows',
        ip: '192.168.1.1'
      }
    },
    {
      id: '2',
      timestamp: '2024-03-25 14:35:00',
      userId: 'USR002',
      userName: 'Maria Santos',
      department: 'Financeiro',
      actionType: 'edit',
      description: 'Atualizou status de pagamento',
      target: 'PAG-001',
      details: {
        before: 'Pendente',
        after: 'Pago',
        userAgent: 'Firefox/Mac',
        ip: '192.168.1.2'
      }
    }
  ];

  const getActionBadge = (actionType: string) => {
    const variants = {
      'create': 'success',
      'edit': 'warning',
      'delete': 'destructive',
      'view': 'secondary',
      'login': 'outline'
    } as const;
    
    return <Badge variant={variants[actionType as keyof typeof variants]}>{actionType}</Badge>;
  };

  const handleExport = () => {
    // Implement CSV export logic
    console.log('Exporting logs...');
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Auditoria e Histórico</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e analise todas as ações realizadas no sistema
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </header>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário, marca ou número do caso..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[300px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                        {format(dateRange.to, 'dd/MM/yyyy')}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yyyy')
                    )
                  ) : (
                    'Selecione o período'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={dateRange}
                  onSelect={(range: any) => setDateRange(range)}
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usr001">João Silva</SelectItem>
                <SelectItem value="usr002">Maria Santos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verificacao">Verificação</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Caso</TableHead>
                  <TableHead className="text-right">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow 
                    key={log.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      // Navigate to case details when implemented
                      console.log('Viewing case details:', log);
                    }}
                  >
                    <TableCell>{format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>
                      {log.userName}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({log.userId})
                      </span>
                    </TableCell>
                    <TableCell>{log.department}</TableCell>
                    <TableCell>{getActionBadge(log.actionType)}</TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes da Ação</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {log.details?.before && (
                              <div>
                                <p className="text-sm font-medium">Valor Anterior</p>
                                <p className="text-sm text-muted-foreground">{log.details.before}</p>
                              </div>
                            )}
                            {log.details?.after && (
                              <div>
                                <p className="text-sm font-medium">Novo Valor</p>
                                <p className="text-sm text-muted-foreground">{log.details.after}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">Informações Técnicas</p>
                              <p className="text-sm text-muted-foreground">
                                IP: {log.details?.ip}<br />
                                Navegador: {log.details?.userAgent}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
