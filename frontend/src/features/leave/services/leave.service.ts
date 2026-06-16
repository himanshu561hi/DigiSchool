import { LeaveApplication, LeaveStatus } from "../types/leave.types";

const getLeaveStorageKey = (schoolId?: string) => schoolId ? `mock_leaves_${schoolId}` : "mock_leaves";

export const getLeaves = (schoolId?: string): LeaveApplication[] => {
  const data = localStorage.getItem(getLeaveStorageKey(schoolId));
  return data ? JSON.parse(data) : [];
};

export const saveLeaves = (leaves: LeaveApplication[], schoolId?: string) => {
  localStorage.setItem(getLeaveStorageKey(schoolId), JSON.stringify(leaves));
};

export const applyLeave = (leave: Omit<LeaveApplication, "id" | "status" | "appliedOn">, schoolId?: string) => {
  const leaves = getLeaves(schoolId);
  const newLeave: LeaveApplication = {
    ...leave,
    id: `leave-${Date.now()}`,
    status: leave.role === "STUDENT" ? "PENDING_TEACHER" : "PENDING_MANAGER",
    appliedOn: new Date().toISOString(),
  };
  leaves.push(newLeave);
  saveLeaves(leaves, schoolId);
  return newLeave;
};

export const updateLeaveStatus = (
  id: string, 
  status: LeaveStatus, 
  remark: string, 
  reviewerName: string,
  remarkField: "teacherRemark" | "managerRemark",
  schoolId?: string
) => {
  const leaves = getLeaves(schoolId);
  const updated = leaves.map(l => 
    l.id === id ? { ...l, status, [remarkField]: remark, reviewedBy: reviewerName } : l
  );
  saveLeaves(updated, schoolId);
};
