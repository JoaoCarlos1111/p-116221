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
  GitPullRequest,
  Shield,
  Banknote,
  ScrollText
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { departments } from "@/constants";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userDepartments = user.departments || [];
  const isAdmin = user.isAdmin;

  const adminMenuItems = [
    {
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard Admin"
    }
  ];

  const menuItems = isAdmin ? adminMenuItems : [
    {
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      departments: "all"
    },
    {
      path: "/prospeccao",
      icon: <GitPullRequest size={20} />,
      label: "Workflow",
      departments: [departments.PROSPECCAO]
    },
    {
      path: "/verificacao",
      icon: <Kanban size={20} />,
      label: "Verificação", 
      departments: [departments.VERIFICACAO]
    },
    {
      path: "/auditoria",
      icon: <ScrollText size={20} />,
      label: "Auditoria",
      departments: [departments.AUDITORIA]
    },
    {
      path: "/approvals",
      icon: <CheckSquare size={20} />,
      label: "Aprovações",
      departments: [departments.CLIENTE]
    },
    {
      path: "/logistica",
      icon: <Kanban size={20} />,
      label: "Logística",
      departments: [departments.LOGISTICA]
    },
    {
      path: "/iptools", 
      icon: <Shield size={20} />,
      label: "IP Tools",
      departments: [departments.IP_TOOLS]
    },
    {
      path: "/financeiro",
      icon: <Banknote size={20} />,
      label: "Financeiro",
      departments: [departments.FINANCEIRO]
    },
    {
      path: "/atendimento",
      icon: <UserCircle size={20} />,
      label: "Atendimento",
      departments: [departments.ATENDIMENTO]
    }
  ];

  const hasAccess = (item: any) => {
    if (isAdmin) return true;
    if (item.departments === "all") return true;
    if (!Array.isArray(userDepartments)) return false;
    const userDeptArray = Array.isArray(userDepartments) ? userDepartments : [userDepartments];
    return Array.isArray(item.departments) ? 
      item.departments.some((dept: string) => userDeptArray.includes(dept)) : 
      userDeptArray.includes(item.departments);
  };

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
        {menuItems.map((item, index) => (
          hasAccess(item) && (
            <NavLink 
              key={index}
              to={item.path} 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
            >
              {item.icon}
              <span className={cn(
                "transition-all duration-300",
                isCollapsed && "hidden"
              )}>{item.label}</span>
            </NavLink>
          )
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