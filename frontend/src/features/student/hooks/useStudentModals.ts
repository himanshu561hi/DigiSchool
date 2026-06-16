import {
  useCallback,
  useState,
} from "react";

export function useStudentModals() {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    editingStudentId,
    setEditingStudentId,
  ] = useState<string | null>(null);

  const [
    deletingStudentId,
    setDeletingStudentId,
  ] = useState<string | null>(null);

  /*
   =========================
   OPEN CREATE MODAL
   =========================
  */
const openCreateModal =
  useCallback(() => {
    setEditingStudentId(null);

    setIsModalOpen(true);
  }, []);

  /*
   =========================
   OPEN EDIT MODAL
   =========================
  */

const openEditModal =
  useCallback(
    (studentId: string) => {
      setEditingStudentId(
        studentId,
      );

      setIsModalOpen(true);
    },
    [],
  );

  /*
   =========================
   CLOSE MODAL
   =========================
  */

const closeModal =
  useCallback(() => {
    setEditingStudentId(null);

    setIsModalOpen(false);
  }, []);

  /*
   =========================
   DELETE MODAL
   =========================
  */

const openDeleteModal =
  useCallback(
    (studentId: string) => {
      setDeletingStudentId(
        studentId,
      );
    },
    [],
  );
const closeDeleteModal =
  useCallback(() => {
    setDeletingStudentId(null);
  }, []);

  return {
    isModalOpen,

    editingStudentId,

    deletingStudentId,

    openCreateModal,

    openEditModal,

    closeModal,

    openDeleteModal,

    closeDeleteModal,
  };
}