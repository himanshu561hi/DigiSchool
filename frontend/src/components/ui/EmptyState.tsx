import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;

  description?: string;

  icon?: ReactNode;
};

function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* ICON */}

      {icon && (
        <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-500">
          {icon}
        </div>
      )}

      {/* TITLE */}

      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>

      {/* DESCRIPTION */}

      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}

export default EmptyState;
