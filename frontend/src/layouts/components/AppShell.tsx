import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import useSidebar from "@/hooks/useSidebar";
import { useNotificationStore, NotificationType } from "@/features/notification/store/notificationStore";

const getPathModuleType = (path: string): NotificationType | null => {
  if (path.includes("leave")) return "leave";
  if (path.includes("assignments")) return "homework";
  if (path.includes("attendance")) return "attendance";
  if (path.includes("fees")) return "fee";
  if (path.includes("reports") || path.includes("exams")) return "result";
  if (path.includes("notifications")) return "general";
  return null;
};

export default function AppShell({ children }: PropsWithChildren) {
  const { collapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const markModuleAsRead = useNotificationStore((state) => state.markModuleAsRead);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const modType = getPathModuleType(location.pathname);
    if (modType) {
      markModuleAsRead(modType);
    }
  }, [location.pathname, markModuleAsRead]);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-50">
          <aside className="w-64 bg-white dark:bg-slate-900">
            <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-2 right-2 p-2"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </aside>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <Header />
        <MobileNav onOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 pb-28 sm:p-6 md:p-8 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
