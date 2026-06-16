import type { ReactNode } from "react";

type TableToolbarProps = {
  title: string;

  subtitle?: string;

  totalRecords: number;

  actions?: ReactNode;

  controls?: ReactNode;
};

function TableToolbar({
  title,
  subtitle,
  totalRecords,
  actions,
  controls,
}: TableToolbarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}

        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {totalRecords} Records
            </span>
          </div>

          {subtitle ? (
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>

        {/* RIGHT */}

        <div className="flex flex-col gap-3">
          {/* ACTIONS */}

          {actions ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {actions}
            </div>
          ) : null}

          {/* CONTROLS */}

          {controls ? (
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              {controls}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TableToolbar;
