export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type AttendanceRecord = {
  id: string;
  schoolId?: string;
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  periodIndex: number;
  status: AttendanceStatus;
  markedAt: string; // ISO timestamp
  remarks?: string;
};