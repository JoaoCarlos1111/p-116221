import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewTemplate = () => {
  const navigate = useNavigate();
  const templateTypes = ["Notificação Extrajudicial", "Acordo Extrajudicial", "Outros"];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/templates')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Novo Template de Documento</h1>
          <p className="text-sm text-muted-foreground">Crie um novo template para documentos</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Template</Label>
          <Input id="name" placeholder="Ex: Notificação Extrajudicial" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo do Template</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {templateTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default NewTemplate;