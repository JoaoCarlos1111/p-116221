
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, User, Calendar, Building, MapPin, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryEntry {
  id: string;
  timestamp: string;
  department: string;
  analyst: string;
  action: string;
  description: string;
  details?: Record<string, any>;
}

export default function CaseHistoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with API call
  const caseData = {
    id,
    brand: "Nike",
    store: "Loja Exemplo",
    status: "Em Análise",
    links: [
      "https://exemplo.com/produto1",
      "https://exemplo.com/produto2"
    ],
    debtorInfo: {
      name: "João Silva",
      document: "123.456.789-00",
      phone: "(11) 99999-9999",
      email: "joao@exemplo.com"
    },
    address: {
      street: "Rua Exemplo",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    history: [
      {
        id: "1",
        timestamp: "2024-03-26T10:00:00",
        department: "Verificação",
        analyst: "Maria Santos",
        action: "Criação",
        description: "Caso criado no sistema",
        details: {
          links: ["https://exemplo.com/produto1"]
        }
      },
      {
        id: "2",
        timestamp: "2024-03-26T10:30:00",
        department: "Verificação",
        analyst: "Maria Santos",
        action: "Atualização",
        description: "Adicionado novo link suspeito",
        details: {
          addedLinks: ["https://exemplo.com/produto2"]
        }
      },
      {
        id: "3",
        timestamp: "2024-03-26T11:00:00",
        department: "Logística",
        analyst: "Pedro Souza",
        action: "Notificação",
        description: "Notificação extrajudicial enviada",
        details: {
          trackingCode: "BR123456789"
        }
      }
    ] as HistoryEntry[]
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Histórico do Caso #{id}</h1>
          <p className="text-sm text-muted-foreground">Histórico completo de ações</p>
        </div>
        <Badge className="ml-auto">{caseData.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Marca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{caseData.brand}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{caseData.store}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links Suspeitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {caseData.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {link}
                </a>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Responsável</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p>{caseData.debtorInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documento</p>
              <p>{caseData.debtorInfo.document}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p>{caseData.debtorInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p>{caseData.debtorInfo.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p>{caseData.address.street}, {caseData.address.number}</p>
                <p>{caseData.address.neighborhood}</p>
                <p>{caseData.address.city} - {caseData.address.state}</p>
                <p>{caseData.address.zipCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Analista</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseData.history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>{entry.department}</TableCell>
                    <TableCell>{entry.analyst}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.action}</Badge>
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>
                      {entry.details && (
                        <div className="text-sm">
                          {Object.entries(entry.details).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium">{key}: </span>
                              {Array.isArray(value) ? (
                                <div className="ml-2">
                                  {value.map((item, i) => (
                                    <div key={i}>{item}</div>
                                  ))}
                                </div>
                              ) : (
                                <span>{String(value)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
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
