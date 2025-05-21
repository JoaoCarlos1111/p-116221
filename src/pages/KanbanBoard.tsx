import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

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
    createdAt: new Date().toISOString(),
    productType: 'Vestuário',
    state: 'SP',
    potentialValue: 5000
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
    createdAt: new Date().toISOString(),
    productType: 'Eletrônico',
    state: 'RJ',
    potentialValue: 3000
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
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterProducts, setFilterProducts] = useState<string[]>([]);
  const [filterStates, setFilterStates] = useState<string[]>([]);
  const [filterValueRange, setFilterValueRange] = useState<[number, number]>([0, 20000]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const productCategories = [
    'Eletrônico', 'Vestuário', 'Cosmético', 'Brinquedo', 'Acessório', 'Outro'
  ];

  const brStates = [
    { name: 'Acre', abbr: 'AC' },
    { name: 'Alagoas', abbr: 'AL' },
    { name: 'Amapá', abbr: 'AP' },
    { name: 'Amazonas', abbr: 'AM' },
    { name: 'Bahia', abbr: 'BA' },
    { name: 'Ceará', abbr: 'CE' },
    { name: 'Distrito Federal', abbr: 'DF' },
    { name: 'Espírito Santo', abbr: 'ES' },
    { name: 'Goiás', abbr: 'GO' },
    { name: 'Maranhão', abbr: 'MA' },
    { name: 'Mato Grosso', abbr: 'MT' },
    { name: 'Mato Grosso do Sul', abbr: 'MS' },
    { name: 'Minas Gerais', abbr: 'MG' },
    { name: 'Pará', abbr: 'PA' },
    { name: 'Paraíba', abbr: 'PB' },
    { name: 'Paraná', abbr: 'PR' },
    { name: 'Pernambuco', abbr: 'PE' },
    { name: 'Piauí', abbr: 'PI' },
    { name: 'Rio de Janeiro', abbr: 'RJ' },
    { name: 'Rio Grande do Norte', abbr: 'RN' },
    { name: 'Rio Grande do Sul', abbr: 'RS' },
    { name: 'Rondônia', abbr: 'RO' },
    { name: 'Roraima', abbr: 'RR' },
    { name: 'Santa Catarina', abbr: 'SC' },
    { name: 'São Paulo', abbr: 'SP' },
    { name: 'Sergipe', abbr: 'SE' },
    { name: 'Tocantins', abbr: 'TO' }
  ].sort((a, b) => a.name.localeCompare(b.name));

  const valueRanges = [
    { label: 'Todos', min: 0, max: 20000 },
    { label: 'R$0 – R$2.000', min: 0, max: 2000 },
    { label: 'R$2.001 – R$4.000', min: 2001, max: 4000 },
    { label: 'R$4.001 – R$8.000', min: 4001, max: 8000 },
    { label: 'Acima de R$8.000', min: 8001, max: 20000 }
  ];

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = !filterDate || new Date(card.createdAt).toDateString() === filterDate.toDateString();
    const matchesPriority = !filterPriority || filterPriority === '' || card.priority === filterPriority;
    const matchesClient = !filterClient || filterClient === '' || card.client === filterClient;
    
    // Product type filter
    const matchesProduct = filterProducts.length === 0 || filterProducts.includes(card.productType || '');
    
    // State filter
    const matchesState = filterStates.length === 0 || filterStates.includes(card.state || '');
    
    // Value range filter
    const cardValue = card.potentialValue || 0;
    const matchesValue = cardValue >= filterValueRange[0] && cardValue <= filterValueRange[1];

    return matchesSearch && 
           matchesDate && 
           matchesPriority && 
           matchesClient && 
           matchesProduct && 
           matchesState && 
           matchesValue;
  });

  useEffect(() => {
    const count = [
      filterDate,
      filterPriority,
      filterClient,
      ...filterProducts,
      ...filterStates,
      filterValueRange[0] > 0 || filterValueRange[1] < 20000
    ].filter(Boolean).length;
    
    setActiveFiltersCount(count);
  }, [filterDate, filterPriority, filterClient, filterProducts, filterStates, filterValueRange]);

  const handleClearFilters = () => {
    setFilterDate(undefined);
    setFilterPriority('');
    setFilterClient('');
    setFilterProducts([]);
    setFilterStates([]);
    setFilterValueRange([0, 20000]);
    setSearchQuery('');
  };

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


  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <div className="w-80 border-r p-6 space-y-6 bg-card">
        <h2 className="font-semibold text-lg">Filtros</h2>
        
        <Button variant="secondary" onClick={handleClearFilters} className="w-full">
          Limpar Filtros
        </Button>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Categoria do Caso</h3>
            <div className="space-y-2">
              {productCategories.map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox
                    id={`product-${category}`}
                    checked={filterProducts.includes(category)}
                    onCheckedChange={(checked) => {
                      setFilterProducts(prev => 
                        checked 
                          ? [...prev, category]
                          : prev.filter(p => p !== category)
                      );
                    }}
                  />
                  <label htmlFor={`product-${category}`} className="ml-2 text-sm">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Localização</h3>
            <Command>
              <CommandInput placeholder="Buscar estado..." />
              <CommandList className="max-h-48">
                <CommandGroup>
                  <CommandItem onSelect={() => setFilterStates([])}>
                    Todos
                  </CommandItem>
                  {brStates.map((state) => (
                    <CommandItem
                      key={state.abbr}
                      onSelect={() => {
                        setFilterStates(prev => 
                          prev.includes(state.abbr)
                            ? prev.filter(s => s !== state.abbr)
                            : [...prev, state.abbr]
                        );
                      }}
                    >
                      <Checkbox
                        checked={filterStates.includes(state.abbr)}
                        className="mr-2"
                      />
                      {state.name} ({state.abbr})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <div>
            <h3 className="font-medium mb-2">Financeiro</h3>
            <Select
              value={`${filterValueRange[0]}-${filterValueRange[1]}`}
              onValueChange={(value) => {
                const [min, max] = value.split('-').map(Number);
                setFilterValueRange([min, max]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a faixa de valor" />
              </SelectTrigger>
              <SelectContent>
                {valueRanges.map((range) => (
                  <SelectItem
                    key={`${range.min}-${range.max}`}
                    value={`${range.min}-${range.max}`}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Slider
              className="mt-6"
              defaultValue={[0, 20000]}
              max={20000}
              step={1000}
              value={filterValueRange}
              onValueChange={setFilterValueRange}
              marks={[
                { value: 0, label: 'R$0' },
                { value: 2000, label: 'R$2K' },
                { value: 4000, label: 'R$4K' },
                { value: 8000, label: 'R$8K' },
                { value: 20000, label: 'R$20K' }
              ]}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Outros Filtros</h3>
            <div className="space-y-4">
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
                <label className="text-sm">Prioridade</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Cliente</label>
                <Select value={filterClient} onValueChange={setFilterClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="Nike">Nike</SelectItem>
                    <SelectItem value="Adidas">Adidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-8">
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
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros Avançados</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-4">
                <Button variant="secondary" onClick={handleClearFilters} className="w-full">
                  Limpar Filtros
                </Button>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Categoria do Caso</h3>
                    <div className="space-y-2">
                      {productCategories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox
                            id={`product-${category}`}
                            checked={filterProducts.includes(category)}
                            onCheckedChange={(checked) => {
                              setFilterProducts(prev => 
                                checked 
                                  ? [...prev, category]
                                  : prev.filter(p => p !== category)
                              );
                            }}
                          />
                          <label htmlFor={`product-${category}`} className="ml-2 text-sm">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Localização</h3>
                    <Command>
                      <CommandInput placeholder="Buscar estado..." />
                      <CommandList>
                        <CommandGroup>
                          <CommandItem onSelect={() => setFilterStates([])}>
                            Todos
                          </CommandItem>
                          {brStates.map((state) => (
                            <CommandItem
                              key={state.abbr}
                              onSelect={() => {
                                setFilterStates(prev => 
                                  prev.includes(state.abbr)
                                    ? prev.filter(s => s !== state.abbr)
                                    : [...prev, state.abbr]
                                );
                              }}
                            >
                              <Checkbox
                                checked={filterStates.includes(state.abbr)}
                                className="mr-2"
                              />
                              {state.name} ({state.abbr})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Financeiro</h3>
                    <Select
                      value={`${filterValueRange[0]}-${filterValueRange[1]}`}
                      onValueChange={(value) => {
                        const [min, max] = value.split('-').map(Number);
                        setFilterValueRange([min, max]);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a faixa de valor" />
                      </SelectTrigger>
                      <SelectContent>
                        {valueRanges.map((range) => (
                          <SelectItem
                            key={`${range.min}-${range.max}`}
                            value={`${range.min}-${range.max}`}
                          >
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Slider
                      className="mt-6"
                      defaultValue={[0, 20000]}
                      max={20000}
                      step={1000}
                      value={filterValueRange}
                      onValueChange={setFilterValueRange}
                      marks={[
                        { value: 0, label: 'R$0' },
                        { value: 2000, label: 'R$2K' },
                        { value: 4000, label: 'R$4K' },
                        { value: 8000, label: 'R$8K' },
                        { value: 20000, label: 'R$20K' }
                      ]}
                    />
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Outros Filtros</h3>
                    <div className="space-y-4">
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
                        <label className="text-sm">Prioridade</label>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm">Cliente</label>
                        <Select value={filterClient} onValueChange={setFilterClient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="Nike">Nike</SelectItem>
                            <SelectItem value="Adidas">Adidas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
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