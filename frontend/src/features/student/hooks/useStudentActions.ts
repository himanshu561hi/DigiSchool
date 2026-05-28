import { useEffect, useState } from "react";

import { useCreateStudent } from "./useCreateStudent";

import { useDeleteStudent } from "./useDeleteStudent";

import { useUpdateStudent } from "./useUpdateStudent";

import type { Student } from "../types/student.types";

import type { StudentFormValues } from "../schemas/studentSchema";
import { useNotificationStore } from "@/features/notification/store/notificationStore";
import { useAuthStore } from "@/features/auth/store/authStore";
export function useStudentActions(
  initialStudents: Student[] = [],
) {
  const [localStudents, setLocalStudents] = useState(initialStudents);
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setLocalStudents(initialStudents || []);
  }, [initialStudents]);

  const createStudentMutation =
    useCreateStudent();

  const updateStudentMutation =
    useUpdateStudent();

  const deleteStudentMutation =
    useDeleteStudent();

  /*
   =========================
   CREATE / UPDATE
   =========================
  */

  const saveStudent = (
    values: StudentFormValues,
    editingStudentId?: string | null,
  ) => {
    if (editingStudentId) {
      const existingStudent = localStudents.find((s) => s.id === editingStudentId);

      const updatedStudent: Student = {
        id: editingStudentId,

        schoolId: existingStudent?.schoolId ?? "school_1",

        attendance: existingStudent?.attendance ?? 100,

        profilePic: existingStudent?.profilePic,

        ...values,
      };

      updateStudentMutation.mutate(
        updatedStudent,
        {
          onSuccess: () => {
            setLocalStudents(
              (previous) =>
                previous.map(
                  (student) =>
                    student.id ===
                    editingStudentId
                      ? updatedStudent
                      : student,
                ),
            );
            
            // Notify the specific student that their details were updated
            addNotification({
              title: "Profile Updated",
              message: `Your profile details were updated by the school administration.`,
              details: `The school administration has updated your personal or academic records. Please review your profile for the latest information.`,
              targetRole: 'STUDENT',
              studentId: updatedStudent.id,
              classId: updatedStudent.className
            });
          },
        },
      );

      return;
    }

    const newStudent: Student = {
      id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `std_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      schoolId: user?.schoolId || "school-1",
      attendance: 100,
      firstLogin: true,
      ...values,
      password: values.password || "Welcome@123",
    };

    createStudentMutation.mutate(
      newStudent,
      {
        onSuccess: (createdStudent) => {
          setLocalStudents((previous) => [createdStudent, ...previous]);

          // Notify teachers of the same class
          addNotification({
            title: "New Student Added",
            message: `New student ${createdStudent.firstName} ${createdStudent.lastName} added to Class ${createdStudent.className}`,
            details: `**Name:** ${createdStudent.firstName} ${createdStudent.lastName}\n**Class:** ${createdStudent.className}\n**Roll No:** ${createdStudent.rollNumber}\n\nPlease welcome the new student to your class.`,
            targetRole: 'TEACHER',
            classId: createdStudent.className,
          });
          
          addNotification({
            title: "Admission Completed",
            message: `New student admission completed: ${createdStudent.firstName} ${createdStudent.lastName} (Class ${createdStudent.className})`,
            details: `**Student:** ${createdStudent.firstName} ${createdStudent.lastName}\n**Class:** ${createdStudent.className}\n**Roll No:** ${createdStudent.rollNumber}\n**Contact:** ${createdStudent.phone || 'N/A'}\n\nThe student profile was successfully created and assigned.`,
            targetRole: 'MANAGER',
          });
        },
      },
    );
  };

  /*
   =========================
   DELETE
   =========================
  */

  const removeStudent = (
    studentId: string,
    onSuccess?: () => void,
  ) => {
    deleteStudentMutation.mutate(
      studentId,
      {
        onSuccess: () => {
          setLocalStudents(
            (previous) =>
              previous.filter(
                (student) =>
                  student.id !==
                  studentId,
              ),
          );

          onSuccess?.();
        },
      },
    );
  };

  return {
    localStudents,

    setLocalStudents,

    saveStudent,

    removeStudent,

    createStudentMutation,

    updateStudentMutation,

    deleteStudentMutation,
  };
}