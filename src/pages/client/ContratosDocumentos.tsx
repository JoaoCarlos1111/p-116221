
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Calendar,
  Shield,
  Receipt,
  FileSpreadsheet,
  Eye,
  Search
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ContratosDocumentos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [anoFilter, setAnoFilter] = useState('all');

  const documentos = [
    {
      id: 'DOC-001',
      nome: 'Contrato de Prestação de Serviços - 2024',
      tipo: 'Contrato',
      dataUpload: '2024-01-15',
      dataVencimento: '2024-12-31',
      tamanho: '2.5 MB',
      formato: 'PDF',
      status: 'Ativo',
      descricao: 'Contrato principal de prestação de serviços anti-pirataria'
    },
    {
      id: 'DOC-002',
      nome: 'Relatório Financeiro - Janeiro 2024',
      tipo: 'Relatório',
      dataUpload: '2024-02-05',
      dataVencimento: null,
      tamanho: '1.8 MB',
      formato: 'PDF',
      status: 'Disponível',
      descricao: 'Relatório mensal de atividades e resultados financeiros'
    },
    {
      id: 'DOC-003',
      nome: 'Nota Fiscal - Fevereiro 2024',
      tipo: 'Nota Fiscal',
      dataUpload: '2024-03-01',
      dataVencimento: null,
      tamanho: '512 KB',
      formato: 'PDF',
      status: 'Disponível',
      descricao: 'Nota fiscal referente aos serviços prestados em fevereiro'
    },
    {
      id: 'DOC-004',
      nome: 'Relatório de Performance Q1 2024',
      tipo: 'Relatório',
      dataUpload: '2024-04-02',
      dataVencimento: null,
      tamanho: '3.2 MB',
      formato: 'PDF',
      status: 'Disponível',
      descricao: 'Relatório trimestral de performance e resultados'
    },
    {
      id: 'DOC-005',
      nome: 'Termo Aditivo - Expansão de Serviços',
      tipo: 'Contrato',
      dataUpload: '2024-02-20',
      dataVencimento: '2024-12-31',
      tamanho: '1.1 MB',
      formato: 'PDF',
      status: 'Ativo',
      descricao: 'Termo aditivo para inclusão de serviços blockchain/NFT'
    },
    {
      id: 'DOC-006',
      nome: 'Planilha de Custos Detalhada - Q1',
      tipo: 'Planilha',
      dataUpload: '2024-04-05',
      dataVencimento: null,
      tamanho: '890 KB',
      formato: 'Excel',
      status: 'Disponível',
      descricao: 'Detalhamento completo dos custos por tipo de serviço'
    }
  ];

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Contrato': return <Shield className="h-4 w-4" />;
      case 'Relatório': return <FileText className="h-4 w-4" />;
      case 'Nota Fiscal': return <Receipt className="h-4 w-4" />;
      case 'Planilha': return <FileSpreadsheet className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Contrato': return 'bg-blue-100 text-blue-800';
      case 'Relatório': return 'bg-green-100 text-green-800';
      case 'Nota Fiscal': return 'bg-purple-100 text-purple-800';
      case 'Planilha': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Disponível': return 'bg-blue-100 text-blue-800';
      case 'Vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'all' || doc.tipo === tipoFilter;
    const matchesAno = anoFilter === 'all' || doc.dataUpload.includes(anoFilter);
    return matchesSearch && matchesTipo && matchesAno;
  });

  const categoriasDocs = {
    'Contratos': filteredDocumentos.filter(d => d.tipo === 'Contrato'),
    'Relatórios': filteredDocumentos.filter(d => d.tipo === 'Relatório'),
    'Notas Fiscais': filteredDocumentos.filter(d => d.tipo === 'Nota Fiscal'),
    'Planilhas': filteredDocumentos.filter(d => d.tipo === 'Planilha')
  };

  const handleDownload = (documento) => {
    console.log(`Baixando documento: ${documento.nome}`);
    // Lógica para download do documento
  };

  const handlePreview = (documento) => {
    console.log(`Visualizando documento: ${documento.nome}`);
    // Lógica para preview do documento
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Contratos e Documentos</h1>
          <p className="text-muted-foreground">Área para acessar contratos, relatórios e documentos fiscais</p>
        </div>
        <Button onClick={() => navigate('/client/financeiro/dashboard')}>
          Voltar ao Dashboard
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Nome do documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Documento</label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Contrato">Contratos</SelectItem>
                  <SelectItem value="Relatório">Relatórios</SelectItem>
                  <SelectItem value="Nota Fiscal">Notas Fiscais</SelectItem>
                  <SelectItem value="Planilha">Planilhas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ano</label>
              <Select value={anoFilter} onValueChange={setAnoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os anos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo por Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(categoriasDocs).map(([categoria, docs]) => (
          <Card key={categoria}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{docs.length}</div>
                <p className="text-sm text-muted-foreground">{categoria}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Disponíveis ({filteredDocumentos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocumentos.map((documento) => (
              <div key={documento.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getTipoIcon(documento.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{documento.nome}</h4>
                      <Badge className={getTipoColor(documento.tipo)}>
                        {documento.tipo}
                      </Badge>
                      <Badge className={getStatusColor(documento.status)}>
                        {documento.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{documento.descricao}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Upload: {new Date(documento.dataUpload).toLocaleDateString('pt-BR')}
                      </span>
                      {documento.dataVencimento && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Vence: {new Date(documento.dataVencimento).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      <span>{documento.tamanho}</span>
                      <span>{documento.formato}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handlePreview(documento)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(documento)}>
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações Importantes */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p>Os contratos são atualizados automaticamente quando há renovações ou aditivos.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p>Relatórios financeiros mensais ficam disponíveis até o 5º dia útil do mês seguinte.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p>Notas fiscais são emitidas conforme os serviços prestados e marcos contratuais.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p>Todos os documentos são armazenados com segurança e criptografia de ponta a ponta.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContratosDocumentos;
