import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function IPTools() {
  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">IP Tools</h1>
        <p className="text-muted-foreground mt-2">
          Gerenciamento de casos de proteção à propriedade intelectual
        </p>
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Casos</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}