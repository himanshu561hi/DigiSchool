export type ExamStatus = "UPCOMING" | "ONGOING" | "COMPLETED";
export type PaperStatus = "PENDING" | "UPLOADED" | "APPROVED" | "REJECTED";

export type ExamSubject = {
  id: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  teacherId: string | null;
  teacherName?: string;
  paperPdfUrl: string | null;
  paperStatus: PaperStatus;
  rejectionReason?: string;
  dueDate?: string;
  marksUploaded?: boolean;
};

export type ExamSchedule = {
  id: string;
  schoolId?: string;
  title: string;
  className: string;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  subjects: ExamSubject[];
  createdAt: string;
};

export type AdmitCard = {
  id: string;
  studentId: string;
  examId: string;
  rollNumber: string;
  isGenerated: boolean;
};

export type AdmitCardApproval = {
  studentId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  attendance: number;
  feeDue: boolean;
  examId: string;
  approved: boolean;
};
