import type { PropsWithChildren } from "react";

type DashboardCardProps = PropsWithChildren<{
  title: string;
}>;

function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* HEADER */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </div>

      {/* CONTENT */}

      {children}
    </div>
  );
}

export default DashboardCard;
