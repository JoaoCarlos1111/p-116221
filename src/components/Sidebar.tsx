import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  KanbanSquare,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-screen border-r bg-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && <span className="font-semibold">Total Brand Protection</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="space-y-2 p-2">
        <NavLink to="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <LayoutDashboard size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Dashboard</span>
        </NavLink>

        <NavLink to="/kanban/verification" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <KanbanSquare size={20} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed && "hidden"
          )}>Pipeline</span>
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