
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/config/roles';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Total Brand Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={(value) => handleLogin(value as UserRole)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="verification_analyst">Analista de Verificação</SelectItem>
              <SelectItem value="prospection_analyst">Analista de Prospecção</SelectItem>
              <SelectItem value="client">Cliente</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
