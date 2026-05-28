export type LeaveStatus = "PENDING_TEACHER" | "PENDING_MANAGER" | "APPROVED" | "REJECTED";
export type LeaveRole = "STUDENT" | "TEACHER";

export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  role: LeaveRole;
  className?: string; // Only for students
  subject: string;
  startDate: string;
  endDate: string;
  description: string;
  status: LeaveStatus;
  appliedOn: string;
  documentUrl?: string;
  teacherRemark?: string;
  managerRemark?: string;
  reviewedBy?: string; // Last reviewed by
}
