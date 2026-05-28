import Button from "./Button";

type ModalActionsProps = {
  submitLabel: string;

  onCancel: () => void;

  isSubmitting?: boolean;
};

function ModalActions({
  submitLabel,
  onCancel,
  isSubmitting = false,
}: ModalActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button
        type="button"
        onClick={onCancel}
        className="bg-slate-200 text-slate-700 hover:bg-slate-300"
      >
        Cancel
      </Button>

      <Button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </div>
  );
}

export default ModalActions;
