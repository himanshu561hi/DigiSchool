import { ReactNode } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { AlertTriangle, LogOut } from "lucide-react";

type Props = {
  children: ReactNode;
};

export default function InactiveSchoolGuard({ children }: Props) {
  const { user, logout } = useAuthStore();

  const isInactive = user?.schoolStatus === "INACTIVE";

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* 
        We render children normally.
        If inactive, we apply pointer-events-none to the wrapper 
        so they can't click anything underneath.
      */}
      <div className={`w-full h-full transition-all duration-500 ${isInactive ? "pointer-events-none select-none blur-sm" : ""}`}>
        {children}
      </div>

      {/* The Blur Overlay */}
      {isInactive && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 pointer-events-auto bg-slate-900/10 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full mx-4 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="h-20 w-20 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-rose-600 dark:text-rose-400" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">
              Subscription Ended
            </h2>
            
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Your school's subscription is currently inactive. Please contact your system administrator to restore access to your dashboard and data.
            </p>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-all w-full justify-center"
            >
              <LogOut className="h-5 w-5" />
              Sign Out Securely
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
