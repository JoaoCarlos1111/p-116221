
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminAudit() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Auditoria</h1>
        <p className="text-muted-foreground">Histórico de ações no sistema</p>
      </header>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>23/01/2024 14:30</TableCell>
              <TableCell>admin@tbp.com</TableCell>
              <TableCell>Login</TableCell>
              <TableCell>Acesso ao sistema</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
