import apiClient from "@/lib/axios";
import { getStudentAverageAttendance, getAttendanceRecords } from "@/features/attendance/services/attendance.service";

import type { Student } from "../types/student.types";

export async function getStudents(schoolId?: string) {
  const localStudents = JSON.parse(localStorage.getItem("mock_students") || "[]");
  const all = Array.isArray(localStudents) ? localStudents : [];

  const filtered = schoolId ? all.filter((s: any) => s.schoolId === schoolId) : all;

  return filtered.map((s: any) => {
    return { ...s, attendance: getStudentAverageAttendance(s.id, schoolId) };
  });
}

export async function createStudent(
  student: Student,
) {
  return new Promise<Student>((resolve) => {
    setTimeout(() => {
      const localStudents = JSON.parse(localStorage.getItem("mock_students") || "[]");
      localStudents.unshift(student);
      localStorage.setItem("mock_students", JSON.stringify(localStudents));
      resolve(student);
    }, 800);
  });
}

export async function deleteStudent(
  studentId: string,
) {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const localStudents: Student[] = JSON.parse(localStorage.getItem("mock_students") || "[]");
      const filtered = localStudents.filter(s => s.id !== studentId);
      localStorage.setItem("mock_students", JSON.stringify(filtered));
      resolve(studentId);
    }, 800);
  });
}


export async function updateStudent(
  student: Student,
) {
  return new Promise<Student>((resolve) => {
    setTimeout(() => {
      const localStudents: Student[] = JSON.parse(localStorage.getItem("mock_students") || "[]");
      const idx = localStudents.findIndex(s => s.id === student.id);
      if (idx !== -1) {
        localStudents[idx] = student;
        localStorage.setItem("mock_students", JSON.stringify(localStudents));
      }
      resolve(student);
    }, 800);
  });
}