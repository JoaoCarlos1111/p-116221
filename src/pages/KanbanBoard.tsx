
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sectors = [
  'Prospecção',
  'Verificação',
  'Auditoria',
  'Logística',
  'IP Tools',
  'Atendimento',
  'Financeiro'
];

const columns = [
  { id: 'received', title: 'Recebido', color: '#3E64FF' },
  { id: 'analysis', title: 'Caso em Análise', color: '#FF9F43' },
  { id: 'pending', title: 'Pendente de Informação', color: '#FFB240' },
  { id: 'completed', title: 'Concluído', color: '#3ECF8E' }
];

const initialCards = [
  {
    id: '1',
    title: 'Caso #123',
    description: 'Verificação de marca registrada',
    status: 'Novo',
    priority: 'Alta',
    timeline: ['Criado', 'Em análise'],
    column: 'received',
    analyst: 'João Silva'
  },
  {
    id: '2',
    title: 'Caso #124',
    description: 'Análise de contrafação',
    status: 'Em Progresso',
    priority: 'Média',
    timeline: ['Criado', 'Pendente'],
    column: 'analysis',
    analyst: 'Maria Santos'
  }
];

export default function KanbanBoard() {
  const { sector } = useParams();
  const [cards, setCards] = useState(initialCards);
  const [selectedSector, setSelectedSector] = useState(sector || sectors[0]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, {
      ...reorderedItem,
      column: result.destination.droppableId
    });

    setCards(items);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#2B2B2B]">Pipeline</h1>
          <p className="text-[#6F767E]">{selectedSector}</p>
        </div>
        
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione o setor" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-w-[300px]"
                >
                  <Card className="p-4 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-[#2B2B2B]">{column.title}</h3>
                      <Badge variant="secondary">
                        {cards.filter(c => c.column === column.id).length}
                      </Badge>
                    </div>
                    <div className="space-y-2 min-h-[200px]">
                      {cards
                        .filter(card => card.column === column.id)
                        .map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 bg-[#F8F9FA] cursor-move hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">{card.title}</h4>
                                  <Badge 
                                    style={{ backgroundColor: column.color }}
                                    className="text-white"
                                  >
                                    {card.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-[#6F767E] mb-2">{card.description}</p>
                                <div className="text-sm text-[#6F767E]">
                                  {card.timeline.map((event, i) => (
                                    <div key={i} className="flex items-center">
                                      <span className="w-2 h-2 bg-[#6F767E] rounded-full mr-2" />
                                      {event}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 text-xs text-[#6F767E] flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                  {card.analyst}
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
