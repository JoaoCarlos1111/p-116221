
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, ChevronRight, Link2, BrandApple, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { CasesService } from "@/services/api";

// Mockados para demonstração
const availableBrands = [
  { id: '1', name: 'Nike' },
  { id: '2', name: 'Adidas' },
  { id: '3', name: 'Puma' },
  { id: '4', name: 'Under Armour' },
  { id: '5', name: 'New Balance' },
  { id: '6', name: 'Reebok' },
];

const mockData = [
  { day: '01/05', cases: 12 },
  { day: '02/05', cases: 15 },
  { day: '03/05', cases: 8 },
  { day: '04/05', cases: 22 },
  { day: '05/05', cases: 17 },
];

// Recentes para a tabela
const recentCases = [
  { id: '1', store: 'fakestore123.com', brand: 'Nike', date: new Date().toLocaleDateString(), status: 'Recebido' },
  { id: '2', store: 'discount-brand.com', brand: 'Adidas', date: new Date().toLocaleDateString(), status: 'Recebido' },
  { id: '3', store: 'super-shoes-outlet.com', brand: 'Puma', date: new Date().toLocaleDateString(), status: 'Recebido' },
];

export default function Prospeccao() {
  const { toast } = useToast();
  const [links, setLinks] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [observations, setObservations] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId) 
        : [...prev, brandId]
    );
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!links.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Adicione pelo menos um link de anúncio"
      });
      return;
    }

    if (selectedBrands.length === 0) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Selecione pelo menos uma marca afetada"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Obter as marcas selecionadas
      const brandsToSubmit = availableBrands
        .filter(brand => selectedBrands.includes(brand.id))
        .map(brand => brand.name);
      
      // Preparar os links (dividir por linha)
      const linksList = links.split(/\n/).filter(link => link.trim().length > 0);
      
      // Criar um caso para cada marca selecionada
      const results = await Promise.all(
        brandsToSubmit.map(brand => 
          CasesService.create({
            storeUrl: '',
            adUrl: linksList.join('\n'),
            brands: [brand],
            observations: observations,
            origin: 'Prospecção',
            status: 'received'
          })
        )
      );

      toast({
        title: "Casos criados com sucesso",
        description: `${results.length} casos foram enviados para verificação`
      });

      // Limpar o formulário após o envio bem-sucedido
      setLinks('');
      setSelectedBrands([]);
      setObservations('');
      
    } catch (error) {
      console.error('Erro ao criar casos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar casos",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar os casos para verificação"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold text-primary">Workflow de Prospecção</h1>
        <p className="text-base text-muted-foreground">Adicione anúncios suspeitos para verificação</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="p-6 pb-3">
              <h2 className="text-xl font-semibold">Adicionar Novo Caso</h2>
              <p className="text-sm text-muted-foreground">Cadastre novos casos para análise</p>
            </CardHeader>
            <CardContent className="p-6 pt-3 space-y-6">
              <div>
                <label className="font-medium flex items-center mb-2">
                  <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  Links dos anúncios suspeitos <span className="text-red-500 ml-1">*</span>
                </label>
                <Textarea 
                  placeholder="Cole os links aqui, um por linha" 
                  className="min-h-32"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Adicione um link por linha. Serão criados cards para cada marca selecionada.
                </p>
              </div>

              <div>
                <label className="font-medium flex items-center mb-2">
                  <BrandApple className="h-4 w-4 mr-2 text-muted-foreground" />
                  Marcas afetadas <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableBrands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`brand-${brand.id}`} 
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={() => handleBrandToggle(brand.id)} 
                      />
                      <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium flex items-center mb-2">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  Observações adicionais
                </label>
                <Textarea 
                  placeholder="Informações adicionais para a equipe de verificação" 
                  className="min-h-20"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full mt-4" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Adicionar Caso
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Meta Diária</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
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
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Casos Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marca</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="font-medium">{caseItem.brand}</TableCell>
                      <TableCell>{caseItem.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{caseItem.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
