
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminBrands() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marcas e Clientes</h1>
          <p className="text-muted-foreground">Gerencie as marcas e clientes do sistema</p>
        </div>
        <Button>Adicionar nova marca</Button>
      </header>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Marca</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Nike</TableCell>
              <TableCell>Nike Inc.</TableCell>
              <TableCell>Ativo</TableCell>
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
