
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  company: string;
  inpiRegistrations: number;
  activeCases: number;
  status: "active" | "validating" | "inactive";
}

export default function BrandsAndClients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [processFilter, setProcessFilter] = useState("");

  // Mock data - replace with API data
  const brands: Brand[] = [
    {
      id: "1",
      name: "Nike",
      company: "Nike Inc.",
      inpiRegistrations: 45,
      activeCases: 12,
      status: "active"
    },
    {
      id: "2",
      name: "Adidas",
      company: "Adidas Group",
      inpiRegistrations: 38,
      activeCases: 8,
      status: "active"
    }
  ];

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || brand.status === statusFilter;
    const matchesProcess = !processFilter || 
      (processFilter === "high" ? brand.activeCases > 10 : brand.activeCases <= 10);
    
    return matchesSearch && matchesStatus && matchesProcess;
  });

  const getStatusBadge = (status: Brand['status']) => {
    const variants = {
      active: "success",
      validating: "warning",
      inactive: "destructive"
    };
    const labels = {
      active: "Ativa",
      validating: "Em validação",
      inactive: "Inativa"
    };
    return <Badge variant={variants[status] as any}>{labels[status]}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marcas e Clientes</h1>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por marca ou empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="active">Ativa</SelectItem>
              <SelectItem value="validating">Em validação</SelectItem>
              <SelectItem value="inactive">Inativa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={processFilter} onValueChange={setProcessFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Processos ativos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="high">Mais de 10</SelectItem>
              <SelectItem value="low">Até 10</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da marca</TableHead>
              <TableHead>Empresa/Grupo</TableHead>
              <TableHead>Registros INPI</TableHead>
              <TableHead>Casos ativos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>{brand.company}</TableCell>
                <TableCell>{brand.inpiRegistrations}</TableCell>
                <TableCell>{brand.activeCases}</TableCell>
                <TableCell>{getStatusBadge(brand.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/brands/${brand.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
