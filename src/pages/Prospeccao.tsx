import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, AlertCircle, Store, Link2, BoxSelect, ChevronRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import { CasesService } from "@/services/api";

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
  const { toast } = useToast();
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

  const handleSubmit = async () => {
    try {
      // Validar se todos os campos necessários estão preenchidos
      const invalidSets = linkSets.filter(set => !set.storeUrl || !set.adUrl || !set.brand);
      if (invalidSets.length > 0) {
        toast({
          variant: "destructive",
          title: "Erro ao criar casos",
          description: "Preencha todos os campos obrigatórios"
        });
        return;
      }

      // Agrupar URLs por marca
      const brandGroups = linkSets.reduce((acc, set) => {
        if (!acc[set.brand]) {
          acc[set.brand] = {
            brand: set.brand,
            storeUrls: new Set(),
            adUrls: new Set()
          };
        }
        acc[set.brand].storeUrls.add(set.storeUrl);
        acc[set.brand].adUrls.add(set.adUrl);
        return acc;
      }, {} as Record<string, { brand: string; storeUrls: Set<string>; adUrls: Set<string> }>);

      // Criar casos para cada marca
      const results = await Promise.all(
        Object.values(brandGroups).map(group => 
          CasesService.create({
            storeUrl: Array.from(group.storeUrls).join('\n'),
            adUrl: Array.from(group.adUrls).join('\n'),
            brands: [group.brand]
          })
        )
      );

      toast({
        title: "Casos criados com sucesso",
        description: `${results.length} casos foram enviados para verificação`
      });

      // Limpar formulário
      setLinkSets([{ id: Date.now().toString(), storeUrl: '', adUrl: '', brand: '' }]);
    } catch (error) {
      console.error('Erro ao criar casos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar casos",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar os casos para verificação"
      });
    }
  };

  const cardStyle = "glass-card hover-scale";
  const headerStyle = "text-xl font-semibold";
  const subHeaderStyle = "text-sm text-muted-foreground";
  const valueStyle = "text-2xl font-bold";

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold text-primary">Workflow de Prospecção</h1>
        <p className="text-base text-muted-foreground">Adicione lojas e anúncios suspeitos para análise de verificação</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader className="p-6 pb-3">
          <h2 className="text-xl font-semibold">Adicionar Novo Caso</h2>
          <p className="text-sm text-muted-foreground">Cadastre novos casos para análise</p>
        </CardHeader>
        <CardContent className="p-6 pt-3 space-y-6">
          {linkSets.map((set) => (
            <div key={set.id} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Link da Loja"
                    value={set.storeUrl}
                    onChange={(e) => handleUrlChange(set.id, 'storeUrl', e.target.value)}
                  />
                </div>
                {existingStore && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Essa loja já foi adicionada anteriormente por {existingStore}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Link do Anúncio"
                  value={set.adUrl}
                  onChange={(e) => handleUrlChange(set.id, 'adUrl', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <BoxSelect className="h-4 w-4 text-muted-foreground" />
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
            </div>
          ))}

          <div className="flex flex-col space-y-4">
            <Button variant="outline" onClick={handleAddLinkSet} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar novo link
            </Button>

            <Button onClick={handleSubmit} className="w-full">
              <ChevronRight className="h-4 w-4 mr-2" />
              Adicionar Caso
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">Meta Diária</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cases" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
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
          </CardContent>
        </Card>

        <Card className={`${cardStyle} mb-8`}>
        <CardHeader className="p-6 pb-3">
          <CardTitle className={headerStyle}>Casos Recentes</CardTitle>
          <p className={subHeaderStyle}>Lista dos últimos casos cadastrados no sistema</p>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Loja</TableHead>
                <TableHead className="font-semibold">Marca</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {[1, 2, 3].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">store{i+1}.example.com</TableCell>
                    <TableCell>{mockBrands[i]}</TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Recebido</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}