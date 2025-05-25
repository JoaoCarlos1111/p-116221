
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminTemplates() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os templates de documentos
          </p>
        </div>
        <Button onClick={() => navigate("/admin/templates/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Lista de templates será implementada aqui */}
          <p className="text-muted-foreground">Nenhum template encontrado.</p>
        </CardContent>
      </Card>
    </div>
  );
}
