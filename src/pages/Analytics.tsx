
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { DashboardFilters, FilterValues } from "@/components/DashboardFilters";
import { addDays, subDays, isWithinInterval } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const initialData = {
  monthlyStats: [
    { month: "Jan", users: 1200, brands: 45, cases: 320, notifications: 890, agreements: 120, takedowns: 450, value: 98000 },
    { month: "Feb", users: 2100, brands: 48, cases: 380, notifications: 920, agreements: 150, takedowns: 520, value: 120000 },
    { month: "Mar", users: 800, brands: 52, cases: 400, notifications: 1050, agreements: 180, takedowns: 600, value: 150000 },
    { month: "Apr", users: 1600, brands: 55, cases: 450, notifications: 1150, agreements: 200, takedowns: 680, value: 180000 },
    { month: "May", users: 900, brands: 58, cases: 480, notifications: 1250, agreements: 220, takedowns: 720, value: 200000 },
    { month: "Jun", users: 1700, brands: 62, cases: 520, notifications: 1350, agreements: 240, takedowns: 800, value: 230000 },
  ]
};

export default function Analytics() {
  const [filteredData, setFilteredData] = useState(initialData);

  const handleFilterChange = (filters: FilterValues) => {
    let filtered = [...initialData.monthlyStats];

    // Period filtering
    if (filters.period !== 'custom') {
      const today = new Date();
      const filterDays = {
        last7: 7,
        last30: 30,
        last180: 180,
        last365: 365
      }[filters.period] || 30;

      filtered = filtered.filter((_, index) => {
        const date = subDays(today, (filtered.length - 1 - index) * 30);
        return date >= subDays(today, filterDays);
      });
    } else if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter((_, index) => {
        const date = addDays(new Date(), -((filtered.length - 1 - index) * 30));
        return isWithinInterval(date, {
          start: filters.dateRange.from!,
          end: filters.dateRange.to!
        });
      });
    }

    // Sector filtering
    if (filters.sector !== 'all') {
      filtered = filtered.map(stat => ({
        ...stat,
        users: stat.users * 0.7,
        brands: stat.brands * 0.7,
        cases: stat.cases * 0.7,
        notifications: stat.notifications * 0.7,
        agreements: stat.agreements * 0.7,
        takedowns: stat.takedowns * 0.7,
        value: stat.value * 0.7
      }));
    }

    // Status filtering
    if (filters.status !== 'all') {
      filtered = filtered.map(stat => ({
        ...stat,
        cases: filters.status === 'active' ? stat.cases * 0.8 : stat.cases * 0.2,
        notifications: filters.status === 'active' ? stat.notifications * 0.8 : stat.notifications * 0.2
      }));
    }

    setFilteredData({ monthlyStats: filtered });
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
                  {filteredData.monthlyStats.map((_, index) => (
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
