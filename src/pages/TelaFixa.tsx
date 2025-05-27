
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TelaFixa() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-[800px] h-[600px] bg-white shadow-xl rounded-lg overflow-hidden">
        <Card className="h-full">
          <CardHeader className="bg-primary text-white">
            <CardTitle>Tela com Tamanho Fixo</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-full overflow-y-auto">
            <p>Esta é uma tela com tamanho fixo de 800x600 pixels, centralizada na tela, sem sidebar.</p>
            {/* Seu conteúdo aqui */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
