import Modal from "@/components/ui/Modal";

import Button from "@/components/ui/Button";

type ConfirmModalProps = {
  isOpen: boolean;

  title: string;

  message: string;

  confirmText?: string;

  cancelText?: string;

  confirmLoading?: boolean;

  onConfirm: () => void;

  onClose: () => void;
};

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-slate-600">{message}</p>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={confirmLoading}
            className="bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={confirmLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {confirmLoading ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
