
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { DashboardFilters, FilterValues } from "@/components/DashboardFilters";

const mockData = {
  monthlyStats: [
    { month: "Jan", users: 1200, brands: 45, cases: 320, notifications: 890, agreements: 120, takedowns: 450, value: 98000 },
    { month: "Feb", users: 2100, brands: 48, cases: 380, notifications: 920, agreements: 150, takedowns: 520, value: 120000 },
    { month: "Mar", users: 800, brands: 52, cases: 400, notifications: 1050, agreements: 180, takedowns: 600, value: 150000 },
    { month: "Apr", users: 1600, brands: 55, cases: 450, notifications: 1150, agreements: 200, takedowns: 680, value: 180000 },
    { month: "May", users: 900, brands: 58, cases: 480, notifications: 1250, agreements: 220, takedowns: 720, value: 200000 },
    { month: "Jun", users: 1700, brands: 62, cases: 520, notifications: 1350, agreements: 240, takedowns: 800, value: 230000 },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Analytics() {
  const [filteredData, setFilteredData] = useState(mockData);

  const handleFilterChange = (filters: FilterValues) => {
    // Here you would normally fetch filtered data from your API
    console.log("Applied filters:", filters);
    // For now we'll just use the mock data
    setFilteredData(mockData);
  };

  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Resumo Geral</h1>
        <p className="text-muted-foreground">Análise de Performance e KPIs</p>
      </header>

      <DashboardFilters onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Usuários Ativos</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData.monthlyStats}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Marcas Protegidas</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.monthlyStats}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Bar dataKey="brands" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Casos Ativos</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData.monthlyStats}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#ff7300" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Notificações Emitidas</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.monthlyStats}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Bar dataKey="notifications" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Acordos Extrajudiciais</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData.monthlyStats}
                  dataKey="agreements"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {filteredData.monthlyStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Valor Potencial de Indenização</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData.monthlyStats}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
