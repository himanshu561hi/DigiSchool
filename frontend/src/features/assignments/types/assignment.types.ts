export type Assignment = {
  id: string;
  schoolId?: string;
  title: string;
  description: string;
  className: string;
  subject: string;
  teacherId: string;
  dueDate: string;
  createdAt: string;
  /** base64-encoded PDF content (simulated file upload) */
  attachmentName?: string;
  attachmentData?: string;
};

export type SubmissionStatus = "PENDING" | "SUBMITTED" | "GRADED";

export type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string | null;
  status: SubmissionStatus;
  /** base64-encoded PDF submitted by student */
  fileAttachmentName?: string;
  fileAttachmentData?: string;
  /** Teacher review / checked status */
  checkedAt?: string | null;
  teacherRemarks?: string;
};
