import type { PropsWithChildren } from "react";

type FormSectionProps = PropsWithChildren<{
  title?: string;

  description?: string;

  className?: string;
}>;

function FormSection({
  title,
  description,
  className = "",
  children,
}: FormSectionProps) {
  return (
    <div
      className={`
        space-y-4
        ${className}
      `}
    >
      {title || description ? (
        <div>
          {title ? (
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          ) : null}

          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      ) : null}

      {children}
    </div>
  );
}

export default FormSection;
