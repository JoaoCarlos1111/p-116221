import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users } from "lucide-react";

const initialProfiles = [
  { id: 1, name: "Administrador", userCount: 4 },
  { id: 2, name: "Analista de Prospecção", userCount: 6 },
  { id: 3, name: "Gestor Cliente", userCount: 8 },
  { id: 4, name: "Analista de Contrafação", userCount: 12 },
  { id: 5, name: "Financeiro Cliente", userCount: 4 },
];

const permissionGroups = {
  gestorCliente: {
    title: "Gestor Cliente",
    permissions: [
      "Visualizar todos os casos",
      "Aprovar/reprovar ações",
      "Gerenciar usuários da empresa",
      "Acessar dashboards completos",
      "Acessar área financeira",
      "Cadastrar novos casos",
      "Aprovar notificações extrajudiciais",
      "Visualizar relatórios detalhados"
    ]
  },
  analistaContrafacao: {
    title: "Analista de Contrafação",
    permissions: [
      "Visualizar casos atribuídos",
      "Aprovar/reprovar notificações",
      "Cadastrar novos casos",
      "Acessar dashboard operacional",
      "Acompanhar violações de marca"
    ]
  },
  financeiroCliente: {
    title: "Financeiro Cliente",
    permissions: [
      "Acessar dashboard geral",
      "Visualizar área financeira",
      "Acessar faturas e pagamentos",
      "Cadastrar novos casos",
      "Gerar relatórios financeiros"
    ]
  },
  admin: {
    title: "Geral/Administração",
    permissions: [
      "Acessar Dashboard",
      "Criar/editar usuários",
      "Gerenciar marcas",
      "Editar templates",
      "Ver todas as notificações",
    ]
  }
};

export default function AdminPermissions() {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setSelectedPermissions({});
  };

  const handleSaveProfile = () => {
    setEditingProfile(null);
    setSelectedPermissions({});
  };

  const handleCreateProfile = () => {
    if (!newProfileName) return;

    const newProfile = {
      id: profiles.length + 1,
      name: newProfileName,
      userCount: 0,
    };

    setProfiles([...profiles, newProfile]);
    setNewProfileName("");
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Permissões e Perfis de Acesso</h1>
          <p className="text-muted-foreground">Gerencie os perfis de acesso do sistema</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Criar novo perfil</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Perfil</Label>
                <Input
                  id="name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Digite o nome do perfil"
                />
              </div>
              <ScrollArea className="h-[400px] pr-4">
                {Object.entries(permissionGroups).map(([key, group]) => (
                  <div key={key} className="mb-6">
                    <h3 className="font-semibold mb-2">{group.title}</h3>
                    <div className="space-y-3">
                      {group.permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Switch
                            id={`${key}-${permission}`}
                            checked={selectedPermissions[permission]}
                            onCheckedChange={(checked) =>
                              setSelectedPermissions({
                                ...selectedPermissions,
                                [permission]: checked,
                              })
                            }
                          />
                          <Label htmlFor={`${key}-${permission}`}>{permission}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <Button onClick={handleCreateProfile} className="w-full">
                Criar Perfil
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Perfil</TableHead>
              <TableHead>Tipo de Acesso</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.name}</TableCell>
                <TableCell>Tipo de Acesso</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {profile.userCount}
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog open={editingProfile?.id === profile.id} onOpenChange={() => setEditingProfile(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEditProfile(profile)}>
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Perfil: {profile.name}</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[500px] pr-4">
                        {Object.entries(permissionGroups).map(([key, group]) => (
                          <div key={key} className="mb-6">
                            <h3 className="font-semibold mb-2">{group.title}</h3>
                            <div className="space-y-3">
                              {group.permissions.map((permission) => (
                                <div key={permission} className="flex items-center space-x-2">
                                  <Switch
                                    id={`${key}-${permission}`}
                                    checked={selectedPermissions[permission]}
                                    onCheckedChange={(checked) =>
                                      setSelectedPermissions({
                                        ...selectedPermissions,
                                        [permission]: checked,
                                      })
                                    }
                                  />
                                  <Label htmlFor={`${key}-${permission}`}>{permission}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setEditingProfile(null)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          Salvar alterações
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}