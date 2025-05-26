
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AuthService } from '@/services/auth';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function InternalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      const { token, user } = await AuthService.login(email, password);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      const departmentRoutes: Record<string, string> = {
        prospeccao: '/prospeccao',
        verificacao: '/kanban/verificacao',
        logistica: '/logistica',
        ip_tools: '/iptools',
        atendimento: '/atendimento',
        financeiro: '/financeiro',
        admin: '/dashboard'
      };

      const route = user.isAdmin ? departmentRoutes.admin : 
        departmentRoutes[user.mainDepartment] || departmentRoutes.admin;

      navigate(route);
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a), ${user.name}!`
      });
    } catch (error) {
      setError('Email ou senha incorretos');
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Credenciais inválidas"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-[400px] p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Totall Brand Protection</h1>
          <p className="text-muted-foreground">Faça login para acessar o sistema</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="button" 
            variant="link" 
            className="px-0 font-normal w-full text-left"
            onClick={() => toast({
              title: "Recurso em desenvolvimento",
              description: "A recuperação de senha estará disponível em breve."
            })}
          >
            Esqueci minha senha
          </Button>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
