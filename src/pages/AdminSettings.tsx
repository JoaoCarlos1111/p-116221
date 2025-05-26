
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import { Settings, Mail, Plug, Building, Bot } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Configurações Gerais
    prazoMovimentacao: 3,
    tipoMovimentacao: 'dias_uteis',
    tempoResposta: 5,
    tipoResposta: 'dias_corridos',
    geracaoAutomatica: true,
    tipoGeracaoPadrao: 'ambos',
    
    // E-mails e Notificações
    remetenteTipo: 'smtp',
    emailRemetente: 'notificacoes@sistema.com.br',
    emailAutomatico: {
      novoCaso: true,
      casoAprovado: true,
      documentoGerado: true,
      acordoCriado: true
    },
    
    // Integrações
    correios: {
      token: '',
      rastreamentoAutomatico: false
    },
    inpi: {
      token: '',
      intervaloAtualizacao: 7
    },
    ia: {
      habilitada: false,
      tipo: 'openai',
      apiKey: '',
      atividades: {
        geracaoTexto: false,
        resumoAutomatico: false,
        sugestaoAcoes: false
      }
    },
    
    // Informações Institucionais
    nomeEmpresa: 'Total Brand Protection',
    emailContato: 'suporte@totalbrandprotection.com.br',
    telefone: '(11) 99999-9999',
    textoRodape: '© 2025 Total Brand Protection. Todos os direitos reservados.',
    politicaPrivacidade: '',
    termosUso: ''
  });

  const [emailTemplates, setEmailTemplates] = useState({
    novoCaso: {
      assunto: 'Novo caso criado - {{nome_marca}}',
      corpo: 'Olá {{nome_cliente}},\n\nUm novo caso foi criado para a marca {{nome_marca}}.\n\nDetalhes:\n- Número do caso: {{numero_caso}}\n- Data: {{data_criacao}}\n\nAtenciosamente,\nEquipe {{nome_empresa}}'
    },
    casoAprovado: {
      assunto: 'Caso aprovado - {{nome_marca}}',
      corpo: 'Olá {{nome_cliente}},\n\nO caso {{numero_caso}} da marca {{nome_marca}} foi aprovado e está em andamento.\n\nAtenciosamente,\nEquipe {{nome_empresa}}'
    },
    documentoGerado: {
      assunto: 'Documento gerado - {{nome_marca}}',
      corpo: 'Olá {{nome_cliente}},\n\nUm novo documento foi gerado para o caso {{numero_caso}} da marca {{nome_marca}}.\n\nAtenciosamente,\nEquipe {{nome_empresa}}'
    },
    acordoCriado: {
      assunto: 'Acordo criado - {{nome_marca}}',
      corpo: 'Olá {{nome_cliente}},\n\nUm acordo foi criado para o caso {{numero_caso}} da marca {{nome_marca}}.\n\nAtenciosamente,\nEquipe {{nome_empresa}}'
    }
  });

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement API call to save settings
      console.log('Saving settings:', settings);
      console.log('Email templates:', emailTemplates);
      
      toast({
        title: "Configurações salvas",
        description: "Todas as configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const updateEmailTemplate = (type: string, field: string, value: string) => {
    setEmailTemplates(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ajustes de Sistema</h1>
          <p className="text-muted-foreground">Configure as definições gerais da plataforma</p>
        </div>
        <Button onClick={handleSaveSettings}>
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            E-mails
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="institucional" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Institucional
          </TabsTrigger>
          <TabsTrigger value="ia" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Inteligência Artificial
          </TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="geral">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Configurações Gerais</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prazo padrão para movimentação entre setores</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={settings.prazoMovimentacao}
                      onChange={(e) => updateSettings('prazoMovimentacao', parseInt(e.target.value))}
                      className="w-20"
                    />
                    <Select 
                      value={settings.tipoMovimentacao} 
                      onValueChange={(value) => updateSettings('tipoMovimentacao', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dias_uteis">Dias úteis</SelectItem>
                        <SelectItem value="dias_corridos">Dias corridos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tempo limite para resposta do cliente</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={settings.tempoResposta}
                      onChange={(e) => updateSettings('tempoResposta', parseInt(e.target.value))}
                      className="w-20"
                    />
                    <Select 
                      value={settings.tipoResposta} 
                      onValueChange={(value) => updateSettings('tipoResposta', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dias_uteis">Dias úteis</SelectItem>
                        <SelectItem value="dias_corridos">Dias corridos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Ativar geração automática de documentos</Label>
                  <p className="text-sm text-muted-foreground">Gera PDFs com base em templates automaticamente</p>
                </div>
                <Switch
                  checked={settings.geracaoAutomatica}
                  onCheckedChange={(checked) => updateSettings('geracaoAutomatica', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de geração padrão</Label>
                <Select 
                  value={settings.tipoGeracaoPadrao} 
                  onValueChange={(value) => updateSettings('tipoGeracaoPadrao', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notificacao">Notificação</SelectItem>
                    <SelectItem value="acordo">Acordo</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* E-mails e Notificações */}
        <TabsContent value="notificacoes">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">E-mails e Notificações</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Remetente padrão</Label>
                  <Select 
                    value={settings.remetenteTipo} 
                    onValueChange={(value) => updateSettings('remetenteTipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="aws-ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>E-mail remetente</Label>
                  <Input
                    type="email"
                    value={settings.emailRemetente}
                    onChange={(e) => updateSettings('emailRemetente', e.target.value)}
                    placeholder="notificacoes@sistema.com.br"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Ativar e-mail automático para:</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.emailAutomatico).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) => updateSettings(`emailAutomatico.${key}`, checked)}
                      />
                      <Label>
                        {key === 'novoCaso' && 'Novo Caso'}
                        {key === 'casoAprovado' && 'Caso Aprovado'}
                        {key === 'documentoGerado' && 'Documento Gerado'}
                        {key === 'acordoCriado' && 'Acordo Criado'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Modelos de e-mail por etapa</Label>
                <Accordion type="single" collapsible>
                  {Object.entries(emailTemplates).map(([key, template]) => (
                    <AccordionItem key={key} value={key}>
                      <AccordionTrigger>
                        {key === 'novoCaso' && 'Novo Caso'}
                        {key === 'casoAprovado' && 'Caso Aprovado'}
                        {key === 'documentoGerado' && 'Documento Gerado'}
                        {key === 'acordoCriado' && 'Acordo Criado'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Assunto</Label>
                          <Input
                            value={template.assunto}
                            onChange={(e) => updateEmailTemplate(key, 'assunto', e.target.value)}
                            placeholder="Assunto do e-mail"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Corpo do e-mail</Label>
                          <Textarea
                            value={template.corpo}
                            onChange={(e) => updateEmailTemplate(key, 'corpo', e.target.value)}
                            placeholder="Corpo do e-mail"
                            rows={6}
                          />
                          <p className="text-xs text-muted-foreground">
                            Campos disponíveis: {`{{nome_cliente}}, {{nome_marca}}, {{numero_caso}}, {{data_criacao}}, {{nome_empresa}}`}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integrações */}
        <TabsContent value="integracoes">
          <div className="space-y-6">
            {/* Correios */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Integração Correios</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Token da API Correios</Label>
                  <Input
                    type="password"
                    value={settings.correios.token}
                    onChange={(e) => updateSettings('correios.token', e.target.value)}
                    placeholder="Token de acesso da API dos Correios"
                  />
                  <p className="text-sm text-muted-foreground">Usado para rastreamento e status</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Ativar rastreamento automático</Label>
                    <p className="text-sm text-muted-foreground">Atualiza automaticamente o status dos envios</p>
                  </div>
                  <Switch
                    checked={settings.correios.rastreamentoAutomatico}
                    onCheckedChange={(checked) => updateSettings('correios.rastreamentoAutomatico', checked)}
                  />
                </div>
              </div>
            </Card>

            {/* INPI */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Integração INPI</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Token de acesso INPI</Label>
                  <Input
                    type="password"
                    value={settings.inpi.token}
                    onChange={(e) => updateSettings('inpi.token', e.target.value)}
                    placeholder="Token de acesso da API do INPI"
                  />
                  <p className="text-sm text-muted-foreground">Para consulta de registros vinculados</p>
                </div>

                <div className="space-y-2">
                  <Label>Intervalo de atualização automática (dias)</Label>
                  <Input
                    type="number"
                    value={settings.inpi.intervaloAtualizacao}
                    onChange={(e) => updateSettings('inpi.intervaloAtualizacao', parseInt(e.target.value))}
                    placeholder="7"
                    className="w-20"
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Informações Institucionais */}
        <TabsContent value="institucional">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Informações Institucionais</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da empresa operadora</Label>
                  <Input
                    value={settings.nomeEmpresa}
                    onChange={(e) => updateSettings('nomeEmpresa', e.target.value)}
                    placeholder="Total Brand Protection"
                  />
                </div>

                <div className="space-y-2">
                  <Label>E-mail de contato</Label>
                  <Input
                    type="email"
                    value={settings.emailContato}
                    onChange={(e) => updateSettings('emailContato', e.target.value)}
                    placeholder="suporte@totalbrandprotection.com.br"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={settings.telefone}
                  onChange={(e) => updateSettings('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label>Texto rodapé</Label>
                <Textarea
                  value={settings.textoRodape}
                  onChange={(e) => updateSettings('textoRodape', e.target.value)}
                  placeholder="© 2025 Total Brand Protection. Todos os direitos reservados."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Política de privacidade</Label>
                <Textarea
                  value={settings.politicaPrivacidade}
                  onChange={(e) => updateSettings('politicaPrivacidade', e.target.value)}
                  placeholder="Digite aqui a política de privacidade..."
                  rows={8}
                />
              </div>

              <div className="space-y-2">
                <Label>Termos de uso</Label>
                <Textarea
                  value={settings.termosUso}
                  onChange={(e) => updateSettings('termosUso', e.target.value)}
                  placeholder="Digite aqui os termos de uso..."
                  rows={8}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Inteligência Artificial */}
        <TabsContent value="ia">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Integrações com IA</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Habilitar sugestões com IA</Label>
                  <p className="text-sm text-muted-foreground">Sugestões de preenchimento, alertas, priorização de casos</p>
                </div>
                <Switch
                  checked={settings.ia.habilitada}
                  onCheckedChange={(checked) => updateSettings('ia.habilitada', checked)}
                />
              </div>

              {settings.ia.habilitada && (
                <>
                  <div className="space-y-2">
                    <Label>Tipo de IA usada</Label>
                    <Select 
                      value={settings.ia.tipo} 
                      onValueChange={(value) => updateSettings('ia.tipo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="claude">Claude</SelectItem>
                        <SelectItem value="huggingface">HuggingFace</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Chave de API da IA</Label>
                    <Input
                      type="password"
                      value={settings.ia.apiKey}
                      onChange={(e) => updateSettings('ia.apiKey', e.target.value)}
                      placeholder="Chave segura da API"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Ativar IA em:</Label>
                    <div className="space-y-3">
                      {Object.entries(settings.ia.atividades).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={value}
                            onCheckedChange={(checked) => updateSettings(`ia.atividades.${key}`, checked)}
                          />
                          <Label>
                            {key === 'geracaoTexto' && 'Geração de texto padrão'}
                            {key === 'resumoAutomatico' && 'Resumo automático de casos'}
                            {key === 'sugestaoAcoes' && 'Sugerir ações por etapa'}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
