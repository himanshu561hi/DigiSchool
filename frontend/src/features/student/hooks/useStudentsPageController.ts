import { useCallback } from "react";

import type { Student } from "../types/student.types";

import type { StudentFormValues } from "../schemas/studentSchema";

type UseStudentsPageControllerProps = {
  populateForm: (
    student: Student,
  ) => void;

  openEditModal: (
    studentId: string,
  ) => void;

  closeDeleteModal: () => void;

  closeModal: () => void;

  resetForm: () => void;

  saveStudent: (
    values: StudentFormValues,
    editingStudentId?: string | null,
  ) => void;

  removeStudent: (
    studentId: string,
    onSuccess?: () => void,
  ) => void;

  editingStudentId: string | null;
};

export function useStudentsPageController({
  populateForm,

  openEditModal,

  closeDeleteModal,

  closeModal,

  resetForm,

  saveStudent,

  removeStudent,

  editingStudentId,
}: UseStudentsPageControllerProps) {
  /*
   =========================
   CLOSE MODAL
   =========================
  */

const handleCloseModal =
  useCallback(() => {
    resetForm();

    closeModal();
  }, [
    resetForm,
    closeModal,
  ]);

  /*
   =========================
   ADD / UPDATE
   =========================
  */

const handleAddOrEditStudent =
  useCallback(
    (
      values: StudentFormValues,
    ) => {
      saveStudent(
        values,
        editingStudentId,
      );

      handleCloseModal();
    },
    [
      saveStudent,
      editingStudentId,
      handleCloseModal,
    ],
  );

  /*
   =========================
   EDIT
   =========================
  */

  const handleEditStudent =
  useCallback(
    (
      student: Student,
    ) => {
      populateForm(student);

      openEditModal(
        student.id,
      );
    },
    [
      populateForm,
      openEditModal,
    ],
  );

  /*
   =========================
   DELETE
   =========================
  */

const handleDeleteStudent =
  useCallback(
    (
      studentId: string,
    ) => {
      removeStudent(
        studentId,
        () => {
          closeDeleteModal();
        },
      );
    },
    [
      removeStudent,
      closeDeleteModal,
    ],
  );

  return {
    handleCloseModal,

    handleAddOrEditStudent,

    handleEditStudent,

    handleDeleteStudent,
  };
}