
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CalendarIcon, FilterIcon, PlusIcon, Search } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";

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
    analyst: 'João Silva',
    client: 'Nike',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Caso #124',
    description: 'Análise de contrafação',
    status: 'Em Progresso',
    priority: 'Média',
    timeline: ['Criado', 'Pendente'],
    column: 'analysis',
    analyst: 'Maria Santos',
    client: 'Adidas',
    createdAt: new Date().toISOString()
  }
];

export default function KanbanBoard() {
  const { sector } = useParams();
  const { toast } = useToast();
  const [cards, setCards] = useState(initialCards);
  const [selectedSector, setSelectedSector] = useState(sector || sectors[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);
  const [newCaseLink, setNewCaseLink] = useState('');
  
  // Filter states
  const [filterDate, setFilterDate] = useState<Date>();
  const [filterPriority, setFilterPriority] = useState('');
  const [filterClient, setFilterClient] = useState('');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    
    // Update analyst based on column
    const newAnalyst = getNextAnalyst(result.destination.droppableId);
    
    items.splice(result.destination.index, 0, {
      ...reorderedItem,
      column: result.destination.droppableId,
      analyst: newAnalyst
    });

    setCards(items);

    // Show notification if moved to pending
    if (result.destination.droppableId === 'pending') {
      toast({
        title: "Caso Pendente",
        description: `O caso ${reorderedItem.title} está aguardando informações.`,
        variant: "default",
      });
    }
  };

  const getNextAnalyst = (column: string) => {
    // Simulate analyst assignment based on column
    const analysts = {
      received: 'João Silva',
      analysis: 'Maria Santos',
      pending: 'Pedro Oliveira',
      completed: 'Ana Costa'
    };
    return analysts[column as keyof typeof analysts] || 'Não atribuído';
  };

  const handleNewCase = () => {
    if (!newCaseLink) return;
    
    const newCard = {
      id: `case-${Date.now()}`,
      title: `Caso #${Math.floor(Math.random() * 1000)}`,
      description: 'Novo caso',
      status: 'Novo',
      priority: 'Média',
      timeline: ['Criado'],
      column: 'received',
      analyst: getNextAnalyst('received'),
      client: 'Pendente',
      createdAt: new Date().toISOString()
    };

    setCards([...cards, newCard]);
    setNewCaseLink('');
    setShowNewCaseDialog(false);
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !filterDate || new Date(card.createdAt).toDateString() === filterDate.toDateString();
    const matchesPriority = !filterPriority || card.priority === filterPriority;
    const matchesClient = !filterClient || card.client === filterClient;

    return matchesSearch && matchesDate && matchesPriority && matchesClient;
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#2B2B2B]">Pipeline</h1>
          <p className="text-[#6F767E]">{selectedSector}</p>
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
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Data de Criação</label>
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={setFilterDate}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Cliente</label>
                  <Select value={filterClient} onValueChange={setFilterClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nike">Nike</SelectItem>
                      <SelectItem value="Adidas">Adidas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Dialog open={showNewCaseDialog} onOpenChange={setShowNewCaseDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Novo Caso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Caso</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Cole o link suspeito aqui"
                  value={newCaseLink}
                  onChange={(e) => setNewCaseLink(e.target.value)}
                />
                <Button onClick={handleNewCase}>Criar Caso</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  className="min-w-[300px]"
                >
                  <Card className="p-4 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-[#2B2B2B]">{column.title}</h3>
                      <Badge variant="secondary">
                        {filteredCards.filter(c => c.column === column.id).length}
                      </Badge>
                    </div>
                    <div className="space-y-2 min-h-[200px]">
                      {filteredCards
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
                                  <Badge variant="outline" className="mr-2">
                                    {card.analyst}
                                  </Badge>
                                  <Badge variant="outline">{card.priority}</Badge>
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
