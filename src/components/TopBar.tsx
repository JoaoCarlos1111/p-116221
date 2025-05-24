
import { UserCircle, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopBar() {
  const path = window.location.pathname;
  
  return (
    <div className="h-16 border-b bg-card px-4 flex items-center justify-between">
      {path === '/analytics' && (
        <div>
          <h1 className="text-2xl font-bold text-primary">Analytics Overview</h1>
          <p className="text-sm text-secondary-foreground">Track your performance</p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <UserCircle size={20} />
        </Link>
        <Link to="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
          <SettingsIcon size={20} />
        </Link>
      </div>
    </div>
  );
}
