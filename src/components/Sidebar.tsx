
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Kanban, 
  CheckSquare, 
  UserCircle,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GitPullRequest
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
        <NavLink to="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <LayoutDashboard size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Dashboard</span>
        </NavLink>

        <NavLink to="/kanban/verificacao" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <Kanban size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Kanban</span>
        </NavLink>

        <NavLink to="/prospeccao" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <GitPullRequest size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Workflow</span>
        </NavLink>

        <NavLink to="/auditoria" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <CheckSquare size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Auditoria</span>
        </NavLink>

        <NavLink to="/approvals" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <CheckSquare size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Aprovações</span>
        </NavLink>

        <NavLink to="/logistica" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <Kanban size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Logística</span>
        </NavLink>

        <NavLink to="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <UserCircle size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Perfil</span>
        </NavLink>

        <NavLink to="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <SettingsIcon size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Configurações</span>
        </NavLink>

        <div className="absolute bottom-4 left-0 right-0 px-2">
          <button
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('userRole');
              window.location.href = '/login/internal';
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
