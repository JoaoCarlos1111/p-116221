
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UserPlus, ChevronDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const AdminPermissions = () => {
  const { toast } = useToast();
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [newProfile, setNewProfile] = useState({
    name: '',
    permissions: [] as string[]
  });

  // Mock data - Replace with API calls
  const profiles = [
    { id: '1', name: 'Administrador', userCount: 4 },
    { id: '2', name: 'Analista de Prospecção', userCount: 6 },
    { id: '3', name: 'Cliente', userCount: 12 },
  ];

  const permissionGroups = [
    {
      name: 'Dashboard',
      permissions: [
        'view_dashboard',
        'edit_dashboard',
      ]
    },
    {
      name: 'Prospecção',
      permissions: [
        'view_prospection',
        'edit_prospection',
        'create_cases',
      ]
    },
    {
      name: 'Verificação',
      permissions: [
        'view_verification',
        'edit_verification',
        'approve_cases',
      ]
    },
    {
      name: 'Administrativo',
      permissions: [
        'manage_users',
        'manage_permissions',
        'view_audit_logs',
      ]
    }
  ];

  const handleSaveProfile = (profileId: string) => {
    toast({
      title: "Perfil atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleCreateProfile = () => {
    if (!newProfile.name) {
      toast({
        title: "Erro ao criar perfil",
        description: "O nome do perfil é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Perfil criado",
      description: "O novo perfil foi criado com sucesso.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">Permissões e Perfis de Acesso</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Nome do perfil</Label>
                <Input
                  id="profile-name"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="Digite o nome do perfil"
                />
              </div>

              {permissionGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <h3 className="font-medium">{group.name}</h3>
                  <div className="grid gap-2">
                    {group.permissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`new-${permission}`}
                          checked={newProfile.permissions.includes(permission)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewProfile({
                                ...newProfile,
                                permissions: [...newProfile.permissions, permission]
                              });
                            } else {
                              setNewProfile({
                                ...newProfile,
                                permissions: newProfile.permissions.filter(p => p !== permission)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`new-${permission}`}>
                          {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProfile}>Criar perfil</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Perfil</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.name}</TableCell>
                <TableCell>{profile.userCount} usuários</TableCell>
                <TableCell className="text-right">
                  <Collapsible
                    open={expandedProfile === profile.id}
                    onOpenChange={(open) => setExpandedProfile(open ? profile.id : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        Editar <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      {permissionGroups.map((group) => (
                        <div key={group.name} className="space-y-2">
                          <h3 className="font-medium">{group.name}</h3>
                          <div className="grid gap-2">
                            {group.permissions.map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Checkbox id={`${profile.id}-${permission}`} />
                                <Label htmlFor={`${profile.id}-${permission}`}>
                                  {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setExpandedProfile(null)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => handleSaveProfile(profile.id)}>
                          Salvar alterações
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminPermissions;
