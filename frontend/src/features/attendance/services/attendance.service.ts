import type { AttendanceRecord } from "../types/attendance.types";

const getStudentAttendanceKey = (schoolId?: string) => schoolId ? `mock_student_attendance_${schoolId}` : "mock_student_attendance";
const getTeacherAttendanceKey = (schoolId?: string) => schoolId ? `mock_teacher_attendance_${schoolId}` : "mock_teacher_attendance";

export const getAttendanceRecords = (schoolId?: string): AttendanceRecord[] => {
  const data = localStorage.getItem(getStudentAttendanceKey(schoolId));
  return data ? JSON.parse(data) : [];
};

export const getTeacherAttendanceRecords = (schoolId?: string): any[] => {
  const data = localStorage.getItem(getTeacherAttendanceKey(schoolId));
  return data ? JSON.parse(data) : [];
};

export const saveTeacherAttendanceRecords = (newRecords: any[], schoolId?: string) => {
  const existing = getTeacherAttendanceRecords(schoolId);
  // Upsert logic for teacher attendance (date + teacherId)
  const updated = [...existing];
  newRecords.forEach(nr => {
    const idx = updated.findIndex(r => r.teacherId === nr.teacherId && r.date === nr.date);
    if (idx >= 0) updated[idx] = nr;
    else updated.push(nr);
  });
  localStorage.setItem(getTeacherAttendanceKey(schoolId), JSON.stringify(updated));
};

const saveAll = (records: AttendanceRecord[], schoolId?: string) => {
  localStorage.setItem(getStudentAttendanceKey(schoolId), JSON.stringify(records));
};

export const saveAttendanceRecords = (newRecords: AttendanceRecord[], schoolId?: string) => {
  const existing = getAttendanceRecords(schoolId);
  // Upsert: match on studentId + date + subject + periodIndex
  const updated = [...existing];
  newRecords.forEach(nr => {
    const idx = updated.findIndex(r =>
      r.studentId === nr.studentId &&
      r.date === nr.date &&
      r.subject === nr.subject &&
      r.periodIndex === nr.periodIndex
    );
    if (idx >= 0) updated[idx] = nr;
    else updated.push(nr);
  });
  saveAll(updated, schoolId);
};

export const updateAttendanceRecord = (updated: AttendanceRecord, schoolId?: string) => {
  const records = getAttendanceRecords(schoolId);
  const idx = records.findIndex(r => r.id === updated.id);
  if (idx >= 0) records[idx] = updated;
  saveAll(records, schoolId);
};

/** Get attendance for a specific date, class, subject, period */
export const getAttendanceForSession = (
  date: string,
  className: string,
  subject: string,
  periodIndex: number,
  schoolId?: string
): AttendanceRecord[] => {
  return getAttendanceRecords(schoolId).filter(
    r => r.date === date && r.className === className && r.subject === subject && r.periodIndex === periodIndex
  );
};

/** Get average attendance % for a student across all subjects in current year */
export const getStudentAverageAttendance = (studentId: string, schoolId?: string): number => {
  const currentYear = new Date().getFullYear();
  const records = getAttendanceRecords(schoolId).filter(r => {
    return r.studentId === studentId && new Date(r.date).getFullYear() === currentYear;
  });
  if (records.length === 0) return 0;
  const presentCount = records.filter(r => r.status === "PRESENT" || r.status === "LATE").length;
  return Math.round((presentCount / records.length) * 100);
};

/** Export CSV for a class/subject */
export const exportAttendanceCSV = (
  className: string,
  subject?: string,
  teacherName?: string,
  schoolId?: string
): void => {
  let records = getAttendanceRecords(schoolId).filter(r => r.className === className);
  if (subject) records = records.filter(r => r.subject === subject);
  if (records.length === 0) {
    alert("No attendance records to export.");
    return;
  }

  const header = ["Date", "Student Name", "Student ID", "Subject", "Period", "Status", "Marked At"];
  const rows = records
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(r => [
      r.date,
      r.studentName,
      r.studentId,
      r.subject,
      String(r.periodIndex + 1),
      r.status,
      new Date(r.markedAt).toLocaleString()
    ]);

  const csv = [header, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_class${className}${subject ? `_${subject}` : ""}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
