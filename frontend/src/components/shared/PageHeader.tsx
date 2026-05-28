import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;

  subtitle: string;

  totalRecords?: number;

  actions?: ReactNode;
};

function PageHeader({
  title,
  subtitle,
  totalRecords,
  actions,
}: PageHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h1>

            {typeof totalRecords === "number" ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {totalRecords} Records
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* RIGHT */}

        {actions ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PageHeader;
