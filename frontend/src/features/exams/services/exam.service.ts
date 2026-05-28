import { ExamSchedule, ExamSubject, PaperStatus, AdmitCard, AdmitCardApproval } from "../types/exam.types";

const getExamsKey = (schoolId?: string) => schoolId ? `mock_exams_${schoolId}` : "mock_exams";
const getAdmitCardsKey = (schoolId?: string) => schoolId ? `mock_admit_cards_${schoolId}` : "mock_admit_cards";
const getAdmitApprovalsKey = (schoolId?: string) => schoolId ? `mock_admit_approvals_${schoolId}` : "mock_admit_approvals";

export const getExams = async (schoolId?: string): Promise<ExamSchedule[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem(getExamsKey(schoolId));
      const all: ExamSchedule[] = stored ? JSON.parse(stored) : [];
      // Filter by schoolId if provided. Exams with no schoolId (legacy seed data) are excluded when filtering.
      const filtered = schoolId ? all.filter(e => e.schoolId === schoolId) : all;
      resolve(filtered);
    }, 400);
  });
};

export const saveExams = (exams: ExamSchedule[], schoolId?: string) => {
  localStorage.setItem(getExamsKey(schoolId), JSON.stringify(exams));
};

export const deleteExam = async (examId: string, schoolId?: string): Promise<void> => {
  const stored = localStorage.getItem(getExamsKey(schoolId));
  const all: ExamSchedule[] = stored ? JSON.parse(stored) : [];
  saveExams(all.filter(e => e.id !== examId), schoolId);
};

export const createExam = async (exam: Omit<ExamSchedule, "id" | "createdAt">): Promise<ExamSchedule> => {
  const schoolId = exam.schoolId;
  const stored = localStorage.getItem(getExamsKey(schoolId));
  const exams: ExamSchedule[] = stored ? JSON.parse(stored) : [];
  const newExam: ExamSchedule = {
    ...exam,
    id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
  };
  exams.push(newExam);
  saveExams(exams, schoolId);
  return newExam;
};

export const createExamForClasses = async (
  baseExam: Omit<ExamSchedule, "id" | "createdAt" | "className">, 
  classes: string[]
): Promise<void> => {
  const schoolId = baseExam.schoolId;
  const stored = localStorage.getItem(getExamsKey(schoolId));
  const exams: ExamSchedule[] = stored ? JSON.parse(stored) : [];
  const timestamp = new Date().toISOString();
  
  classes.forEach(className => {
    const newExam: ExamSchedule = {
      ...baseExam,
      className,
      id: `exam_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      createdAt: timestamp,
    };
    exams.push(newExam);
  });
  
  saveExams(exams, schoolId);
};

export const updateExamPaperStatus = async (
  examId: string, 
  subjectId: string, 
  status: PaperStatus, 
  pdfUrl?: string | null,
  rejectionReason?: string,
  schoolId?: string
): Promise<void> => {
  const stored = localStorage.getItem(getExamsKey(schoolId));
  const exams: ExamSchedule[] = stored ? JSON.parse(stored) : [];
  const exam = exams.find(e => e.id === examId);
  if (exam) {
    const subject = exam.subjects.find(s => s.id === subjectId);
    if (subject) {
      subject.paperStatus = status;
      if (pdfUrl !== undefined) {
        subject.paperPdfUrl = pdfUrl;
      }
      if (rejectionReason !== undefined) {
        subject.rejectionReason = rejectionReason;
      }
    }
  }
  saveExams(exams, schoolId);
};

export const updateMarksStatus = async (
  examId: string,
  subjectId: string,
  marksUploaded: boolean,
  schoolId?: string
): Promise<void> => {
  const stored = localStorage.getItem(getExamsKey(schoolId));
  const exams: ExamSchedule[] = stored ? JSON.parse(stored) : [];
  const exam = exams.find(e => e.id === examId);
  if (exam) {
    const subject = exam.subjects.find(s => s.id === subjectId);
    if (subject) {
      subject.marksUploaded = marksUploaded;
    }
  }
  saveExams(exams, schoolId);
};

export const getAdmitCards = async (schoolId?: string): Promise<AdmitCard[]> => {
  const stored = localStorage.getItem(getAdmitCardsKey(schoolId));
  return stored ? JSON.parse(stored) : [];
};

export const generateAdmitCard = async (studentId: string, examId: string, rollNumber: string, schoolId?: string): Promise<AdmitCard> => {
  const cards = await getAdmitCards(schoolId);
  const existing = cards.find(c => c.studentId === studentId && c.examId === examId);
  if (existing) {
    existing.isGenerated = true;
    localStorage.setItem(getAdmitCardsKey(schoolId), JSON.stringify(cards));
    return existing;
  }
  const newCard: AdmitCard = {
    id: `ac_${Date.now()}`,
    studentId,
    examId,
    rollNumber,
    isGenerated: true,
  };
  cards.push(newCard);
  localStorage.setItem(getAdmitCardsKey(schoolId), JSON.stringify(cards));
  return newCard;
};

// ========= ADMIT CARD APPROVALS =========

export const getAdmitApprovals = (schoolId?: string): AdmitCardApproval[] => {
  const stored = localStorage.getItem(getAdmitApprovalsKey(schoolId));
  return stored ? JSON.parse(stored) : [];
};

export const saveAdmitApprovals = (approvals: AdmitCardApproval[], schoolId?: string) => {
  localStorage.setItem(getAdmitApprovalsKey(schoolId), JSON.stringify(approvals));
};

export const toggleAdmitApproval = (studentId: string, examId: string, approved: boolean, schoolId?: string): void => {
  const approvals = getAdmitApprovals(schoolId);
  const existing = approvals.find(a => a.studentId === studentId && a.examId === examId);
  if (existing) {
    existing.approved = approved;
  } else {
    approvals.push({ studentId, examId, approved });
  }
  saveAdmitApprovals(approvals, schoolId);
};

export const isAdmitCardApproved = (studentId: string, examId: string, schoolId?: string): boolean => {
  const approvals = getAdmitApprovals(schoolId);
  const record = approvals.find(a => a.studentId === studentId && a.examId === examId);
  return record?.approved ?? false;
};
