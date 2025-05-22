
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CalendarIcon, FilterIcon, Search } from 'lucide-react';

const columns = [
  { id: 'received', title: 'Recebido', color: '#3E64FF' },
  { id: 'analysis', title: 'Em Análise', color: '#FF9F43' },
  { id: 'inProgress', title: 'Em Andamento', color: '#FFB240' }
];

const initialCases = [
  {
    id: '1',
    title: 'Caso #123',
    description: 'Verificação de marca registrada',
    status: 'Novo',
    priority: 'Alta',
    brand: 'Nike',
    store: 'Store X',
    platform: 'Marketplace',
    links: [],
    analyst: 'João Silva',
    createdAt: new Date().toISOString(),
    column: 'received'
  },
  {
    id: '2',
    title: 'Caso #124',
    description: 'Análise de contrafação',
    status: 'Em Progresso',
    priority: 'Média',
    brand: 'Adidas',
    store: 'Store Y',
    platform: 'E-commerce',
    links: ['http://example.com'],
    analyst: 'Maria Santos',
    createdAt: new Date().toISOString(),
    column: 'analysis'
  }
];

export default function IPTools() {
  const [cases, setCases] = useState(initialCases);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredCases = cases.filter(caseItem => 
    caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(cases);
    const [reorderedItem] = items.splice(result.source.index, 1);
    
    items.splice(result.destination.index, 0, {
      ...reorderedItem,
      column: result.destination.droppableId,
      updatedAt: new Date().toISOString()
    });

    setCases(items);
  };

  return (
    <div className="space-y-8 p-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">IP Tools</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciamento de casos de proteção à propriedade intelectual
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por caso..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros Avançados</SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-w-[300px] h-[calc(100vh-12rem)]"
                >
                  <Card className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold" style={{ color: column.color }}>{column.title}</h3>
                      <Badge variant="secondary">
                        {filteredCases.filter(c => c.column === column.id).length}
                      </Badge>
                    </div>
                    <div className="space-y-2 overflow-y-auto flex-1">
                      {filteredCases
                        .filter(caseItem => caseItem.column === column.id)
                        .map((caseItem, index) => (
                          <Draggable key={caseItem.id} draggableId={caseItem.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => navigate(`/iptools/case/${caseItem.id}`)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">{caseItem.title}</h4>
                                  <Badge variant="outline">{caseItem.priority}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{caseItem.description}</p>
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm text-muted-foreground">Marca: {caseItem.brand}</p>
                                  <p className="text-sm text-muted-foreground">Loja: {caseItem.store}</p>
                                  <p className="text-sm text-muted-foreground">Plataforma: {caseItem.platform}</p>
                                  {caseItem.links.length > 0 && (
                                    <div className="text-sm text-primary">
                                      {caseItem.links.length} link(s) adicionado(s)
                                    </div>
                                  )}
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <CalendarIcon className="w-3 h-3 mr-1" />
                                    {new Date(caseItem.createdAt).toLocaleDateString('pt-BR')}
                                  </div>
                                  <Badge variant="secondary">{caseItem.analyst}</Badge>
                                </div>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </Card>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
