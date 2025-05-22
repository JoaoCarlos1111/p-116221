import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Case {
  id: string;
  brand: string;
  entryDate: string;
  responsible: string;
  linksFound: number;
  status: string;
}

export default function IPTools() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([
    // Recebido
    {
      id: "001",
      brand: "Nike",
      entryDate: "21/05/2025",
      responsible: "João Silva",
      linksFound: 3,
      status: "received"
    },
    {
      id: "002",
      brand: "Adidas",
      entryDate: "22/05/2025",
      responsible: "Maria Santos",
      linksFound: 5,
      status: "received"
    },
    {
      id: "003",
      brand: "Puma",
      entryDate: "23/05/2025",
      responsible: "Pedro Costa",
      linksFound: 2,
      status: "received"
    },
    // Em andamento
    {
      id: "004",
      brand: "Under Armour",
      entryDate: "20/05/2025",
      responsible: "Ana Lima",
      linksFound: 7,
      status: "inProgress"
    },
    {
      id: "005",
      brand: "Reebok",
      entryDate: "19/05/2025",
      responsible: "Carlos Souza",
      linksFound: 4,
      status: "inProgress"
    },
    {
      id: "006",
      brand: "New Balance",
      entryDate: "18/05/2025",
      responsible: "Lucia Ferreira",
      linksFound: 6,
      status: "inProgress"
    },
    // Análise
    {
      id: "007",
      brand: "Fila",
      entryDate: "17/05/2025",
      responsible: "Roberto Santos",
      linksFound: 8,
      status: "analysis"
    },
    {
      id: "008",
      brand: "Asics",
      entryDate: "16/05/2025",
      responsible: "Sandra Silva",
      linksFound: 3,
      status: "analysis"
    },
    {
      id: "009",
      brand: "Mizuno",
      entryDate: "15/05/2025",
      responsible: "Felipe Oliveira",
      linksFound: 5,
      status: "analysis"
    }
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(cases);
    const [reorderedItem] = items.splice(result.source.index, 1);

    // Update status based on destination column
    const newStatus = result.destination.droppableId;
    reorderedItem.status = newStatus;

    items.splice(result.destination.index, 0, reorderedItem);
    setCases(items);
  };

  const columns = [
    {
      id: 'received',
      title: 'Recebido',
      color: 'bg-green-50'
    },
    {
      id: 'inProgress',
      title: 'Em andamento',
      color: 'bg-yellow-50'
    },
    {
      id: 'analysis',
      title: 'Análise',
      color: 'bg-blue-50'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">IP Tools - Kanban</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">Caso #{case_.id}</h3>
                                    <p className="text-sm text-gray-600">{case_.brand}</p>
                                    <p className="text-sm text-gray-600">Data: {case_.entryDate}</p>
                                    <p className="text-sm text-gray-600">Resp: {case_.responsible}</p>
                                    <Badge variant="secondary" className="mt-2">
                                      {case_.linksFound} links encontrados
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(`/iptools/case/${case_.id}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
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