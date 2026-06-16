import type { ReactNode } from "react";

type DashboardSectionProps = {
  title: string;

  description?: string;

  children: ReactNode;

  action?: ReactNode;
};

function DashboardSection({
  title,
  description,
  children,
  action,
}: DashboardSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>

          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        {action ? <div>{action}</div> : null}
      </div>

      {/* CONTENT */}

      <div className="mt-6">{children}</div>
    </div>
  );
}

export default DashboardSection;
