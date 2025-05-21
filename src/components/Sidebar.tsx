import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Kanban, 
  CheckSquare, 
  UserCircle,
  Settings as SettingsIcon
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 border-r bg-card p-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold">Total Brand Protection</h2>
      </div>

      <nav className="space-y-2">
        <NavLink to="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/kanban/prospeccao" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <Kanban size={20} />
          <span>Fluxo de Análise</span>
        </NavLink>

        <NavLink to="/approvals" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <CheckSquare size={20} />
          <span>Aprovações</span>
        </NavLink>

        <NavLink to="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <UserCircle size={20} />
          <span>Perfil</span>
        </NavLink>

        <NavLink to="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <SettingsIcon size={20} />
          <span>Configurações</span>
        </NavLink>
      </nav>
    </div>
  );
}