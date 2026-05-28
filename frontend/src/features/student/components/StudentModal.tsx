import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

import Modal from "@/components/ui/Modal";

import StudentForm from "./StudentForm";

import type { StudentFormValues } from "../schemas/studentSchema";

type StudentModalProps = {
  isOpen: boolean;

  isEditing: boolean;

  onClose: () => void;

  register: UseFormRegister<StudentFormValues>;

  errors: FieldErrors<StudentFormValues>;

  handleSubmit: UseFormHandleSubmit<StudentFormValues>;

  onSubmit: (values: StudentFormValues) => void;
};

function StudentModal({
  isOpen,
  isEditing,
  onClose,
  register,
  errors,
  handleSubmit,
  onSubmit,
}: StudentModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Student" : "Add Student"}
      onClose={onClose}
    >
      <StudentForm
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onCancel={onClose}
        isEditing={isEditing}
      />
    </Modal>
  );
}

export default StudentModal;
