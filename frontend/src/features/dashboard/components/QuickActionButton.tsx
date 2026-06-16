import type { ReactNode } from "react";

type QuickActionButtonProps = {
  label: string;

  icon?: ReactNode;

  onClick?: () => void;
};

function QuickActionButton({ label, icon, onClick }: QuickActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90"
    >
      {icon ? icon : null}

      <span>{label}</span>
    </button>
  );
}

export default QuickActionButton;
