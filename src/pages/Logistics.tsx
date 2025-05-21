
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Printer, CircleCheck, Send, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
}

export default function Logistics() {
  const [cases, setCases] = useState<Case[]>([]);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const columns = [
    {
      title: "✅ Aprovado",
      cases: cases.filter(c => !c.printDate && !c.trackingCode),
      color: "bg-green-50"
    },
    {
      title: "🖨️ Fila de Impressão",
      cases: cases.filter(c => c.printDate && !c.trackingCode),
      color: "bg-gray-50"
    },
    {
      title: "📬 Postado",
      cases: cases.filter(c => c.trackingCode),
      color: "bg-blue-50"
    }
  ];

  const handlePrint = (caseId: string) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, printDate: new Date().toISOString(), status: 'Impresso' };
      }
      return c;
    }));
    toast({ description: "Notificação enviada para impressão" });
  };

  const handlePost = async (caseId: string) => {
    // Simulating API call to Correios
    const trackingCode = `BR${Math.random().toString(36).substring(7).toUpperCase()}`;
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, trackingCode, status: 'Em trânsito' };
      }
      return c;
    }));
    toast({ description: "Notificação postada com sucesso" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban de Notificações - Logística</h1>
      
      <div className="flex gap-4 mb-6">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-40"
        />
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="marca1">Marca 1</SelectItem>
            <SelectItem value="marca2">Marca 2</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="impressao">Fila de Impressão</SelectItem>
            <SelectItem value="postado">Postado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.title} className={`${column.color} p-4 rounded-lg`}>
            <h2 className="font-semibold mb-4">{column.title}</h2>
            <div className="space-y-4">
              {column.cases.map((case_) => (
                <Card key={case_.id} className="bg-white">
                  <CardContent className="p-4">
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
                      <div className="mt-4">
                        {!case_.printDate && (
                          <Button onClick={() => handlePrint(case_.id)} className="w-full">
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir Notificação
                          </Button>
                        )}
                        {case_.printDate && !case_.trackingCode && (
                          <Button onClick={() => handlePost(case_.id)} className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            Marcar como Postado
                          </Button>
                        )}
                        {case_.trackingCode && (
                          <Button variant="outline" className="w-full">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Atualizar Rastreamento
                          </Button>
                        )}
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
