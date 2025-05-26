
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  FileText,
  PieChart,
  BarChart3,
  Target,
  Percent
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const FinanceiroDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalIndenizacoesMes: 125000,
    totalIndenizacoesTrimestre: 340000,
    totalIndenizacoesAno: 1200000,
    valorLiquidoRepasse: 87500,
    percentualTotall: 30,
    percentualCliente: 70,
    custosOperacionais: 37500,
    projecaoRecebimentos: 95000,
    totalCasos: 156,
    paginasDerrubadas: 342,
    notificacoesEnviadas: 578
  });

  const performanceData = [
    { mes: 'Jan', indenizacoes: 95000, recebidos: 85000, custoMedio: 542 },
    { mes: 'Fev', indenizacoes: 110000, recebidos: 98000, custoMedio: 520 },
    { mes: 'Mar', indenizacoes: 125000, recebidos: 115000, custoMedio: 498 },
    { mes: 'Abr', indenizacoes: 140000, recebidos: 128000, custoMedio: 485 },
  ];

  const servicosData = [
    { tipo: 'Notificações', casos: 45, valor: 22500 },
    { tipo: 'Acordos Extrajudiciais', casos: 28, valor: 56000 },
    { tipo: 'Desativações', casos: 67, valor: 33500 },
    { tipo: 'Blockchain/NFT', casos: 16, valor: 12800 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">Visão estratégica e projeções financeiras</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/client/financeiro/faturas')}>
            <FileText className="h-4 w-4 mr-2" />
            Ver Faturas
          </Button>
          <Button onClick={() => navigate('/client/financeiro/historico')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indenizações (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalIndenizacoesMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-600">+13.5% vs mês anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Líquido Repasse</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.valorLiquidoRepasse.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.percentualCliente}% do total arrecadado
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projeção Recebimentos</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.projecaoRecebimentos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Parcelas em aberto
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Totall</CardTitle>
            <Percent className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.percentualTotall}%</div>
            <p className="text-xs text-muted-foreground">
              Custos operacionais inclusos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Trimestral e Anual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Trimestral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Total Indenizações</span>
                  <span className="font-medium">
                    {stats.totalIndenizacoesTrimestre.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Meta Trimestral</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cliente ({stats.percentualCliente}%)</span>
                <span className="font-medium text-green-600">
                  {stats.valorLiquidoRepasse.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Totall ({stats.percentualTotall}%)</span>
                <span className="font-medium text-blue-600">
                  {stats.custosOperacionais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações de Combate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total de Casos</span>
                <Badge variant="secondary">{stats.totalCasos}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Páginas Derrubadas</span>
                <Badge variant="secondary">{stats.paginasDerrubadas}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Notificações Enviadas</span>
                <Badge variant="secondary">{stats.notificacoesEnviadas}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Período */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Período</th>
                  <th className="text-right p-2">Indenizações</th>
                  <th className="text-right p-2">Valores Recebidos</th>
                  <th className="text-right p-2">Custo Médio/Caso</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((item) => (
                  <tr key={item.mes} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{item.mes}</td>
                    <td className="p-2 text-right">
                      {item.indenizacoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-2 text-right">
                      {item.recebidos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-2 text-right">
                      {item.custoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Serviços por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados por Tipo de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicosData.map((servico) => (
              <div key={servico.tipo} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{servico.tipo}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Casos:</span>
                    <span className="font-medium">{servico.casos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Valor:</span>
                    <span className="font-medium">
                      {servico.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroDashboard;
