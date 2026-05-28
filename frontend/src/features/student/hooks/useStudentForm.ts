import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  studentSchema,
  type StudentFormValues,
} from "../schemas/studentSchema";

import type { Student } from "../types/student.types";

const INITIAL_FORM: StudentFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  className: "",
  rollNumber: "",
  fatherName: "",
  motherName: "",
  fatherPhone: "",
  motherPhone: "",
  address: "",
  password: "",
  firstLogin: true,
};

export function useStudentForm() {
  const form =
    useForm<StudentFormValues>({
      resolver: zodResolver(
        studentSchema,
      ),

      defaultValues: INITIAL_FORM,
    });

  const resetForm = () => {
    form.reset(INITIAL_FORM);
  };

  const populateForm = (
    student: Student,
  ) => {
    form.reset({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone ?? "",
      className: student.className,
      rollNumber: student.rollNumber,
      fatherName: student.fatherName ?? "",
      motherName: student.motherName ?? "",
      fatherPhone: student.fatherPhone ?? "",
      motherPhone: student.motherPhone ?? "",
      address: student.address ?? "",
      password: student.password ?? "",
      firstLogin: student.firstLogin ?? true,
    });
  };

  return {
    ...form,

    resetForm,

    populateForm,
  };
}