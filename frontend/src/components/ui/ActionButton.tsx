type ActionButtonProps = {
  label: string;

  variant?: "edit" | "delete";

  onClick: () => void;
};

function ActionButton({
  label,
  variant = "edit",
  onClick,
}: ActionButtonProps) {
  const styles =
    variant === "edit"
      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
      : "bg-red-100 text-red-700 hover:bg-red-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${styles}`}
    >
      {label}
    </button>
  );
}

export default ActionButton;