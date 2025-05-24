
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - replace with API calls
  const availableBrands = [
    { id: '1', name: 'Marca A' },
    { id: '2', name: 'Marca B' },
  ];

  const availableCompanies = [
    { id: '1', name: 'Empresa A' },
    { id: '2', name: 'Empresa B' },
  ];

  // Mock user data - replace with API call
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao@empresa.com',
    type: 'analyst',
    department: 'ip_tools',
    role: 'analyst',
    status: 'active',
    brands: [],
    company: '',
  });

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save user
      toast({
        title: "Alterações salvas",
        description: "As alterações foram salvas com sucesso.",
      });
      navigate('/admin/users');
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">Detalhes do Usuário</h1>
        <Button variant="outline" onClick={() => navigate('/admin/users')}>
          Voltar
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              value={user.email}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de usuário</Label>
            <Select value={user.type} onValueChange={(value) => setUser({ ...user, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analyst">Analista</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={user.status} onValueChange={(value) => setUser({ ...user, status: value })}>
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
                <Label htmlFor="department">Setor</Label>
                <Select value={user.department} onValueChange={(value) => setUser({ ...user, department: value })}>
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
                <Label htmlFor="role">Perfil de acesso</Label>
                <Select value={user.role} onValueChange={(value) => setUser({ ...user, role: value })}>
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
                <Label htmlFor="brands">Marcas associadas</Label>
                <Select value={user.brands} onValueChange={(value) => setUser({ ...user, brands: value })} multiple>
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
                <Label htmlFor="company">Empresa</Label>
                <Select value={user.company} onValueChange={(value) => setUser({ ...user, company: value })}>
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
              <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar alterações
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
