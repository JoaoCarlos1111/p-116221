
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const sampleCases = [
  {
    id: "IP-2024-001",
    brand: "Nike",
    store: "SuperSports",
    platform: "Instagram",
    status: "Aguardando resposta",
    responsible: "Ana Silva",
    type: "Loja completa",
    links: ["instagram.com/store1", "whatsapp.com/link1"],
    column: "received"
  },
  {
    id: "IP-2024-002",
    brand: "Adidas",
    store: "TopSports",
    platform: "Shopee",
    status: "Respondido (positivamente)",
    responsible: "João Santos",
    type: "Anúncio individual",
    links: ["shopee.com/store2"],
    column: "inProgress"
  },
  {
    id: "IP-2024-003",
    brand: "Puma",
    store: "MegaSports",
    platform: "Mercado Livre",
    status: "Respondido (negativamente)",
    responsible: "Carlos Oliveira",
    type: "Link de WhatsApp",
    links: [],
    column: "analysis"
  }
];

export default function IPTools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterDate, setFilterDate] = useState<Date>();
  const [filterResponsible, setFilterResponsible] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLinks, setFilterLinks] = useState("");

  const filterCases = (cases: typeof sampleCases) => {
    return cases.filter(caseItem => {
      const searchContent = `${caseItem.id} ${caseItem.brand} ${caseItem.store} ${caseItem.links.join(" ")}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());
      
      const matchesBrand = !filterBrand || caseItem.brand === filterBrand;
      const matchesStatus = !filterStatus || caseItem.status === filterStatus;
      const matchesPlatform = !filterPlatform || caseItem.platform === filterPlatform;
      const matchesResponsible = !filterResponsible || caseItem.responsible === filterResponsible;
      const matchesType = !filterType || caseItem.type === filterType;
      const matchesLinks = !filterLinks || 
        (filterLinks === "com" ? caseItem.links.length > 0 : caseItem.links.length === 0);

      return matchesSearch && matchesBrand && matchesStatus && matchesPlatform && 
             matchesResponsible && matchesType && matchesLinks;
    });
  };

  const getCasesByColumn = (column: string) => {
    return filterCases(sampleCases).filter(c => c.column === column);
  };

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">IP Tools</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciamento de casos de proteção à propriedade intelectual
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Buscar em todo o conteúdo dos casos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="Nike">Nike</SelectItem>
                <SelectItem value="Adidas">Adidas</SelectItem>
                <SelectItem value="Puma">Puma</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Aguardando resposta">Aguardando resposta</SelectItem>
                <SelectItem value="Respondido (positivamente)">Respondido (positivamente)</SelectItem>
                <SelectItem value="Respondido (negativamente)">Respondido (negativamente)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Shopee">Shopee</SelectItem>
                <SelectItem value="Mercado Livre">Mercado Livre</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "PPP") : "Data de envio"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={setFilterDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Recebido
              <Badge variant="secondary">{getCasesByColumn("received").length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCasesByColumn("received").map((caseItem) => (
              <Card key={caseItem.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{caseItem.id}</h4>
                  <Badge>{caseItem.status}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Marca: {caseItem.brand}</p>
                  <p className="text-sm text-muted-foreground">Loja: {caseItem.store}</p>
                  <p className="text-sm text-muted-foreground">Plataforma: {caseItem.platform}</p>
                  {caseItem.links.length > 0 && (
                    <div className="text-sm text-primary">
                      {caseItem.links.length} link(s) adicionado(s)
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Em Andamento
              <Badge variant="secondary">{getCasesByColumn("inProgress").length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCasesByColumn("inProgress").map((caseItem) => (
              <Card key={caseItem.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{caseItem.id}</h4>
                  <Badge>{caseItem.status}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Marca: {caseItem.brand}</p>
                  <p className="text-sm text-muted-foreground">Loja: {caseItem.store}</p>
                  <p className="text-sm text-muted-foreground">Plataforma: {caseItem.platform}</p>
                  {caseItem.links.length > 0 && (
                    <div className="text-sm text-primary">
                      {caseItem.links.length} link(s) adicionado(s)
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Análise
              <Badge variant="secondary">{getCasesByColumn("analysis").length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCasesByColumn("analysis").map((caseItem) => (
              <Card key={caseItem.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{caseItem.id}</h4>
                  <Badge>{caseItem.status}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Marca: {caseItem.brand}</p>
                  <p className="text-sm text-muted-foreground">Loja: {caseItem.store}</p>
                  <p className="text-sm text-muted-foreground">Plataforma: {caseItem.platform}</p>
                  {caseItem.links.length > 0 && (
                    <div className="text-sm text-primary">
                      {caseItem.links.length} link(s) adicionado(s)
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
