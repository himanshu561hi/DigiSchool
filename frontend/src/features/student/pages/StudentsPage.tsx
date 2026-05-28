import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/authStore";

import PageHeader from "@/components/shared/PageHeader";

import ConfirmModal from "@/components/ui/ConfirmModal";

import StudentModal from "../components/StudentModal";

import StudentTableActions from "../components/StudentTableActions";

import StudentTableSection from "../components/StudentTableSection";

import StudentFilters from "../components/StudentFilters";
import ClassSubjectsSection from "../components/ClassSubjectsSection";
import { useState } from "react";

import { getStudentTableColumns } from "../constants/studentTableColumns";

import { useStudentActions } from "../hooks/useStudentActions";

import { useStudentFilters } from "../hooks/useStudentFilters";

import { useStudentForm } from "../hooks/useStudentForm";

import { useStudentModals } from "../hooks/useStudentModals";

import { useStudents } from "../hooks/useStudents";

import { useStudentsPageController } from "../hooks/useStudentsPageController";

function StudentsPage() {
  const [activeTab, setActiveTab] = useState<"directory" | "subjects">("directory");

  /*
   =========================
   MODALS STATE
   =========================
  */

  const {
    isModalOpen,
    editingStudentId,
    deletingStudentId,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,
  } = useStudentModals();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      openCreateModal();
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, openCreateModal, setSearchParams]);

  /*
   =========================
   DATA FETCHING
   =========================
  */

  const { data: students = [], isLoading: loading, error } = useStudents();

  /*
   =========================
   LOCAL STATE ACTIONS
   =========================
  */

  const {
    localStudents,
    saveStudent,
    removeStudent,
    createStudentMutation,
    updateStudentMutation,
    deleteStudentMutation,
  } = useStudentActions(students);

  /*
   =========================
   FILTER SYSTEM (PRO)
   =========================
  */
  const {
    search,
    setSearch,

    currentPage,
    setCurrentPage,

    itemsPerPage,
    setItemsPerPage,

    selectedClass,
    setSelectedClass,

    attendanceRange,
    setAttendanceRange,

    classes,

    paginatedStudents,
    totalPages,
  } = useStudentFilters(localStudents);

  /*
   =========================
   FORM HANDLING
   =========================
  */

  const {
    register,
    handleSubmit,
    resetForm,
    populateForm,
    formState: { errors },
  } = useStudentForm();

  /*
   =========================
   PAGE CONTROLLER
   =========================
  */

  const {
    handleCloseModal,
    handleAddOrEditStudent,
    handleEditStudent,
    handleDeleteStudent,
  } = useStudentsPageController({
    populateForm,
    openEditModal,
    closeDeleteModal,
    closeModal,
    resetForm,
    saveStudent,
    removeStudent,
    editingStudentId,
  });

  /*
   =========================
   ERROR HANDLING
   =========================
  */

  useEffect(() => {
    if (error) {
      toast.error("Failed to load students");
    }
  }, [error]);

  /*
   =========================
   TABLE COLUMNS (MEMOIZED)
   =========================
  */

  const columns = useMemo(
    () =>
      getStudentTableColumns({
        onEdit: handleEditStudent,
        onDelete: openDeleteModal,
      }),
    [handleEditStudent, openDeleteModal],
  );

  /*
   =========================
   BULK DELETE HANDLER (SAFE)
   =========================
  */

  const handleBulkDelete = async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map((id) => handleDeleteStudent(id)));

      toast.success(`${selectedIds.length} students deleted successfully`);
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <PageHeader
        title="Students"
        subtitle="Manage student records and academic data."
        totalRecords={activeTab === "directory" ? localStudents.length : undefined}
        actions={
          <StudentTableActions
            search={search}
            onSearchChange={setSearch}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            onAddStudent={openCreateModal}
            isLoading={createStudentMutation.isPending}
            isUpdating={updateStudentMutation.isPending}
          />
        }
      />

      {/* ========================= */}
      {/* TABS + FILTER BUTTON */}
      {/* ========================= */}
      
      <div className="flex flex-col gap-2">
        {/* Tab row with filter button on the right */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab("directory")}
              className={`pb-3 text-sm font-bold transition-colors relative ${
                activeTab === "directory" ? "text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Student Directory
              {activeTab === "directory" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`pb-3 text-sm font-bold transition-colors relative ${
                activeTab === "subjects" ? "text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Class Subjects
              {activeTab === "subjects" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></span>
              )}
            </button>
          </div>

          {/* Filter button — only shown on directory tab */}
          {activeTab === "directory" && (
            <div className="pb-2">
              <StudentFilters
                renderButton
                classes={classes}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                attendanceRange={attendanceRange}
                setAttendanceRange={setAttendanceRange}
              />
            </div>
          )}
        </div>

        {/* Active filter chips — shown below tabs only when filters are active */}
        {activeTab === "directory" && (
          <StudentFilters
            classes={classes}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            attendanceRange={attendanceRange}
            setAttendanceRange={setAttendanceRange}
          />
        )}
      </div>

      {activeTab === "directory" ? (
        <>

          {/* ========================= */}
          {/* TABLE SECTION */}
          {/* ========================= */}

          <StudentTableSection
            data={paginatedStudents}
            loading={loading}
            columns={columns}
            search={search}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onBulkDelete={handleBulkDelete}
            onEdit={handleEditStudent}
            onDelete={openDeleteModal}
          />
        </>
      ) : (
        <ClassSubjectsSection />
      )}

      {/* ========================= */}
      {/* MODAL (CREATE / EDIT) */}
      {/* ========================= */}

      <StudentModal
        isOpen={isModalOpen}
        isEditing={Boolean(editingStudentId)}
        onClose={handleCloseModal}
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={handleAddOrEditStudent}
      />

      {/* ========================= */}
      {/* DELETE CONFIRM MODAL */}
      {/* ========================= */}

      <ConfirmModal
        isOpen={Boolean(deletingStudentId)}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmLoading={deleteStudentMutation.isPending}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (deletingStudentId) {
            handleDeleteStudent(deletingStudentId);
          }
        }}
      />
    </div>
  );
}

export default StudentsPage;
