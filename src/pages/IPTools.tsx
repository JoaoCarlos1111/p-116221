
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IPTools() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">IP Tools</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciamento de casos de proteção à propriedade intelectual
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Casos pendentes de análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Casos em processo de notificação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Casos aguardando verificação</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
