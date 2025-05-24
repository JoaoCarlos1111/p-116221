import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { DashboardFilters, FilterValues } from "@/components/DashboardFilters";
import { addDays, subDays, isWithinInterval } from "date-fns";
import { Users, Tag, Box, Mail, Handshake, Ban, BanknoteIcon } from "lucide-react";

const analyticsData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 2100 },
  { name: "Mar", value: 800 },
  { name: "Apr", value: 1600 },
  { name: "May", value: 900 },
  { name: "Jun", value: 1700 },
];

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 glass-card hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usuários ativos</p>
              <p className="text-2xl font-bold">128</p>
              <p className="text-sm text-green-600">+12% em relação ao mês anterior</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Marcas protegidas</p>
              <p className="text-2xl font-bold">52</p>
              <p className="text-sm text-green-600">+8% em relação ao mês anterior</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Box className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Casos ativos</p>
              <p className="text-2xl font-bold">1.247</p>
              <p className="text-sm text-red-600">-3% em relação ao mês anterior</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Notificações do mês</p>
              <p className="text-2xl font-bold">402</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Handshake className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Acordos extrajudiciais</p>
              <p className="text-2xl font-bold">76</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Ban className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Anúncios desativados</p>
              <p className="text-2xl font-bold">980</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-card hover:shadow-lg transition-all col-span-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <BanknoteIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor potencial de indenização</p>
              <p className="text-2xl font-bold">R$ 1.283.000,00</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8989DE"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;