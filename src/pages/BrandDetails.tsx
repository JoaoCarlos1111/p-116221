
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Users, Bookmark, GitBranch, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Brand {
  id: string;
  name: string;
  company: string;
  document: string;
  status: "active" | "validating" | "inactive";
  analyst: string;
  lastUpdate: string;
  classification: string;
  createdAt: string;
  notes: string;
  tags: string[];
  companyGroup: {
    name: string;
    document: string;
    contact: {
      name: string;
      email: string;
      phone: string;
    };
    contract: {
      status: "active" | "inactive" | "negotiating";
      signedAt: string;
      expiresAt: string;
    };
    users: Array<{
      name: string;
      role: string;
    }>;
  };
  inpiRegistrations: Array<{
    id: string;
    number: string;
    class: string;
    status: "active" | "analyzing" | "extinct";
    owner: string;
    validUntil: string;
    publicUrl?: string;
  }>;
}

export default function BrandDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("brand");
  
  // Mock data - replace with API call
  const [brand, setBrand] = useState<Brand>({
    id: "1",
    name: "Nike",
    company: "Nike Inc.",
    document: "12.345.678/0001-90",
    status: "active",
    analyst: "John Doe",
    lastUpdate: "2024-01-24",
    classification: "Esportes",
    createdAt: "2023-12-01",
    notes: "Marca premium no segmento esportivo",
    tags: ["Premium", "Esportes", "Internacional"],
    companyGroup: {
      name: "Nike Group",
      document: "12.345.678/0001-90",
      contact: {
        name: "Jane Smith",
        email: "jane@nike.com",
        phone: "(11) 99999-9999"
      },
      contract: {
        status: "active",
        signedAt: "2023-01-01",
        expiresAt: "2024-12-31"
      },
      users: [
        { name: "John Smith", role: "Admin" },
        { name: "Mary Johnson", role: "Viewer" }
      ]
    },
    inpiRegistrations: [
      {
        id: "reg1",
        number: "123456789",
        class: "25",
        status: "active",
        owner: "Nike Inc.",
        validUntil: "2030-12-31",
        publicUrl: "https://busca.inpi.gov.br"
      }
    ]
  });

  const getStatusBadge = (status: Brand['status']) => {
    const variants = {
      active: "success",
      validating: "warning",
      inactive: "destructive"
    };
    const labels = {
      active: "Ativa",
      validating: "Em validação",
      inactive: "Inativa"
    };
    return <Badge variant={variants[status] as any}>{labels[status]}</Badge>;
  };

  const handleSave = async () => {
    try {
      // Implement API call to save changes
      console.log("Saving brand:", brand);
      // await api.put(`/brands/${id}`, brand);
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setBrand(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompanyGroupChange = (field: string, value: any) => {
    setBrand(prev => ({
      ...prev,
      companyGroup: {
        ...prev.companyGroup,
        [field]: value
      }
    }));
  };

  const handleContactChange = (field: string, value: any) => {
    setBrand(prev => ({
      ...prev,
      companyGroup: {
        ...prev.companyGroup,
        contact: {
          ...prev.companyGroup.contact,
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Input 
                value={brand.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="text-2xl font-bold"
              />
              <Input 
                value={brand.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="text-muted-foreground"
              />
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground">CNPJ</p>
              <Input 
                value={brand.document}
                onChange={(e) => handleChange('document', e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Select 
                value={brand.status}
                onValueChange={(value: Brand['status']) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="validating">Em validação</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Analista</p>
              <Input 
                value={brand.analyst}
                onChange={(e) => handleChange('analyst', e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="brand" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Dados da Marca
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Empresa / Grupo
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="inpi" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Registros INPI
          </TabsTrigger>
          <TabsTrigger value="cases" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Fluxo de Casos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Marca</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <Input 
                    value={brand.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classificação</p>
                  <Input 
                    value={brand.classification}
                    onChange={(e) => handleChange('classification', e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Inclusão</p>
                  <Input 
                    type="date"
                    value={brand.createdAt}
                    onChange={(e) => handleChange('createdAt', e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Select 
                    value={brand.status}
                    onValueChange={(value: Brand['status']) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="validating">Em validação</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <Input 
                  value={brand.tags.join(', ')}
                  onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                  placeholder="Separe as tags com vírgula"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Observações</p>
                <Textarea 
                  value={brand.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Empresa / Grupo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome do Grupo</p>
                  <Input 
                    value={brand.companyGroup.name}
                    onChange={(e) => handleCompanyGroupChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CNPJ</p>
                  <Input 
                    value={brand.companyGroup.document}
                    onChange={(e) => handleCompanyGroupChange('document', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2">Contato Principal</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <Input 
                      value={brand.companyGroup.contact.name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <Input 
                      value={brand.companyGroup.contact.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <Input 
                      value={brand.companyGroup.contact.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Contrato</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Select 
                      value={brand.companyGroup.contract.status}
                      onValueChange={(value) => handleCompanyGroupChange('contract', {...brand.companyGroup.contract, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="negotiating">Em negociação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assinatura</p>
                    <Input 
                      type="date"
                      value={brand.companyGroup.contract.signedAt}
                      onChange={(e) => handleCompanyGroupChange('contract', {...brand.companyGroup.contract, signedAt: e.target.value})}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiração</p>
                    <Input 
                      type="date"
                      value={brand.companyGroup.contract.expiresAt}
                      onChange={(e) => handleCompanyGroupChange('contract', {...brand.companyGroup.contract, expiresAt: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Acessos</p>
                <div className="grid gap-2">
                  {brand.companyGroup.users.map((user, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        value={user.name}
                        onChange={(e) => {
                          const newUsers = [...brand.companyGroup.users];
                          newUsers[index] = { ...user, name: e.target.value };
                          handleCompanyGroupChange('users', newUsers);
                        }}
                      />
                      <Select
                        value={user.role}
                        onValueChange={(value) => {
                          const newUsers = [...brand.companyGroup.users];
                          newUsers[index] = { ...user, role: value };
                          handleCompanyGroupChange('users', newUsers);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newUsers = [...brand.companyGroup.users, { name: '', role: 'Viewer' }];
                      handleCompanyGroupChange('users', newUsers);
                    }}
                  >
                    Adicionar Usuário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documentos</CardTitle>
              <Button>+ Adicionar Documento</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Contrato.pdf</p>
                        <p className="text-sm text-muted-foreground">Adicionado em 15/01/2024</p>
                      </div>
                    </div>
                    <Button variant="ghost">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Procuração.pdf</p>
                        <p className="text-sm text-muted-foreground">Adicionado em 15/01/2024</p>
                      </div>
                    </div>
                    <Button variant="ghost">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Certificado.pdf</p>
                        <p className="text-sm text-muted-foreground">Adicionado em 15/01/2024</p>
                      </div>
                    </div>
                    <Button variant="ghost">Download</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inpi" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Registros no INPI</CardTitle>
              <Button onClick={() => {
                const newRegistration = {
                  id: `reg${brand.inpiRegistrations.length + 1}`,
                  number: '',
                  class: '',
                  status: 'active' as const,
                  owner: brand.company,
                  validUntil: new Date().toISOString().split('T')[0],
                  publicUrl: ''
                };
                handleChange('inpiRegistrations', [...brand.inpiRegistrations, newRegistration]);
              }}>
                + Novo Registro
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {brand.inpiRegistrations.map((reg, index) => (
                  <div key={reg.id} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Número do Processo</p>
                        <Input
                          value={reg.number}
                          onChange={(e) => {
                            const newRegistrations = [...brand.inpiRegistrations];
                            newRegistrations[index] = { ...reg, number: e.target.value };
                            handleChange('inpiRegistrations', newRegistrations);
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Classe</p>
                        <Input
                          value={reg.class}
                          onChange={(e) => {
                            const newRegistrations = [...brand.inpiRegistrations];
                            newRegistrations[index] = { ...reg, class: e.target.value };
                            handleChange('inpiRegistrations', newRegistrations);
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Situação</p>
                        <Select
                          value={reg.status}
                          onValueChange={(value) => {
                            const newRegistrations = [...brand.inpiRegistrations];
                            newRegistrations[index] = { ...reg, status: value as any };
                            handleChange('inpiRegistrations', newRegistrations);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Vigente</SelectItem>
                            <SelectItem value="analyzing">Em análise</SelectItem>
                            <SelectItem value="extinct">Extinto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Titular</p>
                        <Input
                          value={reg.owner}
                          onChange={(e) => {
                            const newRegistrations = [...brand.inpiRegistrations];
                            newRegistrations[index] = { ...reg, owner: e.target.value };
                            handleChange('inpiRegistrations', newRegistrations);
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vigência</p>
                        <Input
                          type="date"
                          value={reg.validUntil}
                          onChange={(e) => {
                            const newRegistrations = [...brand.inpiRegistrations];
                            newRegistrations[index] = { ...reg, validUntil: e.target.value };
                            handleChange('inpiRegistrations', newRegistrations);
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">URL Pública</p>
                        <Input
                          value={reg.publicUrl}
                          onChange={(e) => {
                            const newRegistrations = [...brand.inpiRegistrations];
                            newRegistrations[index] = { ...reg, publicUrl: e.target.value };
                            handleChange('inpiRegistrations', newRegistrations);
                          }}
                          placeholder="https://"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fluxo de Casos</CardTitle>
              <Button>+ Novo Caso</Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Implementar visualização de casos</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
