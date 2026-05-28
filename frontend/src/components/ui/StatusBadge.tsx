type StatusBadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

type StatusBadgeProps = {
  label: string;

  variant?: StatusBadgeVariant;
};

const variantStyles: Record<StatusBadgeVariant, string> = {
  success: "bg-green-100 text-green-700",

  danger: "bg-red-100 text-red-700",

  warning: "bg-yellow-100 text-yellow-700",

  info: "bg-blue-100 text-blue-700",

  neutral: "bg-slate-100 text-slate-700",
};

function StatusBadge({ label, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${variantStyles[variant]}
      `}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
