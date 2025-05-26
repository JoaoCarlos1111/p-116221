import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageSquare, 
  AlertTriangle,
  Calendar,
  Building,
  User,
  FileText,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function GestorCasos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [analystFilter, setAnalystFilter] = useState('all');
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  // Dados mock - em produção virão da API
  const [cases] = useState([
    {
      id: 'NIKE-2024-001',
      code: 'NIKE-2024-001',
      brand: 'Nike',
      title: 'Produtos falsificados no Mercado Livre',
      status: 'Em análise',
      priority: 'Alta',
      analyst: 'João Silva',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-21T15:30:00Z',
      platform: 'Mercado Livre',
      value: 15000,
      commentsCount: 3,
      documentsCount: 5,
      infringement: 'Produto falsificado'
    },
    {
      id: 'ADIDAS-2024-045',
      code: 'ADIDAS-2024-045',
      brand: 'Adidas',
      title: 'Loja não autorizada no Instagram',
      status: 'Acordo fechado',
      priority: 'Média',
      analyst: 'Maria Santos',
      createdAt: '2024-01-19T14:00:00Z',
      updatedAt: '2024-01-20T09:15:00Z',
      platform: 'Instagram',
      value: 8500,
      commentsCount: 7,
      documentsCount: 3,
      infringement: 'Loja não autorizada'
    },
    {
      id: 'PUMA-2024-023',
      code: 'PUMA-2024-023',
      brand: 'Puma',
      title: 'Violação de marca no Facebook',
      status: 'Inadimplente',
      priority: 'Alta',
      analyst: 'Carlos Lima',
      createdAt: '2024-01-18T16:30:00Z',
      updatedAt: '2024-01-19T11:45:00Z',
      platform: 'Facebook',
      value: 12000,
      commentsCount: 2,
      documentsCount: 4,
      infringement: 'Violação de marca'
    },
    {
      id: 'LV-2024-089',
      code: 'LV-2024-089',
      brand: 'Louis Vuitton',
      title: 'Outlet falso no TikTok',
      status: 'Aguardando aprovação',
      priority: 'Média',
      analyst: 'Ana Costa',
      createdAt: '2024-01-17T09:00:00Z',
      updatedAt: '2024-01-18T13:20:00Z',
      platform: 'TikTok',
      value: 25000,
      commentsCount: 1,
      documentsCount: 6,
      infringement: 'Outlet não autorizado'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolvido':
      case 'Acordo fechado':
        return 'bg-green-100 text-green-800';
      case 'Em análise':
        return 'bg-blue-100 text-blue-800';
      case 'Inadimplente':
        return 'bg-red-100 text-red-800';
      case 'Aguardando aprovação':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Média':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Baixa':
        return <AlertTriangle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredCases = cases.filter(caso => {
    const matchesSearch = caso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caso.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caso.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caso.status === statusFilter;
    const matchesBrand = brandFilter === 'all' || caso.brand === brandFilter;
    const matchesPriority = priorityFilter === 'all' || caso.priority === priorityFilter;
    const matchesAnalyst = analystFilter === 'all' || caso.analyst === analystFilter;

    return matchesSearch && matchesStatus && matchesBrand && matchesPriority && matchesAnalyst;
  });

  const handleSelectCase = (caseId: string) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCases.length === filteredCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredCases.map(c => c.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Ação em massa: ${action} para casos:`, selectedCases);
    // Implementar ações em massa
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Casos</h1>
          <p className="text-muted-foreground">Visualização e controle de todos os casos da empresa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleBulkAction('export')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Selecionados
          </Button>
          <Button onClick={() => navigate('/cases/new')}>
            <FileText className="h-4 w-4 mr-2" />
            Novo Caso
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar casos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Em análise">Em análise</SelectItem>
                <SelectItem value="Aguardando aprovação">Aguardando aprovação</SelectItem>
                <SelectItem value="Acordo fechado">Acordo fechado</SelectItem>
                <SelectItem value="Inadimplente">Inadimplente</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as marcas</SelectItem>
                <SelectItem value="Nike">Nike</SelectItem>
                <SelectItem value="Adidas">Adidas</SelectItem>
                <SelectItem value="Puma">Puma</SelectItem>
                <SelectItem value="Louis Vuitton">Louis Vuitton</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={analystFilter} onValueChange={setAnalystFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Analista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os analistas</SelectItem>
                <SelectItem value="João Silva">João Silva</SelectItem>
                <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                <SelectItem value="Carlos Lima">Carlos Lima</SelectItem>
                <SelectItem value="Ana Costa">Ana Costa</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setBrandFilter('all');
              setPriorityFilter('all');
              setAnalystFilter('all');
            }}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCases.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCases.length} caso(s) selecionado(s)
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('priority')}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Marcar como Urgente
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('download')}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Provas
                </Button>
                <Button size="sm" onClick={() => handleBulkAction('export')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Casos ({filteredCases.length})</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total de casos encontrados: {filteredCases.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Analista</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((caso) => (
                <TableRow key={caso.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedCases.includes(caso.id)}
                      onCheckedChange={() => handleSelectCase(caso.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{caso.code}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{caso.brand}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(caso.status)}>
                      {caso.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(caso.priority)}
                      <span className="text-sm">{caso.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{caso.analyst}</span>
                    </div>
                  </TableCell>
                  <TableCell>{caso.platform}</TableCell>
                  <TableCell>R$ {caso.value.toLocaleString()}</TableCell>
                  <TableCell>
                    {format(new Date(caso.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/client/casos/${caso.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs">{caso.commentsCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs">{caso.documentsCount}</span>
                      </div>
                    </div>
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