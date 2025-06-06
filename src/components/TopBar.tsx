import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const getPageTitle = (pathname: string) => {
  const routes: Record<string, string> = {
    '/atendimento/central': 'Atendimento',
    '/atendimento': 'Pipeline',
    '/atendimento/integracoes': 'Integrações',
    '/dashboard': 'Dashboard',
    '/prospeccao': 'Prospecção',
    '/kanban/verificacao': 'Verificação',
    '/auditoria': 'Auditoria',
    '/financeiro': 'Financeiro',
    '/logistics': 'Logística',
    '/iptools': 'IP Tools',
    '/analytics': 'Analytics',
    '/brands': 'Marcas e Clientes',
    '/admin/users': 'Gestão de Usuários',
    '/admin/settings': 'Configurações',
    '/admin/templates': 'Templates',
    '/admin/permissions': 'Permissões'
  };

  return routes[pathname] || '';
};

export default function TopBar() {
  const [notifications] = useState(3);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">{pageTitle}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary">{notifications}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}