import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/ui/Modal";
import TeacherForm from "./TeacherForm";

import {
  teacherSchema,
  type TeacherFormValues,
} from "../schemas/teacherSchema";

import type { Teacher } from "../types/teacher.types";

import { useAuthStore } from "@/features/auth/store/authStore";

type AddTeacherModalProps = {
  isOpen: boolean;

  onClose: () => void;

  onAddTeacher: (teacher: Teacher) => void;
};

function AddTeacherModal({
  isOpen,
  onClose,
  onAddTeacher,
}: AddTeacherModalProps) {
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),

    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      employeeId: "",
      department: "",
      subject: "",
      qualification: "",
      experienceYears: 0,
      joiningDate: "",
      password: "",
      firstLogin: true,
      status: "ACTIVE",
    },
  });

  const onSubmit = (values: TeacherFormValues) => {
    const newTeacher: Teacher = {
      id: crypto.randomUUID(),

      schoolId: user?.schoolId || "school-1",

      ...values,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    onAddTeacher(newTeacher);

    reset();

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Teacher" maxWidth="max-w-2xl">
      <TeacherForm
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        watch={watch}
        setValue={setValue}
        onSubmit={onSubmit}
        onCancel={onClose}
        isEditing={false}
      />
    </Modal>
  );
}

export default AddTeacherModal;
