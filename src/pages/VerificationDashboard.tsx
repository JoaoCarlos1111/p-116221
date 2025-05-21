
import { Card } from "@/components/ui/card";
import { LineChart, BarChart, PieChart, Line, Bar, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const VerificationDashboard = () => {
  // Sample data - replace with real data
  const performanceData = {
    daily: { target: 10, current: 8 },
    weekly: { target: 50, current: 45 },
    monthly: { target: 200, current: 180 },
    successRate: 85,
    avgVerificationTime: 2.5,
    backlog: 15,
    notificationDeliveryRate: 92
  };

  const brandData = [
    { name: "Nike", cases: 45 },
    { name: "Adidas", cases: 30 },
    { name: "Puma", cases: 25 }
  ];

  const categoryData = [
    { name: "Vestuário", value: 40 },
    { name: "Calçados", value: 30 },
    { name: "Acessórios", value: 20 },
    { name: "Outros", value: 10 }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Dashboard de Verificação</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Meta Diária</h3>
          <p className="text-2xl font-bold">{performanceData.daily.current}/{performanceData.daily.target}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Taxa de Sucesso</h3>
          <p className="text-2xl font-bold">{performanceData.successRate}%</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Tempo Médio</h3>
          <p className="text-2xl font-bold">{performanceData.avgVerificationTime} dias</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Taxa de Entrega</h3>
          <p className="text-2xl font-bold">{performanceData.notificationDeliveryRate}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Verificações por Marca</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cases" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Verificações por Categoria</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" fill="#82ca9d" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerificationDashboard;
