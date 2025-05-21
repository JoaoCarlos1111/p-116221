
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface LinkSet {
  id: string;
  storeUrl: string;
  adUrl: string;
  brand: string;
}

const mockBrands = ['Nike', 'Adidas', 'Puma', 'Under Armour'];
const mockData = [
  { day: '01/03', cases: 12 },
  { day: '02/03', cases: 15 },
  { day: '03/03', cases: 8 },
  { day: '04/03', cases: 22 },
  { day: '05/03', cases: 17 },
];

export default function Prospeccao() {
  const [linkSets, setLinkSets] = useState<LinkSet[]>([{ 
    id: '1', 
    storeUrl: '', 
    adUrl: '', 
    brand: '' 
  }]);
  const [existingStore, setExistingStore] = useState<string | null>(null);

  const handleAddLinkSet = () => {
    setLinkSets([...linkSets, { 
      id: Date.now().toString(), 
      storeUrl: '', 
      adUrl: '', 
      brand: '' 
    }]);
  };

  const handleUrlChange = (id: string, field: 'storeUrl' | 'adUrl', value: string) => {
    setLinkSets(linkSets.map(set => {
      if (set.id === id) {
        // Simulate store check
        if (field === 'storeUrl' && value.includes('store.example.com')) {
          setExistingStore('Nike');
        } else if (field === 'storeUrl') {
          setExistingStore(null);
        }
        return { ...set, [field]: value };
      }
      return set;
    }));
  };

  const handleSubmit = () => {
    // Implementation for case submission
    console.log('Submitting cases:', linkSets);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">Workflow de Prospecção</h1>
        <p className="text-muted-foreground">Adicione lojas e anúncios suspeitos para análise de verificação</p>
      </header>

      <Card className="p-6">
        <div className="space-y-4">
          {linkSets.map((set) => (
            <div key={set.id} className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Link da Loja"
                  value={set.storeUrl}
                  onChange={(e) => handleUrlChange(set.id, 'storeUrl', e.target.value)}
                />
                {existingStore && (
                  <Alert variant="warning" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Essa loja já foi adicionada anteriormente por {existingStore}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <Input
                placeholder="Link do Anúncio"
                value={set.adUrl}
                onChange={(e) => handleUrlChange(set.id, 'adUrl', e.target.value)}
              />
              
              <Select 
                value={set.brand}
                onValueChange={(value) => {
                  setLinkSets(linkSets.map(s => 
                    s.id === set.id ? { ...s, brand: value } : s
                  ));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {mockBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
          <Button variant="outline" onClick={handleAddLinkSet} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar novo link
          </Button>

          <Button onClick={handleSubmit} className="w-full">
            Adicionar Caso
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Meta Diária</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Hoje</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Semana</p>
              <p className="text-2xl font-bold">74</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Mês</p>
              <p className="text-2xl font-bold">286</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Casos Recentes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loja</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">store{i+1}.example.com</TableCell>
                  <TableCell>{mockBrands[i]}</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge>Recebido</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
