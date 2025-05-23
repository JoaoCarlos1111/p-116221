
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminPermissions() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Permissões</h1>
          <p className="text-muted-foreground">Gerencie as permissões do sistema</p>
        </div>
        <Button>Adicionar permissão</Button>
      </header>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Perfil</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Nível de acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Administrador</TableCell>
              <TableCell>Acesso total ao sistema</TableCell>
              <TableCell>Alto</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">Editar</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
