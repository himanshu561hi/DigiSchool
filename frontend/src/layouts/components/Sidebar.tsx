import { NavLink } from "react-router-dom";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { SIDEBAR_CONFIG } from "@/config/sidebarConfig";

import { useAuth } from "@/context/AuthContext";

import { hasPermission } from "@/utils/hasPermission";
import { useNotificationStore, NotificationType } from "@/features/notification/store/notificationStore";

import NotificationBadge from "@/features/notifications/components/NotificationBadge";

const getPathModuleType = (path: string): NotificationType | null => {
  if (path.includes("leave")) return "leave";
  if (path.includes("assignments")) return "homework";
  if (path.includes("attendance")) return "attendance";
  if (path.includes("fees")) return "fee";
  if (path.includes("reports") || path.includes("exams")) return "result";
  if (path.includes("notifications")) return "general";
  return null;
};

type SidebarProps = {
  collapsed: boolean;

  onToggle: () => void;
};

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { role, user, logout } = useAuth();

  const unreadCount = useNotificationStore(state => state.getUnreadCount());
  const hasUnreadInModule = useNotificationStore(state => state.hasUnreadInModule);

  /* ========================= */
  /* SIDEBAR ITEMS */
  /* ========================= */

  const normalizedRole = role?.trim().toUpperCase() as keyof typeof SIDEBAR_CONFIG | undefined;
  const sidebarItems = normalizedRole ? (SIDEBAR_CONFIG[normalizedRole] || []) : [];

  /* ========================= */
  /* FILTERED ITEMS */
  /* ========================= */

  const filteredItems = sidebarItems.filter((item) => {
    if (!item.permission) {
      return true;
    }

    if (!role) {
      return false;
    }

    return hasPermission(role, item.permission);
  });

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      {/* ========================= */}
      {/* LOGO */}
      {/* ========================= */}

      <div className="border-b border-slate-200 px-6 py-8 dark:border-slate-800">
        {!collapsed ? (
          <>
            <h1 className="text-4xl font-bold text-primary">School ERP</h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
              {user?.schoolName || (role === "SUPER_ADMIN" ? "DigiSchool Admin" : "Enterprise Portal")}
            </p>
          </>
        ) : (
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold text-primary">ERP</h1>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* TOGGLE BUTTON */}
      {/* ========================= */}

      <button
        type="button"
        onClick={onToggle}
        className="mx-4 mt-4 flex items-center justify-center rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        {collapsed ? (
          <PanelLeftOpen className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        ) : (
          <PanelLeftClose className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        )}
      </button>

      {/* ========================= */}
      {/* NAVIGATION */}
      {/* ========================= */}

      <nav className="flex-1 space-y-2 p-4 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl px-5 py-4 text-lg font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              }`
            }
          >
            <div
              className={`flex items-center justify-between ${
                collapsed ? "justify-center relative" : "gap-3"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </div>
              
              {/* Notifications Badge */}
              {item.path === "/notifications" ? (
                <div className={collapsed ? "absolute top-0 right-0 -mr-1 -mt-1" : ""}>
                  <NotificationBadge count={unreadCount} pulse={unreadCount > 0} />
                </div>
              ) : (
                (() => {
                  const modType = getPathModuleType(item.path);
                  if (modType && hasUnreadInModule(modType)) {
                    return (
                      <div className={collapsed ? "absolute top-0 right-0 -mr-1 -mt-1" : ""}>
                        <NotificationBadge showDot pulse />
                      </div>
                    );
                  }
                  return null;
                })()
              )}
            </div>
          </NavLink>
        ))}
      </nav>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center rounded-xl bg-primary px-5 py-4 font-semibold text-white transition hover:opacity-90"
        >
          {collapsed ? "↩" : "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
