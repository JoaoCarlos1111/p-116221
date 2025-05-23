
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Configurações gerais do sistema</p>
      </header>

      <Card className="p-6">
        <form className="space-y-4">
          <div>
            <Label>Nome da empresa</Label>
            <Input type="text" defaultValue="Total Brand Protection" />
          </div>
          <div>
            <Label>Email do suporte</Label>
            <Input type="email" defaultValue="suporte@tbp.com" />
          </div>
          <Button type="submit">Salvar alterações</Button>
        </form>
      </Card>
    </div>
  )
}
