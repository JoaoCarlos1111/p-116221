
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Mock data
const mockData = [
  {
    id: "FIN-001",
    devedor: "João Silva",
    valorTotal: 1500,
    valorParcela: 500,
    statusParcela: "em dia",
    diasNaColuna: 2,
    coluna: "aguardando"
  },
  {
    id: "FIN-002",
    devedor: "Maria Santos",
    valorTotal: 3000,
    valorParcela: 1000,
    statusParcela: "atrasada",
    diasNaColuna: 4,
    coluna: "parcial"
  },
  {
    id: "FIN-003",
    devedor: "Pedro Costa",
    valorTotal: 2000,
    valorParcela: 2000,
    statusParcela: "quitado",
    diasNaColuna: 1,
    coluna: "quitado"
  },
  {
    id: "FIN-004",
    devedor: "Ana Pereira",
    valorTotal: 4500,
    valorParcela: 1500,
    statusParcela: "inadimplente",
    diasNaColuna: 7,
    coluna: "inadimplente"
  }
];

const colunas = [
  { id: "aguardando", titulo: "Aguardando pagamento" },
  { id: "parcial", titulo: "Pago parcialmente" },
  { id: "quitado", titulo: "Quitado" },
  { id: "inadimplente", titulo: "Inadimplente" }
];

export default function Financeiro() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const getCardsByColumn = (coluna: string) => {
    return mockData.filter(card => card.coluna === coluna);
  };

  const getSomaValores = (coluna: string) => {
    return getCardsByColumn(coluna)
      .reduce((acc, card) => acc + card.valorTotal, 0)
      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-primary">Financeiro</h1>
        <p className="text-muted-foreground">Acompanhamento de Pagamentos</p>
      </header>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou devedor..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Filtrar por data
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {colunas.map(coluna => (
          <div key={coluna.id} className="space-y-4">
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{coluna.titulo}</h3>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{getCardsByColumn(coluna.id).length} casos</span>
                <span>{getSomaValores(coluna.id)}</span>
              </div>
            </div>

            <div className="space-y-3">
              {getCardsByColumn(coluna.id).map(card => (
                <Card
                  key={card.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/financeiro/${card.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{card.id}</span>
                    <Badge variant={card.statusParcela === "em dia" ? "default" : "destructive"}>
                      {card.statusParcela}
                    </Badge>
                  </div>
                  <p className="font-medium mb-2">{card.devedor}</p>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total: {card.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      <span>{card.diasNaColuna}d</span>
                    </div>
                    <div>Parcela: {card.valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
