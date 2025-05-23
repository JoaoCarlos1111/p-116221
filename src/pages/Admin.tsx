
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Users, Key, History, BookOpen, FileText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const kpiCards = [
    { title: "Usuários Ativos", value: "24", icon: <Users className="h-5 w-5" /> },
    { title: "Marcas Protegidas", value: "156", icon: <Shield className="h-5 w-5" /> },
    { title: "Casos Ativos", value: "89", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Valor Potencial", value: "R$ 1.2M", icon: <Settings className="h-5 w-5" /> },
    { title: "Notificações (Mês)", value: "45", icon: <FileText className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-primary">Painel do Administrador</h1>
        </div>
        <Button variant="outline">
          <Wrench className="mr-2 h-4 w-4" />
          Suporte
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <Card key={card.title} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {card.icon}
              <h3 className="font-medium text-sm">{card.title}</h3>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Key className="mr-2 h-4 w-4" />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="audit">
            <History className="mr-2 h-4 w-4" />
            Auditoria
          </TabsTrigger>
          <TabsTrigger value="brands">
            <Shield className="mr-2 h-4 w-4" />
            Marcas
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gerenciamento de Usuários</h3>
            {/* Implementar lista de usuários e ações */}
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Permissões de Acesso</h3>
            {/* Implementar configurações de permissões */}
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Logs de Auditoria</h3>
            {/* Implementar histórico de ações */}
          </Card>
        </TabsContent>

        <TabsContent value="brands" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Marcas e Clientes</h3>
            {/* Implementar gestão de marcas */}
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Templates e Documentos</h3>
            {/* Implementar gestão de templates */}
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
            {/* Implementar configurações do sistema */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
