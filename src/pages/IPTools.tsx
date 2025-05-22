import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { Eye, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

interface Case {
  id: string;
  brand: string;
  entryDate: string;
  responsible: string;
  linksFound: number;
  status: string;
  programStatus?: string;
  platform?: string;
}

export default function IPTools() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
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
      <div className="flex flex-col gap-6 mb-6">
        <h1 className="text-2xl font-bold">IP Tools - Kanban</h1>
        <div className="space-y-4">
          <div className="w-full">
            <input
              type="text"
              placeholder="Buscar casos por número, marca ou nome da loja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Marcas</SelectItem>
                <SelectItem value="Nike">Nike</SelectItem>
                <SelectItem value="Adidas">Adidas</SelectItem>
                <SelectItem value="Puma">Puma</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Plataformas</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="shopee">Shopee</SelectItem>
                <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yy")
                    )
                  ) : (
                    "Selecionar período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range: any) => setDateRange({ from: range?.from, to: range?.to })}
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedResponsible} onValueChange={setSelectedResponsible}>
              <SelectTrigger>
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Responsáveis</SelectItem>
                <SelectItem value="joao">João Silva</SelectItem>
                <SelectItem value="maria">Maria Santos</SelectItem>
                <SelectItem value="pedro">Pedro Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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
                      .filter(case_ => {
                        const searchLower = searchQuery.toLowerCase();
                        const matchesSearch = 
                          case_.id.toLowerCase().includes(searchLower) ||
                          case_.brand.toLowerCase().includes(searchLower) ||
                          case_.responsible.toLowerCase().includes(searchLower);

                        const matchesBrand = selectedBrand === 'all' || !selectedBrand || case_.brand === selectedBrand;
                        const matchesStatus = selectedStatus === 'all' || !selectedStatus || case_.programStatus === selectedStatus;
                        const matchesPlatform = selectedPlatform === 'all' || !selectedPlatform || case_.platform === selectedPlatform;
                        const matchesResponsible = selectedResponsible === 'all' || !selectedResponsible || case_.responsible === selectedResponsible;

                        const matchesDateRange = !dateRange.from || !dateRange.to || 
                          (new Date(case_.entryDate) >= dateRange.from && 
                           new Date(case_.entryDate) <= dateRange.to);

                        return case_.status === column.id && 
                               (searchQuery === '' || matchesSearch) &&
                               matchesBrand &&
                               matchesStatus &&
                               matchesPlatform &&
                               matchesResponsible &&
                               matchesDateRange;
                      })
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