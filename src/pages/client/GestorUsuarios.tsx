
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Key, 
  Search,
  Users,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GestorUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    profile: '',
    permissions: {
      dashboard: false,
      cases: false,
      approvals: false,
      financial: false,
      reports: false,
      users: false
    },
    brands: [] as string[]
  });

  // Dados mock - em produção virão da API
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      phone: '(11) 99999-1111',
      profile: 'analista_contrafacao',
      isActive: true,
      lastLogin: '2024-01-20T10:30:00Z',
      createdAt: '2024-01-10T00:00:00Z',
      brands: ['Nike', 'Adidas'],
      permissions: {
        dashboard: true,
        cases: true,
        approvals: true,
        financial: false,
        reports: true,
        users: false
      }
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      phone: '(11) 99999-2222',
      profile: 'financeiro',
      isActive: true,
      lastLogin: '2024-01-19T15:45:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      brands: ['Nike', 'Adidas', 'Puma'],
      permissions: {
        dashboard: true,
        cases: false,
        approvals: false,
        financial: true,
        reports: true,
        users: false
      }
    },
    {
      id: '3',
      name: 'Carlos Lima',
      email: 'carlos.lima@empresa.com',
      phone: '(11) 99999-3333',
      profile: 'analista_contrafacao',
      isActive: false,
      lastLogin: '2024-01-15T09:20:00Z',
      createdAt: '2023-12-20T00:00:00Z',
      brands: ['Puma', 'Louis Vuitton'],
      permissions: {
        dashboard: true,
        cases: true,
        approvals: true,
        financial: false,
        reports: false,
        users: false
      }
    }
  ]);

  const profileLabels = {
    gestor: 'Gestor',
    analista_contrafacao: 'Analista de Contrafação',
    financeiro: 'Financeiro',
    readonly: 'Visualização'
  };

  const getProfileColor = (profile: string) => {
    switch (profile) {
      case 'gestor': return 'bg-purple-100 text-purple-800';
      case 'analista_contrafacao': return 'bg-blue-100 text-blue-800';
      case 'financeiro': return 'bg-green-100 text-green-800';
      case 'readonly': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    const user = {
      id: String(users.length + 1),
      ...newUser,
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      profile: '',
      permissions: {
        dashboard: false,
        cases: false,
        approvals: false,
        financial: false,
        reports: false,
        users: false
      },
      brands: []
    });
    setIsCreating(false);
  };

  const handleToggleUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleResetPassword = (userId: string) => {
    console.log('Reset password for user:', userId);
    // Implementar reset de senha
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Criar e gerenciar usuários da empresa</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="usuario@empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Perfil de acesso</Label>
                  <Select value={newUser.profile} onValueChange={(value) => setNewUser({ ...newUser, profile: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analista_contrafacao">Analista de Contrafação</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="readonly">Apenas Visualização</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Permissões</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dashboard"
                      checked={newUser.permissions.dashboard}
                      onCheckedChange={(checked) => 
                        setNewUser({
                          ...newUser,
                          permissions: { ...newUser.permissions, dashboard: checked }
                        })
                      }
                    />
                    <Label htmlFor="dashboard">Acessar Dashboard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cases"
                      checked={newUser.permissions.cases}
                      onCheckedChange={(checked) => 
                        setNewUser({
                          ...newUser,
                          permissions: { ...newUser.permissions, cases: checked }
                        })
                      }
                    />
                    <Label htmlFor="cases">Gerenciar Casos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="approvals"
                      checked={newUser.permissions.approvals}
                      onCheckedChange={(checked) => 
                        setNewUser({
                          ...newUser,
                          permissions: { ...newUser.permissions, approvals: checked }
                        })
                      }
                    />
                    <Label htmlFor="approvals">Aprovar Notificações</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="financial"
                      checked={newUser.permissions.financial}
                      onCheckedChange={(checked) => 
                        setNewUser({
                          ...newUser,
                          permissions: { ...newUser.permissions, financial: checked }
                        })
                      }
                    />
                    <Label htmlFor="financial">Acesso Financeiro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reports"
                      checked={newUser.permissions.reports}
                      onCheckedChange={(checked) => 
                        setNewUser({
                          ...newUser,
                          permissions: { ...newUser.permissions, reports: checked }
                        })
                      }
                    />
                    <Label htmlFor="reports">Gerar Relatórios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="users"
                      checked={newUser.permissions.users}
                      onCheckedChange={(checked) => 
                        setNewUser({
                          ...newUser,
                          permissions: { ...newUser.permissions, users: checked }
                        })
                      }
                    />
                    <Label htmlFor="users">Gerenciar Usuários</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Marcas vinculadas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Nike', 'Adidas', 'Puma', 'Louis Vuitton'].map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Switch
                        id={brand}
                        checked={newUser.brands.includes(brand)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewUser({ ...newUser, brands: [...newUser.brands, brand] });
                          } else {
                            setNewUser({ ...newUser, brands: newUser.brands.filter(b => b !== brand) });
                          }
                        }}
                      />
                      <Label htmlFor={brand}>{brand}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateUser} className="w-full">
                Criar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-xl font-bold">{users.filter(u => u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Marcas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getProfileColor(user.profile)}>
                      {profileLabels[user.profile as keyof typeof profileLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.brands.map((brand) => (
                        <Badge key={brand} variant="outline" className="text-xs">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-600" />
                      )}
                      <span className={cn(
                        "text-sm",
                        user.isActive ? "text-green-600" : "text-red-600"
                      )}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleUser(user.id)}
                      >
                        {user.isActive ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
