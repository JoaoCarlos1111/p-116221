
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PieChart, 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Target,
  Award,
  FileText,
  Shield
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DetalhesServicos = () => {
  const navigate = useNavigate();
  const [periodoFilter, setPeriodoFilter] = useState('mes');

  const servicosData = [
    {
      tipo: 'Notificações',
      icone: <FileText className="h-6 w-6" />,
      totalCasos: 45,
      valorBruto: 67500,
      percentualTotall: 25,
      valorTotall: 16875,
      valorCliente: 50625,
      custoMedio: 1500,
      tempoMedio: '15 dias',
      taxaSucesso: 89,
      descricao: 'Notificações extrajudiciais para remoção de conteúdo'
    },
    {
      tipo: 'Acordos Extrajudiciais',
      icone: <Award className="h-6 w-6" />,
      totalCasos: 28,
      valorBruto: 168000,
      percentualTotall: 30,
      valorTotall: 50400,
      valorCliente: 117600,
      custoMedio: 6000,
      tempoMedio: '45 dias',
      taxaSucesso: 95,
      descricao: 'Acordos negociados para resolução amigável'
    },
    {
      tipo: 'Desativações',
      icone: <Shield className="h-6 w-6" />,
      totalCasos: 67,
      valorBruto: 100500,
      percentualTotall: 20,
      valorTotall: 20100,
      valorCliente: 80400,
      custoMedio: 1500,
      tempoMedio: '7 dias',
      taxaSucesso: 98,
      descricao: 'Desativação voluntária de páginas ou conteúdos'
    },
    {
      tipo: 'Blockchain/NFT',
      icone: <Target className="h-6 w-6" />,
      totalCasos: 16,
      valorBruto: 96000,
      percentualTotall: 35,
      valorTotall: 33600,
      valorCliente: 62400,
      custoMedio: 6000,
      tempoMedio: '60 dias',
      taxaSucesso: 75,
      descricao: 'Casos especializados envolvendo tecnologia blockchain'
    }
  ];

  const resumoGeral = {
    totalBruto: servicosData.reduce((acc, s) => acc + s.valorBruto, 0),
    totalTotall: servicosData.reduce((acc, s) => acc + s.valorTotall, 0),
    totalCliente: servicosData.reduce((acc, s) => acc + s.valorCliente, 0),
    totalCasos: servicosData.reduce((acc, s) => acc + s.totalCasos, 0),
    taxaMediaSucesso: servicosData.reduce((acc, s, i, arr) => acc + s.taxaSucesso / arr.length, 0)
  };

  const periodoLabels = {
    'mes': 'Este Mês',
    'trimestre': 'Este Trimestre',
    'ano': 'Este Ano'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Detalhes de Serviços</h1>
          <p className="text-muted-foreground">Composição dos custos por tipo de ação</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/client/financeiro/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bruto</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resumoGeral.totalBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {resumoGeral.totalCasos} casos {periodoLabels[periodoFilter].toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Cliente</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resumoGeral.totalCliente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {((resumoGeral.totalCliente / resumoGeral.totalBruto) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Totall</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resumoGeral.totalTotall.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {((resumoGeral.totalTotall / resumoGeral.totalBruto) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumoGeral.taxaMediaSucesso.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Média geral de sucesso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento por Serviço */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {servicosData.map((servico) => (
          <Card key={servico.tipo} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {servico.icone}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{servico.tipo}</CardTitle>
                    <p className="text-sm text-muted-foreground">{servico.descricao}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {servico.totalCasos}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Valores */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Bruto</p>
                    <p className="text-xl font-bold">
                      {servico.valorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Custo Médio</p>
                    <p className="text-xl font-bold">
                      {servico.custoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>

                {/* Distribuição */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cliente ({100 - servico.percentualTotall}%)</span>
                      <span className="font-medium text-green-600">
                        {servico.valorCliente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <Progress 
                      value={100 - servico.percentualTotall} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Totall ({servico.percentualTotall}%)</span>
                      <span className="font-medium text-blue-600">
                        {servico.valorTotall.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <Progress 
                      value={servico.percentualTotall} 
                      className="h-2" 
                    />
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Médio</p>
                    <p className="font-medium">{servico.tempoMedio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{servico.taxaSucesso}%</p>
                      <Progress value={servico.taxaSucesso} className="h-1 flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparativo de Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo de Performance por Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Tipo de Serviço</th>
                  <th className="text-center p-3">Casos</th>
                  <th className="text-right p-3">Valor Bruto</th>
                  <th className="text-right p-3">Valor Cliente</th>
                  <th className="text-center p-3">% Totall</th>
                  <th className="text-right p-3">Custo Médio</th>
                  <th className="text-center p-3">Taxa Sucesso</th>
                  <th className="text-center p-3">Tempo Médio</th>
                </tr>
              </thead>
              <tbody>
                {servicosData.map((servico) => (
                  <tr key={servico.tipo} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{servico.tipo}</td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary">{servico.totalCasos}</Badge>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {servico.valorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-right font-medium text-green-600">
                      {servico.valorCliente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline">{servico.percentualTotall}%</Badge>
                    </td>
                    <td className="p-3 text-right">
                      {servico.custoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={servico.taxaSucesso >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {servico.taxaSucesso}%
                      </Badge>
                    </td>
                    <td className="p-3 text-center">{servico.tempoMedio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalhesServicos;
