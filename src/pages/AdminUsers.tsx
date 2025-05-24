
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Edit2, Key, Power } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

const AdminUsers = () => {
  const [userType, setUserType] = useState('all');
  const [status, setStatus] = useState('all');
  const [department, setDepartment] = useState('all');
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    type: '',
    department: '',
    role: '',
    brands: [] as string[],
    company: '',
    password: '',
    sendEmail: true
  });

  // Mock data - replace with API calls
  const availableBrands = [
    { id: '1', name: 'Marca A' },
    { id: '2', name: 'Marca B' },
  ];

  const availableCompanies = [
    { id: '1', name: 'Empresa A' },
    { id: '2', name: 'Empresa B' },
  ];

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewUser({ ...newUser, password });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newUser.name) newErrors.name = 'Nome é obrigatório';
    if (!newUser.email) newErrors.email = 'E-mail é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!newUser.type) newErrors.type = 'Tipo de usuário é obrigatório';
    if (!newUser.password) newErrors.password = 'Senha é obrigatória';
    
    if (newUser.type === 'analyst') {
      if (!newUser.department) newErrors.department = 'Setor é obrigatório';
      if (!newUser.role) newErrors.role = 'Perfil de acesso é obrigatório';
      if (!newUser.brands?.length) newErrors.brands = 'Selecione pelo menos uma marca';
    }
    
    if (newUser.type === 'client') {
      if (!newUser.brands?.length) newErrors.brands = 'Selecione pelo menos uma marca';
      if (!newUser.company) newErrors.company = 'Empresa é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    try {
      // Replace with actual API call
      console.log('Creating user:', newUser);
      
      toast({
        title: "Usuário criado com sucesso",
        description: "O novo usuário foi adicionado ao sistema.",
      });
      
      closeDialog();
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const closeDialog = () => {
    setNewUser({
      name: '',
      email: '',
      type: '',
      department: '',
      role: '',
      brands: [],
      company: '',
      password: '',
      sendEmail: true
    });
    setErrors({});
  };

  const mockUsers = [
    {
      name: 'João Silva',
      email: 'joao@empresa.com',
      type: 'Analista',
      sector: 'IP Tools',
      status: 'Ativo',
      lastAccess: '20/05/2025'
    },
    {
      name: 'Maria Cliente',
      email: 'maria@cliente.com',
      type: 'Cliente',
      sector: 'Marca XYZ',
      status: 'Ativo',
      lastAccess: '19/05/2025'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">Gestão de Usuários</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateUser();
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Digite o nome completo"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="exemplo@empresa.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de usuário</Label>
                <Select value={newUser.type} onValueChange={(value) => setNewUser({ ...newUser, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analyst">Analista</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
              </div>

              {(newUser.type === 'analyst' || newUser.type === 'client') && (
                <div className="space-y-2">
                  <Label htmlFor="brands">Marcas vinculadas</Label>
                  <Select 
                    value={newUser.brands} 
                    onValueChange={(value) => setNewUser({ ...newUser, brands: Array.isArray(value) ? value : [value] })}
                    multiple
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as marcas" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Buscar marca..."
                          className="mb-2"
                          onChange={(e) => {
                            // Implement brand search filter
                            const searchTerm = e.target.value.toLowerCase();
                            // Filter availableBrands based on search
                          }}
                        />
                      </div>
                      {availableBrands
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(brand => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.brands && <p className="text-sm text-red-500">{errors.brands}</p>}
                </div>
              )}

              {newUser.type === 'analyst' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department">Setor</Label>
                    <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospection">Prospecção</SelectItem>
                        <SelectItem value="verification">Verificação</SelectItem>
                        <SelectItem value="ip_tools">IP Tools</SelectItem>
                        <SelectItem value="service">Atendimento</SelectItem>
                        <SelectItem value="financial">Financeiro</SelectItem>
                        <SelectItem value="admin">Administração</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Perfil de acesso</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="analyst">Analista</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                  </div>
                </>
              )}

              {newUser.type === 'client' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="brands">Marcas associadas</Label>
                    <Select value={newUser.brands} onValueChange={(value) => setNewUser({ ...newUser, brands: value })} multiple>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione as marcas" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBrands.map(brand => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.brands && <p className="text-sm text-red-500">{errors.brands}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Select value={newUser.company} onValueChange={(value) => setNewUser({ ...newUser, company: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCompanies.map(company => (
                          <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Senha temporária</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Digite a senha ou gere automaticamente"
                  />
                  <Button type="button" variant="outline" onClick={generatePassword}>
                    Gerar senha
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendEmail"
                  checked={newUser.sendEmail}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, sendEmail: checked as boolean })}
                />
                <Label htmlFor="sendEmail">Enviar convite por e-mail com instruções de acesso</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar usuário
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email"
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="analyst">Analista</SelectItem>
              <SelectItem value="client">Cliente</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="prospection">Prospecção</SelectItem>
              <SelectItem value="verification">Verificação</SelectItem>
              <SelectItem value="ip_tools">IP Tools</SelectItem>
              <SelectItem value="service">Atendimento</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Setor / Marca</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>{user.sector}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Ativo' ? 'success' : 'destructive'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastAccess}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        // TODO: Implement edit user
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nome completo</Label>
                          <Input
                            id="edit-name"
                            defaultValue={user.name}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-email">E-mail</Label>
                          <Input
                            id="edit-email"
                            value={user.email}
                            disabled
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-type">Tipo de usuário</Label>
                          <Select defaultValue={user.type}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="analyst">Analista</SelectItem>
                              <SelectItem value="client">Cliente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(user.type === 'analyst' || user.type === 'client') && (
                          <div className="space-y-2">
                            <Label htmlFor="edit-brands">Marcas vinculadas</Label>
                            <Select defaultValue={user.brands} multiple>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione as marcas" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    placeholder="Buscar marca..."
                                    className="mb-2"
                                    onChange={(e) => {
                                      // Implement brand search filter
                                      const searchTerm = e.target.value.toLowerCase();
                                      // Filter availableBrands based on search
                                    }}
                                  />
                                </div>
                                {availableBrands
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map(brand => (
                                    <SelectItem key={brand.id} value={brand.id}>
                                      {brand.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="edit-status">Status</Label>
                          <Select defaultValue={user.status}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {user.type === 'analyst' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="edit-department">Setor</Label>
                              <Select defaultValue={user.department}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o setor" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="prospection">Prospecção</SelectItem>
                                  <SelectItem value="verification">Verificação</SelectItem>
                                  <SelectItem value="ip_tools">IP Tools</SelectItem>
                                  <SelectItem value="service">Atendimento</SelectItem>
                                  <SelectItem value="financial">Financeiro</SelectItem>
                                  <SelectItem value="admin">Administração</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-role">Perfil de acesso</Label>
                              <Select defaultValue={user.role}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o perfil" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                  <SelectItem value="manager">Gerente</SelectItem>
                                  <SelectItem value="analyst">Analista</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {user.type === 'client' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="edit-brands">Marcas associadas</Label>
                              <Select defaultValue={user.brands} multiple>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione as marcas" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableBrands.map(brand => (
                                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-company">Empresa</Label>
                              <Select defaultValue={user.company}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableCompanies.map(company => (
                                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        <div className="flex justify-between items-center pt-4">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button type="button" variant="outline">
                                Redefinir senha
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Redefinir senha</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Isso irá gerar uma nova senha para o usuário. Deseja continuar?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                  // TODO: Implement password reset
                                  toast({
                                    title: "Senha redefinida",
                                    description: "Uma nova senha foi gerada e enviada por e-mail.",
                                  });
                                }}>
                                  Continuar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => {
                              // TODO: Implement cancel
                            }}>
                              Cancelar
                            </Button>
                            <Button type="submit">
                              Salvar alterações
                            </Button>
                          </div>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Key className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Redefinir Senha</AlertDialogTitle>
                        <AlertDialogDescription>
                          Defina uma nova senha para o usuário {user.name}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="generate-password"
                            checked={newUser.sendEmail}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                generatePassword();
                              }
                              setNewUser({ ...newUser, sendEmail: checked as boolean });
                            }}
                          />
                          <Label htmlFor="generate-password">Gerar senha aleatória segura</Label>
                        </div>

                        {!newUser.sendEmail ? (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">Nova senha</Label>
                              <Input
                                id="new-password"
                                type="password"
                                placeholder="Digite a nova senha"
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Confirmar senha</Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirme a nova senha"
                                onChange={(e) => {
                                  if (e.target.value !== newUser.password) {
                                    setErrors({ ...errors, confirmPassword: 'As senhas não coincidem' });
                                  } else {
                                    const { confirmPassword, ...restErrors } = errors;
                                    setErrors(restErrors);
                                  }
                                }}
                              />
                              {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <Label>Senha gerada</Label>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                value={newUser.password}
                                readOnly
                              />
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  navigator.clipboard.writeText(newUser.password);
                                  toast({
                                    title: "Senha copiada",
                                    description: "A senha foi copiada para a área de transferência"
                                  });
                                }}
                              >
                                Copiar
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="send-email"
                            checked={newUser.sendEmail}
                            onCheckedChange={(checked) => setNewUser({ ...newUser, sendEmail: checked as boolean })}
                          />
                          <Label htmlFor="send-email">Enviar nova senha por e-mail ao usuário</Label>
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                          if (!newUser.sendEmail && (!newUser.password || newUser.password.length < 8)) {
                            setErrors({ ...errors, password: 'A senha deve ter no mínimo 8 caracteres' });
                            return;
                          }
                          
                          try {
                            // TODO: Implement API call to update password
                            // await api.put(`/users/${user.id}/password`, {
                            //   password: newUser.password,
                            //   sendEmail: newUser.sendEmail
                            // });
                            
                            toast({
                              title: "Senha redefinida com sucesso",
                              description: newUser.sendEmail 
                                ? "A nova senha foi enviada para o e-mail do usuário"
                                : "A senha foi atualizada com sucesso"
                            });
                          } catch (error) {
                            toast({
                              title: "Erro ao redefinir senha",
                              description: "Ocorreu um erro ao tentar redefinir a senha",
                              variant: "destructive"
                            });
                          }
                        }}>
                          Redefinir Senha
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Power className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Desativar usuário</AlertDialogTitle>
                        <AlertDialogDescription>
                          Isso irá desativar o acesso do usuário ao sistema. Deseja continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                          // TODO: Implement user deactivation
                          toast({
                            title: "Usuário desativado",
                            description: "O usuário foi desativado com sucesso.",
                          });
                        }}>
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminUsers;
