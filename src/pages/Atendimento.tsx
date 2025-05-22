
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Case {
  id: string;
  brand: string;
  recipient: string;
  nextTaskDate: string;
  potentialValue: number;
  responsible: string;
  status: string;
}

export default function Atendimento() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState('');
  const [cases, setCases] = useState<Case[]>([
    // Aguardando entrega
    {
      id: "ATD001",
      brand: "Nike",
      recipient: "João Silva",
      nextTaskDate: "2024-03-28",
      potentialValue: 5000,
      responsible: "Maria Santos",
      status: "waiting"
    },
    {
      id: "ATD002",
      brand: "Adidas",
      recipient: "Pedro Costa",
      nextTaskDate: "2024-03-29",
      potentialValue: 3500,
      responsible: "Carlos Lima",
      status: "waiting"
    },
    // Entregues
    {
      id: "ATD003",
      brand: "Puma",
      recipient: "Ana Oliveira",
      nextTaskDate: "2024-03-30",
      potentialValue: 2800,
      responsible: "Paulo Mendes",
      status: "delivered"
    },
    {
      id: "ATD004",
      brand: "Gucci",
      recipient: "Mariana Torres",
      nextTaskDate: "2024-03-31",
      potentialValue: 8000,
      responsible: "Lucia Costa",
      status: "delivered"
    },
    // Primeiro contato
    {
      id: "ATD005",
      brand: "Louis Vuitton",
      recipient: "Roberto Santos",
      nextTaskDate: "2024-04-01",
      potentialValue: 12000,
      responsible: "Fernando Silva",
      status: "firstContact"
    },
    {
      id: "ATD006",
      brand: "Balenciaga",
      recipient: "Carolina Lima",
      nextTaskDate: "2024-04-02",
      potentialValue: 15000,
      responsible: "Amanda Reis",
      status: "firstContact"
    },
    // Proposta de acordo
    {
      id: "ATD007",
      brand: "Dior",
      recipient: "Ricardo Oliveira",
      nextTaskDate: "2024-04-03",
      potentialValue: 20000,
      responsible: "Bruno Costa",
      status: "proposal"
    },
    {
      id: "ATD008",
      brand: "Hermès",
      recipient: "Patricia Mendes",
      nextTaskDate: "2024-04-04",
      potentialValue: 25000,
      responsible: "Camila Santos",
      status: "proposal"
    }
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(cases);
    const [reorderedItem] = items.splice(result.source.index, 1);
    reorderedItem.status = result.destination.droppableId;
    items.splice(result.destination.index, 0, reorderedItem);
    setCases(items);
  };

  const columns = [
    {
      id: 'waiting',
      title: 'Aguardando entrega',
      color: 'bg-yellow-50'
    },
    {
      id: 'delivered',
      title: 'Entregues',
      color: 'bg-green-50'
    },
    {
      id: 'firstContact',
      title: 'Primeiro contato',
      color: 'bg-blue-50'
    },
    {
      id: 'proposal',
      title: 'Proposta de acordo',
      color: 'bg-purple-50'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6 mb-6">
        <h1 className="text-2xl font-bold">Atendimento - Kanban</h1>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, marca, destinatário..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nike">Nike</SelectItem>
              <SelectItem value="adidas">Adidas</SelectItem>
              <SelectItem value="puma">Puma</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedResponsible} onValueChange={setSelectedResponsible}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maria">Maria Santos</SelectItem>
              <SelectItem value="carlos">Carlos Lima</SelectItem>
              <SelectItem value="amanda">Amanda Reis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${column.color} p-4 rounded-lg`}
                >
                  <h2 className="font-semibold mb-4">{column.title}</h2>
                  <div className="space-y-4">
                    {cases
                      .filter(case_ => case_.status === column.id)
                      .map((case_, index) => (
                        <Draggable
                          key={case_.id}
                          draggableId={case_.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                              onClick={() => navigate(`/atendimento/caso/${case_.id}`)}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-medium">#{case_.id}</h3>
                                    <Badge variant="secondary">
                                      R$ {case_.potentialValue.toLocaleString()}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-medium">{case_.brand}</p>
                                  <p className="text-sm text-gray-600">{case_.recipient}</p>
                                  <p className="text-xs text-gray-500">
                                    Próxima tarefa: {new Date(case_.nextTaskDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Resp: {case_.responsible}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
