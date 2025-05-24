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
  Boxes
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        <NavLink to="/admin/users" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <Users size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Usuários</span>
        </NavLink>

        <NavLink to="/admin/permissions" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <Shield size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Permissões</span>
        </NavLink>

        <NavLink to="/admin/audit" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <History size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Auditoria</span>
        </NavLink>

        <NavLink to="/admin/brands" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <Building2 size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Marcas</span>
        </NavLink>

        <NavLink to="/admin/templates" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <FileStack size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Templates</span>
        </NavLink>

        <NavLink to="/admin/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <Boxes size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Configurações</span>
        </NavLink>

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