
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewBrand() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState({
    name: "",
    company: "",
    status: "active" as const,
  });

  const handleSave = () => {
    const newBrand = {
      id: Date.now().toString(),
      name: brand.name,
      company: brand.company,
      inpiRegistrations: 0,
      activeCases: 0,
      status: brand.status,
    };

    // Here you would typically make an API call to save the brand
    // For now, we'll just update the local state and navigate back
    
    navigate("/admin/brands", { state: { newBrand } });
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Marca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da Marca</Label>
            <Input
              value={brand.name}
              onChange={(e) => setBrand({ ...brand, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Empresa/Grupo</Label>
            <Input
              value={brand.company}
              onChange={(e) => setBrand({ ...brand, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={brand.status}
              onValueChange={(value: "active" | "validating" | "inactive") =>
                setBrand({ ...brand, status: value })
              }
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/brands")}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
