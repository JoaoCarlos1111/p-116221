
import { useState } from 'react';
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
      connected: true,
      email: "atendente@empresa.com.br",
      provider: "Gmail",
      lastSync: "2024-01-15 14:30",
      messagesCount: 23
    }
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4SU" + Math.random());

  const [emailForm, setEmailForm] = useState({
    provider: '',
    email: '',
    password: ''
  });

  const handleWhatsAppConnect = () => {
    setQRCodeData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4SU" + Math.random());
    setShowQRCode(true);
  };

  const handleWhatsAppDisconnect = () => {
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
  };

  const handleEmailConnect = () => {
    if (!emailForm.provider || !emailForm.email || !emailForm.password) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIntegrationStatus(prev => ({
      ...prev,
      email: {
        connected: true,
        email: emailForm.email,
        provider: emailForm.provider,
        lastSync: new Date().toLocaleString('pt-BR'),
        messagesCount: 0
      }
    }));

    setEmailForm({ provider: '', email: '', password: '' });
    
    toast({
      title: "E-mail conectado",
      description: "Sua conta de e-mail foi conectada com sucesso.",
    });
  };

  const handleEmailDisconnect = () => {
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
  };

  const refreshQRCode = () => {
    setQRCodeData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4SU" + Math.random());
    toast({
      title: "QR Code atualizado",
      description: "Escaneie o novo QR Code com seu WhatsApp.",
    });
  };

  const simulateWhatsAppConnection = () => {
    setIntegrationStatus(prev => ({
      ...prev,
      whatsapp: {
        connected: true,
        phone: "+55 (11) 99999-9999",
        lastConnection: new Date().toLocaleString('pt-BR'),
        messagesCount: 0
      }
    }));
    setShowQRCode(false);
    toast({
      title: "WhatsApp conectado",
      description: "Sua conta do WhatsApp foi conectada com sucesso!",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔗 Integrações de Atendimento</h1>
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
              📲 WhatsApp Business
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
                          <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <QrCode className="h-32 w-32 text-gray-400" />
                          </div>
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
                        <Button onClick={simulateWhatsAppConnection} className="flex-1 bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Simular Conexão
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
              📧 E-mail Corporativo
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
