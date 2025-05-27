
import { useState, useEffect } from 'react';
import { whatsappApi, emailApi } from '@/services/integrations';
import socketService from '@/services/socket';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { 
  MessageSquare, 
  Mail, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Smartphone,
  Monitor,
  Clock,
  AlertTriangle
} from "lucide-react";

interface IntegrationStatus {
  whatsapp: {
    connected: boolean;
    phone?: string;
    lastConnection?: string;
    messagesCount?: number;
  };
  email: {
    connected: boolean;
    email?: string;
    provider?: string;
    lastSync?: string;
    messagesCount?: number;
  };
}

export default function Integracoes() {
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    whatsapp: {
      connected: false,
      messagesCount: 0
    },
    email: {
      connected: false,
      messagesCount: 0
    }
  });

  useEffect(() => {
    console.log('🚀 Initializing Integracoes component...');
    
    // Connect to Socket.IO
    const socket = socketService.connect('user_1');

    // WhatsApp events
    socket.on('whatsapp_qr', (data) => {
      console.log('📱 Received QR Code:', data);
      setQRCodeData(data.qrCode);
      setShowQRCode(true);
      toast({
        title: "QR Code gerado",
        description: "Escaneie o QR Code com seu WhatsApp.",
      });
    });

    socket.on('whatsapp_connected', (data) => {
      console.log('✅ WhatsApp connected:', data);
      setIntegrationStatus(prev => ({
        ...prev,
        whatsapp: {
          connected: true,
          phone: data.phone,
          lastConnection: data.timestamp,
          messagesCount: 0
        }
      }));
      setShowQRCode(false);
      setQRCodeData('');
      toast({
        title: "WhatsApp conectado",
        description: "Sua conta do WhatsApp foi conectada com sucesso!",
      });
    });

    socket.on('whatsapp_disconnected', (data) => {
      console.log('❌ WhatsApp disconnected:', data);
      setIntegrationStatus(prev => ({
        ...prev,
        whatsapp: {
          connected: false,
          messagesCount: 0
        }
      }));
      setShowQRCode(false);
      setQRCodeData('');
    });

    socket.on('whatsapp_message', (data) => {
      console.log('📨 New WhatsApp message:', data);
    });

    // Email events
    socket.on('email_connected', (data) => {
      console.log('✅ Email connected:', data);
      setIntegrationStatus(prev => ({
        ...prev,
        email: {
          connected: true,
          email: data.email,
          provider: data.provider,
          lastSync: data.timestamp,
          messagesCount: 0
        }
      }));
      toast({
        title: "E-mail conectado",
        description: "Sua conta de e-mail foi conectada com sucesso.",
      });
    });

    socket.on('email_disconnected', () => {
      setIntegrationStatus(prev => ({
        ...prev,
        email: {
          connected: false,
          messagesCount: 0
        }
      }));
    });

    socket.on('email_received', (data) => {
      console.log('📧 New email:', data);
    });

    // Connection status check
    const checkConnection = setInterval(() => {
      if (!socketService.isConnected()) {
        console.warn('⚠️ Socket not connected, attempting reconnection...');
      }
    }, 5000);

    // Load initial status
    loadInitialStatus();

    return () => {
      clearInterval(checkConnection);
      // Don't disconnect on unmount to keep the connection alive
      // socketService.disconnect();
    };
  }, []);

  const loadInitialStatus = async () => {
    try {
      const [whatsappStatus, emailStatus] = await Promise.all([
        whatsappApi.getStatus(),
        emailApi.getStatus()
      ]);

      setIntegrationStatus({
        whatsapp: whatsappStatus.data,
        email: emailStatus.data
      });
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<string>("");

  const [emailForm, setEmailForm] = useState({
    provider: '',
    email: '',
    password: ''
  });

  const handleWhatsAppConnect = async () => {
    try {
      console.log('🔄 Connecting WhatsApp...');
      
      if (!socketService.isConnected()) {
        console.warn('⚠️ Socket not connected, reconnecting...');
        socketService.connect('user_1');
        
        // Wait a bit for connection
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const response = await whatsappApi.connect();
      console.log('📡 WhatsApp API response:', response.data);
      
      if (response.data.success) {
        if (response.data.qrCode) {
          console.log('✅ QR Code received from API');
          setQRCodeData(response.data.qrCode);
          setShowQRCode(true);
        } else {
          console.log('⏳ Waiting for QR Code via Socket...');
          toast({
            title: "Aguarde",
            description: "Gerando QR Code...",
          });
        }
      } else {
        console.error('❌ WhatsApp API error:', response.data);
        toast({
          title: "Erro",
          description: "Não foi possível conectar o WhatsApp.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Error connecting WhatsApp:', error);
      toast({
        title: "Erro",
        description: `Erro ao conectar WhatsApp: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleWhatsAppDisconnect = async () => {
    try {
      const response = await whatsappApi.disconnect();
      if (response.data.success) {
        setIntegrationStatus(prev => ({
          ...prev,
          whatsapp: {
            connected: false,
            messagesCount: 0
          }
        }));
        toast({
          title: "WhatsApp desconectado",
          description: "Sua conta do WhatsApp foi desconectada com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
    }
  };

  const handleEmailConnect = async () => {
    if (!emailForm.provider || !emailForm.email || !emailForm.password) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await emailApi.connect(emailForm.provider, emailForm.email, emailForm.password);
      if (response.data.success) {
        setEmailForm({ provider: '', email: '', password: '' });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível conectar o e-mail. Verifique suas credenciais.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error connecting email:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar e-mail. Verifique suas credenciais.",
        variant: "destructive"
      });
    }
  };

  const handleEmailDisconnect = async () => {
    try {
      const response = await emailApi.disconnect();
      if (response.data.success) {
        setIntegrationStatus(prev => ({
          ...prev,
          email: {
            connected: false,
            messagesCount: 0
          }
        }));
        toast({
          title: "E-mail desconectado",
          description: "Sua conta de e-mail foi desconectada com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error disconnecting email:', error);
    }
  };

  const refreshQRCode = async () => {
    try {
      const response = await whatsappApi.connect();
      if (response.data.success && response.data.qrCode) {
        setQRCodeData(response.data.qrCode);
        toast({
          title: "QR Code atualizado",
          description: "Escaneie o novo QR Code com seu WhatsApp.",
        });
      }
    } catch (error) {
      console.error('Error refreshing QR code:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrações de Atendimento</h1>
          <p className="text-muted-foreground">Conecte seus canais de comunicação para centralizar o atendimento</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* WhatsApp Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              WhatsApp Business
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              {integrationStatus.whatsapp.connected ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <XCircle className="h-4 w-4 mr-1" />
                  Não conectado
                </Badge>
              )}
            </div>

            {integrationStatus.whatsapp.connected ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Smartphone className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{integrationStatus.whatsapp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Conectado em: {integrationStatus.whatsapp.lastConnection}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{integrationStatus.whatsapp.messagesCount} mensagens vinculadas</span>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                      <XCircle className="h-4 w-4 mr-2" />
                      Desconectar WhatsApp
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Desconectar WhatsApp</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja desconectar sua conta do WhatsApp? 
                        Você não receberá mais mensagens pelo sistema.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleWhatsAppDisconnect} className="bg-red-600 hover:bg-red-700">
                        Desconectar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <QrCode className="h-4 w-4" />
                    <span>Escaneie o QR Code com seu WhatsApp para conectar</span>
                  </div>
                </div>

                <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
                  <DialogTrigger asChild>
                    <Button onClick={handleWhatsAppConnect} className="w-full bg-green-600 hover:bg-green-700">
                      <QrCode className="h-4 w-4 mr-2" />
                      Conectar WhatsApp
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center">Conectar WhatsApp</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                          {qrCodeData ? (
                            <img 
                              src={qrCodeData} 
                              alt="QR Code WhatsApp" 
                              className="w-64 h-64"
                            />
                          ) : (
                            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                              <QrCode className="h-32 w-32 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                          1. Abra o WhatsApp no seu celular
                        </p>
                        <p className="text-sm text-muted-foreground">
                          2. Vá em Configurações {'>'} Aparelhos conectados
                        </p>
                        <p className="text-sm text-muted-foreground">
                          3. Escaneie este QR Code
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={refreshQRCode} variant="outline" className="flex-1">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Atualizar QR
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              E-mail Corporativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              {integrationStatus.email.connected ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <XCircle className="h-4 w-4 mr-1" />
                  Não conectado
                </Badge>
              )}
            </div>

            {integrationStatus.email.connected ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{integrationStatus.email.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Monitor className="h-3 w-3" />
                    <span>Provedor: {integrationStatus.email.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Última sincronização: {integrationStatus.email.lastSync}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{integrationStatus.email.messagesCount} e-mails vinculados</span>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                      <XCircle className="h-4 w-4 mr-2" />
                      Desconectar E-mail
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Desconectar E-mail</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja desconectar sua conta de e-mail? 
                        Você não receberá mais e-mails pelo sistema.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleEmailDisconnect} className="bg-red-600 hover:bg-red-700">
                        Desconectar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="provider">Provedor de E-mail</Label>
                    <Select value={emailForm.provider} onValueChange={(value) => setEmailForm(prev => ({ ...prev, provider: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o provedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="outlook">Outlook</SelectItem>
                        <SelectItem value="imap">IMAP Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@empresa.com"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Senha ou Token</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use senha de app para Gmail/Outlook ou senha normal para IMAP
                    </p>
                  </div>
                </div>

                <Button onClick={handleEmailConnect} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Conectar E-mail
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Integration Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-5 w-5" />
            Histórico de Integrações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">E-mail conectado com sucesso</p>
                <p className="text-xs text-muted-foreground">15/01/2024 14:30 - atendente@empresa.com.br</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">WhatsApp desconectado por inatividade</p>
                <p className="text-xs text-muted-foreground">14/01/2024 08:15 - Sessão expirada</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">WhatsApp conectado com sucesso</p>
                <p className="text-xs text-muted-foreground">13/01/2024 09:22 - +55 (11) 99999-9999</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
