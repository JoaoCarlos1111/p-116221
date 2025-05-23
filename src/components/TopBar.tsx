
import { UserCircle, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <div className="h-16 border-b bg-card px-4 flex items-center justify-between">
      <h1 className="text-lg font-bold">Total Brand Protection</h1>
      
      <div className="flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <UserCircle size={20} />
          <span>Perfil</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <SettingsIcon size={20} />
          <span>Configurações</span>
        </Link>
      </div>
    </div>
  );
}
