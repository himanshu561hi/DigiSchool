import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/ui/Modal";
import TeacherForm from "./TeacherForm";

import {
  teacherSchema,
  type TeacherFormValues,
} from "../schemas/teacherSchema";

import type { Teacher } from "../types/teacher.types";

type EditTeacherModalProps = {
  teacher: Teacher | null;
  onClose: () => void;
  onUpdateTeacher: (updatedTeacher: Teacher) => void;
};

function EditTeacherModal({
  teacher,
  onClose,
  onUpdateTeacher,
}: EditTeacherModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema) as Resolver<TeacherFormValues>,
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

  useEffect(() => {
    if (teacher) {
      reset({
        fullName: teacher.fullName,
        email: teacher.email,
        phone: teacher.phone,
        employeeId: teacher.employeeId,
        department: teacher.department,
        subject: teacher.subject,
        qualification: teacher.qualification,
        experienceYears: teacher.experienceYears,
        joiningDate: teacher.joiningDate,
        password: teacher.password ?? "",
        firstLogin: teacher.firstLogin ?? true,
        status: teacher.status ?? "ACTIVE",
      });
    }
  }, [teacher, reset]);

  if (!teacher) {
    return null;
  }

  const onSubmit = (values: TeacherFormValues) => {
    onUpdateTeacher({
      ...teacher,
      ...values,
      updatedAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={Boolean(teacher)}
      onClose={onClose}
      title="Edit Teacher"
      maxWidth="max-w-2xl"
    >
      <TeacherForm
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        watch={watch}
        setValue={setValue}
        onSubmit={onSubmit}
        onCancel={onClose}
        isEditing={true}
      />
    </Modal>
  );
}

export default EditTeacherModal;
