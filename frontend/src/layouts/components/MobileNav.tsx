
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SIDEBAR_CONFIG } from "@/config/sidebarConfig";
import { hasPermission } from "@/utils/hasPermission";
import { LogOut } from "lucide-react";
import type { FC } from "react";

interface MobileNavProps {
  /** Opens the sidebar overlay on mobile */
  onOpen: () => void;
}

/**
 * Bottom navigation bar visible on small screens.
 * Height increased to 20 (h-20) and icons scroll horizontally if they overflow.
 */
const MobileNav: FC<MobileNavProps> = ({ onOpen }) => {
  const { role, logout } = useAuth();
  const normalizedRole = role?.trim().toUpperCase() as keyof typeof SIDEBAR_CONFIG | undefined;
  const sidebarItems = normalizedRole ? SIDEBAR_CONFIG[normalizedRole] ?? [] : [];

  const filteredItems = sidebarItems.filter((item) => {
    if (!item.permission) return true;
    if (!role) return false;
    return hasPermission(role, item.permission);
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 md:hidden flex items-center px-4 py-2 h-20">
      {/* Scrollable icons */}
      <div className="flex flex-1 overflow-x-auto scrollbar-hide space-x-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-primary" : "text-slate-600 dark:text-slate-200"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="mt-1 whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="flex flex-col items-center text-xs text-rose-500 hover:opacity-80 transition-opacity"
        >
          <LogOut className="h-5 w-5" />
          <span className="mt-1 whitespace-nowrap">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
