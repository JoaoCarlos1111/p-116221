
import { Card } from "@/components/ui/card"
import { Users, Tag, Package, CircleDollarSign, Bell } from "lucide-react"

export default function Admin() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Painel do Administrador</h1>
        <p className="text-muted-foreground">Resumo geral do sistema</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Usuários ativos</h3>
          </div>
          <p className="text-3xl font-bold">128</p>
        </Card>

        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">Marcas protegidas</h3>
          </div>
          <p className="text-3xl font-bold">52</p>
        </Card>

        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Casos ativos</h3>
          </div>
          <p className="text-3xl font-bold">1.247</p>
        </Card>

        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Valor potencial</h3>
          </div>
          <p className="text-3xl font-bold">R$ 1.283.000</p>
        </Card>

        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">Notificações do mês</h3>
          </div>
          <p className="text-3xl font-bold">402</p>
        </Card>
      </div>
    </div>
  )
}
