import type { Assignment, AssignmentSubmission } from "../types/assignment.types";

export const getAssignments = (schoolId?: string): Assignment[] => {
  const data = localStorage.getItem("mock_assignments");
  const all: Assignment[] = data ? JSON.parse(data) : [];
  return schoolId ? all.filter(a => a.schoolId === schoolId) : all;
};

export const saveAssignment = (assignment: Assignment) => {
  const data = localStorage.getItem("mock_assignments");
  const assignments: Assignment[] = data ? JSON.parse(data) : [];
  assignments.push(assignment);
  localStorage.setItem("mock_assignments", JSON.stringify(assignments));
};

export const deleteAssignment = (id: string) => {
  const assignments = getAssignments().filter(a => a.id !== id);
  localStorage.setItem("mock_assignments", JSON.stringify(assignments));
  
  // Clean up submissions
  const submissions = getSubmissions().filter(s => s.assignmentId !== id);
  localStorage.setItem("mock_submissions", JSON.stringify(submissions));
};

export const getSubmissions = (): AssignmentSubmission[] => {
  const data = localStorage.getItem("mock_submissions");
  return data ? JSON.parse(data) : [];
};

export const saveSubmission = (submission: AssignmentSubmission) => {
  const submissions = getSubmissions();
  const existingIndex = submissions.findIndex(s => s.id === submission.id);
  if (existingIndex >= 0) {
    submissions[existingIndex] = submission;
  } else {
    submissions.push(submission);
  }
  localStorage.setItem("mock_submissions", JSON.stringify(submissions));
};

export const initSubmissionsForAssignment = (assignmentId: string, students: {id: string, firstName: string, lastName: string}[]) => {
  const submissions = getSubmissions();
  students.forEach(s => {
    submissions.push({
      id: `sub_${Date.now()}_${s.id}_${Math.random().toString(36).substr(2, 9)}`,
      assignmentId,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      content: "",
      submittedAt: null,
      status: "PENDING"
    });
  });
  localStorage.setItem("mock_submissions", JSON.stringify(submissions));
};
