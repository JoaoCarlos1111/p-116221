
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Total Brand Protection</h1>
        <p className="text-muted-foreground">Gestão de Casos de Falsificação</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Casos Ativos</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Notificações Pendentes</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Acordos Realizados</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>
    </div>
  );
}
