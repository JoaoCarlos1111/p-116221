import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CircleCheck, Send, RefreshCw, Printer, MailCheck, Search, CheckSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from 'react-router-dom';

interface Case {
  id: string;
  storeName: string;
  address: string;
  brand: string;
  approvalDate: string;
  printDate?: string;
  status: string;
  trackingCode?: string;
  deliveryStatus?: string;
  document?: string;
  selected?: boolean;
}

export default function Logistics() {
  useEffect(() => {
    // Load cases from localStorage in production
    const storedCases = localStorage.getItem('logisticsCases');
    if (storedCases) {
      const parsedCases = JSON.parse(storedCases);
      setCases(prev => [...prev, ...parsedCases]);
      // Clear storage after loading
      localStorage.removeItem('logisticsCases');
    }
  }, []);

  const [cases, setCases] = useState<Case[]>([
    {
      id: "NOT001",
      storeName: "Loja Esportiva SP",
      address: "Rua Augusta, 1500 - São Paulo, SP",
      brand: "Nike",
      approvalDate: "2024-03-20",
      status: "Aprovado",
      document: "12345678901"
    },
    {
      id: "NOT002",
      storeName: "Shopping Center RJ",
      address: "Av. das Américas, 4666 - Rio de Janeiro, RJ",
      brand: "Adidas",
      approvalDate: "2024-03-20",
      printDate: "2024-03-21",
      status: "Impresso",
      document: "98765432101"
    },
    {
      id: "NOT003",
      storeName: "Galeria BH",
      address: "Av. Afonso Pena, 2700 - Belo Horizonte, MG",
      brand: "Puma",
      approvalDate: "2024-03-19",
      printDate: "2024-03-20",
      trackingCode: "BR789456123",
      status: "Em trânsito",
      deliveryStatus: "Em rota de entrega",
      document: "45678912301"
    }
  ]);

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const navigate = useNavigate();

  const handleSelectAll = () => {
    setCases(cases.map(c => ({
      ...c,
      selected: !c.printDate ? true : c.selected
    })));
  };

  const handleSelect = (caseId: string) => {
    setCases(cases.map(c => ({
      ...c,
      selected: c.id === caseId ? !c.selected : c.selected
    })));
  };

  const handleMoveSelectedToPrint = () => {
    setCases(cases.map(c => {
      if (c.selected && !c.printDate) {
        return {
          ...c,
          printDate: new Date().toISOString(),
          status: 'Impresso',
          selected: false
        };
      }
      return c;
    }));
    toast({ description: "Casos selecionados movidos para impressão" });
  };

  const filteredCases = cases.filter(c => {
    const searchLower = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      c.id.toLowerCase().includes(searchLower) ||
      c.document?.toLowerCase().includes(searchLower) ||
      c.storeName.toLowerCase().includes(searchLower) ||
      c.trackingCode?.toLowerCase().includes(searchLower)
    );
  });

  const selectedCount = cases.filter(c => c.selected).length;

  const transferToIPTools = (caseData: Case) => {
    // Wait 2 minutes then transfer to IP Tools
    setTimeout(() => {
      const ipToolsCase = {
        id: caseData.id,
        brand: caseData.brand,
        entryDate: new Date().toLocaleDateString(),
        responsible: "Não atribuído",
        linksFound: 0,
        status: "received",
        store: caseData.storeName,
        type: "Loja completa",
        links: [],
        recipient: caseData.storeName,
        notificationDate: new Date().toISOString().split('T')[0],
        trackingCode: caseData.trackingCode,
        deliveryStatus: "Em análise",
        observations: "",
        history: [
          { date: new Date().toISOString(), action: "Caso recebido da Logística", user: "Sistema" }
        ]
      };

      // Update IP Tools cases
      fetch('/api/iptools/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ipToolsCase),
      });

      toast({
        description: `Caso ${caseData.id} transferido para IP Tools`,
      });

      // Remove from logistics cases
      setCases(prevCases => prevCases.filter(c => c.id !== caseData.id));
    }, 120000); // 2 minutes
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(cases);
    const [reorderedItem] = items.splice(result.source.index, 1);

    // Update status based on destination column
    const newStatus = result.destination.droppableId;
    reorderedItem.status = newStatus;

    items.splice(result.destination.index, 0, reorderedItem);
    setCases(items);

    // If case is moved to "posted" column, start transfer timer
    if (result.destination.droppableId === 'Postado') {
      transferToIPTools(reorderedItem);
      toast({
        description: `Caso ${reorderedItem.id} será transferido para IP Tools em 2 minutos`,
      });
    }
  };

  const columns = [
    {
      title: "Aprovado",
      icon: <CircleCheck className="h-5 w-5 text-green-600" />,
      cases: filteredCases.filter(c => !c.printDate && !c.trackingCode),
      color: "bg-green-50"
    },
    {
      title: "Fila de Impressão",
      icon: <Printer className="h-5 w-5 text-gray-600" />,
      cases: filteredCases.filter(c => c.printDate && !c.trackingCode),
      color: "bg-gray-50"
    },
    {
      title: "Postado",
      icon: <MailCheck className="h-5 w-5 text-blue-600" />,
      cases: filteredCases.filter(c => c.trackingCode),
      color: "bg-blue-50"
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban de Notificações - Logística</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número do caso, CPF/CNPJ, nome ou código de rastreio..."
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
            <SelectItem value="marca1">Marca 1</SelectItem>
            <SelectItem value="marca2">Marca 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedCount > 0 && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{selectedCount} casos selecionados</span>
          <Button onClick={handleMoveSelectedToPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Mover para Impressão
          </Button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.title} className={`${column.color} p-4 rounded-lg`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                {column.icon}
                {column.title}
              </h2>
              {column.title === "Aprovado" && (
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Selecionar Todos
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {column.cases.map((case_) => (
                <Card 
                  key={case_.id} 
                  className="bg-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-2">
                      {!case_.printDate && (
                        <Checkbox
                          checked={case_.selected}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(case_.id);
                          }}
                        />
                      )}
                      <div className="flex-1" onClick={() => navigate(`/logistica/caso/${case_.id}`)}>
                        <div className="text-sm space-y-2">
                          <p className="font-medium">Caso #{case_.id}</p>
                          <p>{case_.storeName}</p>
                          <p className="text-gray-600">{case_.address}</p>
                          <p>Marca: {case_.brand}</p>
                          {case_.printDate && <p>Impresso em: {new Date(case_.printDate).toLocaleDateString()}</p>}
                          {case_.trackingCode && (
                            <>
                              <p>Rastreio: {case_.trackingCode}</p>
                              <p>Status: {case_.deliveryStatus}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}