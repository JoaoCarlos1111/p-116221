
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Tag, 
  Box, 
  DollarSign, 
  RefreshCw
} from "lucide-react";

export default function Admin() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Painel do Administrador</h1>
        <p className="text-muted-foreground">Gestão do sistema</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="p-6 bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Usuários ativos</p>
              <h3 className="text-2xl font-bold">128</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-4">
            <Tag className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Marcas protegidas</p>
              <h3 className="text-2xl font-bold">52</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-4">
            <Box className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Casos ativos</p>
              <h3 className="text-2xl font-bold">1.247</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-4">
            <DollarSign className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Valor potencial</p>
              <h3 className="text-2xl font-bold">R$ 1.283.000</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-4">
            <RefreshCw className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Notificações no mês</p>
              <h3 className="text-2xl font-bold">402</h3>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
