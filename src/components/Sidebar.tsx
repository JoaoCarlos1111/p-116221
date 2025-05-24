import { NavLink } from "react-router-dom";
import { 
  Users,
  Shield,
  History,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  FileStack,
  LayoutDashboard,
  Boxes,
  Search,
  CheckCircle,
  Scroll,
  Truck,
  Tool,
  Headset,
  DollarSign,
  Lock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth"; // Auth hook

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.isAdmin;

  const allMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, department: '*' },
    { path: '/prospeccao', label: 'Prospecção', icon: Search, department: 'prospeccao' },
    { path: '/verificacao', label: 'Verificação', icon: CheckCircle, department: 'verificacao' },
    { path: '/auditoria', label: 'Auditoria', icon: Scroll, department: 'auditoria' },
    { path: '/logistica', label: 'Logística', icon: Truck, department: 'logistica' },
    { path: '/iptools', label: 'IP Tools', icon: Tool, department: 'ip_tools' },
    { path: '/atendimento', label: 'Atendimento', icon: Headset, department: 'atendimento' },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSign, department: 'financeiro' },
    { path: '/admin/users', label: 'Usuários', icon: Users, department: 'admin' },
    { path: '/admin/permissions', label: 'Permissões', icon: Lock, department: 'admin' },
  ];

  const { user: authUser } = useAuth();
  const isMainAdmin = authUser?.mainDepartment === 'admin';

  const menuItems = allMenuItems.filter(item => 
    isMainAdmin || item.department === '*' || item.department === authUser?.mainDepartment
  );

  return (
    <div className={cn(
      "relative h-screen border-r bg-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className="mb-8 p-4">
        <h2 className={cn(
          "text-lg font-bold transition-all duration-300",
          isCollapsed && "opacity-0"
        )}>
          Total Brand Protection
        </h2>
      </div>

      <nav className="space-y-2 px-2">
        {menuItems.map((item) => (
            <NavLink to={item.path} key={item.path} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                <item.icon size={20} />
                <span className={cn(
                    "transition-all duration-300",
                    isCollapsed && "hidden"
                )}>{item.label}</span>
            </NavLink>
        ))}

        <div className="absolute bottom-4 left-0 right-0 px-2">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="flex w-full items-center gap-2 p-2 rounded-lg hover:bg-accent text-red-600"
          >
            <LogOut size={20} />
            <span className={cn(
              "transition-all duration-300",
              isCollapsed && "hidden"
            )}>Sair</span>
          </button>
        </div>
      </nav>
    </div>
  );
}