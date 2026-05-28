import type { ReactNode } from "react";
import NotificationBadge from "@/features/notifications/components/NotificationBadge";

type StatCardProps = {
  title: string;

  value: string | number;

  icon?: ReactNode;

  change?: string;

  changeType?: "increase" | "decrease" | "neutral";

  description?: string;

  badgeCount?: number;
  showDot?: boolean;
};

function StatCard({
  title,
  value,
  icon,
  change,
  changeType = "increase",
  description,
  badgeCount = 0,
  showDot = false,
}: StatCardProps) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* ========================= */}
      {/* TOP */}
      {/* ========================= */}

      {(badgeCount > 0 || showDot) && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 z-10">
          <NotificationBadge count={badgeCount} showDot={showDot} pulse />
        </div>
      )}

      <div className="flex flex-row items-center justify-between gap-3 sm:gap-0">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>

          <h3 className="mt-0.5 sm:mt-2 text-lg sm:text-3xl font-bold text-slate-900 dark:text-slate-100 truncate">
            {value}
          </h3>
        </div>

        {icon ? (
          <div className="shrink-0 rounded-lg sm:rounded-xl bg-primary/10 p-2 sm:p-3 text-primary">
            {icon}
          </div>
        ) : null}
      </div>

      {/* ========================= */}
      {/* BOTTOM */}
      {/* ========================= */}

      {change || description ? (
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-1 sm:gap-0">
          {change ? (
            <span
              className={`text-[10px] sm:text-sm font-semibold ${
                changeType === "increase" ? "text-emerald-600 dark:text-emerald-400" : 
                changeType === "decrease" ? "text-rose-600 dark:text-rose-400" : 
                "text-slate-600 dark:text-slate-400"
              }`}
            >
              {change}
            </span>
          ) : null}

          {description ? (
            <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default StatCard;
