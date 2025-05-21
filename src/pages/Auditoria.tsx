import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, CalendarIcon, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function Auditoria() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Mock data - replace with actual API data
  const cases = [
    {
      id: '123',
      receivedDate: '2024-03-21',
      analyst: 'João Silva',
      brand: 'Nike',
      status: 'Pendente',
      daysInAudit: 3
    },
    {
      id: '124',
      receivedDate: '2024-03-20',
      analyst: 'Maria Santos',
      brand: 'Adidas',
      status: 'Aprovado',
      daysInAudit: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pendente': 'warning',
      'Aprovado': 'success',
      'Rejeitado': 'destructive'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const pendingCount = cases.filter(c => c.status === 'Pendente').length;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Casos para Auditoria</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {pendingCount} casos pendentes de auditoria
          </p>
        </div>
      </header>

      <Card className="glass-card">
        <CardContent className="p-8">
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, marca ou analista..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nike">Nike</SelectItem>
                <SelectItem value="adidas">Adidas</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd/MM/yyyy') : 'Data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Número do Caso</TableHead>
                  <TableHead>Data de Recebimento</TableHead>
                  <TableHead>Analista de Verificação</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dias em Auditoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caso) => (
                  <TableRow 
                    key={caso.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/auditoria/caso/${caso.id}`, { replace: false })}
                  >
                    <TableCell>#{caso.id}</TableCell>
                    <TableCell>{format(new Date(caso.receivedDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{caso.analyst}</TableCell>
                    <TableCell>{caso.brand}</TableCell>
                    <TableCell>{getStatusBadge(caso.status)}</TableCell>
                    <TableCell>
                      {caso.daysInAudit > 5 ? (
                        <Badge variant="destructive">{caso.daysInAudit} dias</Badge>
                      ) : (
                        <span>{caso.daysInAudit} dias</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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