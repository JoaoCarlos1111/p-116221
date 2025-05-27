import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { metricsAPI } from '@/services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalCases: 0,
    activeCases: 0,
    pendingNotifications: 0,
    resolvedCases: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is a client and redirect to appropriate dashboard
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.isClient || user.mainDepartment === 'client') {
      // Redirect based on client profile
      if (user.clientProfile === 'gestor') {
        navigate('/client/gestor/dashboard', { replace: true });
      } else if (user.clientProfile === 'analista_contrafacao') {
        navigate('/client/analista/dashboard', { replace: true });
      } else if (user.clientProfile === 'financeiro') {
        navigate('/client/financeiro/dashboard', { replace: true });
      } else {
        navigate('/client/dashboard', { replace: true });
      }
      return;
    }

    // Load metrics for admin users
    loadMetrics();
  }, [navigate]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await metricsAPI.getMetrics();
      if (response.data.success) {
        setMetrics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Total Brand Protection</h1>
        <p className="text-muted-foreground">Gestão de Casos de Falsificação</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Casos Ativos</h3>
          <p className="text-3xl font-bold">
            {loading ? '...' : metrics.activeCases.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Notificações Pendentes</h3>
          <p className="text-3xl font-bold">
            {loading ? '...' : metrics.pendingNotifications.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Acordos Realizados</h3>
          <p className="text-3xl font-bold">
            {loading ? '...' : metrics.resolvedCases.toLocaleString()}
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;