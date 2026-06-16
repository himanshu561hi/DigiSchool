import type {
  AttendanceData,
  DashboardStat,
  RecentActivity,
} from "../types/dashboard.types";

import {
  managerStats,
  recentActivities,
} from "../constants/dashboardData";

import { getAttendanceRecords, getTeacherAttendanceRecords } from "@/features/attendance/services/attendance.service";
import { getStudents } from "@/features/student/services/student.service";
import { getTeachers } from "@/features/teacher/services/teacher.service";
import { useNotificationStore } from "@/features/notification/store/notificationStore";

/* ========================= */
/* GET MANAGER STATS */
/* ========================= */

export async function getManagerStats(schoolId?: string): Promise<
  DashboardStat[]
> {
  const students = await getStudents(schoolId);
  const teachers = await getTeachers(schoolId);
  
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  
  // Real Attendance Calculation
  const records = getAttendanceRecords(schoolId);
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  
  const getPct = (dateStr: string) => {
    const dayRecords = records.filter(r => r.date === dateStr);
    if (dayRecords.length === 0) return null;
    const present = dayRecords.filter(r => r.status === "PRESENT" || r.status === "LATE").length;
    return (present / dayRecords.length) * 100;
  };
  
  const todayPct = getPct(todayStr);
  const yesterdayPct = getPct(yesterdayStr);
  
  let attPctStr = todayPct !== null ? `${Math.round(todayPct)}%` : "0%";
  let attChange = "0%";
  let attChangeType: "increase" | "decrease" | "neutral" = "neutral";
  
  if (todayPct !== null && yesterdayPct !== null) {
    const diff = todayPct - yesterdayPct;
    attChange = `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
    attChangeType = diff > 0 ? "increase" : diff < 0 ? "decrease" : "neutral";
  }

  // Real New Students Calculation from Notifications
  const notifications = useNotificationStore.getState().notifications.filter(n => n.schoolId === schoolId);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newStudents = notifications.filter(n => 
    (n.title === "Admission Completed" || n.title === "New Student Added") &&
    new Date(n.createdAt) >= thirtyDaysAgo
  ).length;
  
  const studentChangePct = totalStudents > 0 && newStudents > 0 
    ? Math.round((newStudents / Math.max(totalStudents - newStudents, 1)) * 100) 
    : 0;

  const updatedStats = [...managerStats];
  updatedStats[0] = { 
    ...updatedStats[0], 
    value: totalStudents.toString(),
    change: studentChangePct > 0 ? `+${studentChangePct}%` : "0%",
    changeType: studentChangePct > 0 ? "increase" : "neutral",
    description: "From last 30 days"
  };
  
  updatedStats[1] = { 
    ...updatedStats[1], 
    value: totalTeachers.toString(),
    change: "0%",
    changeType: "neutral",
    description: "Stable faculty"
  };
  
  updatedStats[2] = { 
    ...updatedStats[2], 
    value: "₹0",
    change: "0%",
    changeType: "neutral",
    description: "Awaiting fee cycle"
  };
  
  updatedStats[3] = { 
    ...updatedStats[3], 
    value: attPctStr,
    change: attChange,
    changeType: attChangeType,
    description: "vs. Yesterday"
  };

  return updatedStats;
}

/* ========================= */
/* GET ATTENDANCE DATA */
export async function getAttendanceData(role?: string, userId?: string, daysCount: number = 7, schoolId?: string): Promise<
  AttendanceData[]
> {
  return new Promise((resolve) => {
    const allRecords = getAttendanceRecords(schoolId);
    const allTeacherRecords = getTeacherAttendanceRecords(schoolId);
    
    let records = allRecords;
    let teacherRecords = allTeacherRecords;

    if (role === "TEACHER" && userId) {
      records = allRecords.filter(r => r.teacherId === userId);
      // For a specific teacher, maybe we don't show full teacher attendance graph, just their own students
    } else if (role === "STUDENT" && userId) {
      records = allRecords.filter(r => r.studentId === userId);
    }

    const days: AttendanceData[] = [];
    const today = new Date();
    
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      let label = d.toLocaleDateString('en-US', { weekday: 'short' });
      if (daysCount > 14) {
        label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      }

      // Compute student attendance
      const dayRecords = records.filter(r => r.date === dateStr);
      let pct = 0;
      if (dayRecords.length > 0) {
        const present = dayRecords.filter(r => r.status === "PRESENT" || r.status === "LATE").length;
        pct = Math.round((present / dayRecords.length) * 100);
      }

      // Compute teacher attendance
      const dayTeacherRecords = teacherRecords.filter(r => r.date === dateStr);
      let teacherPct = 0;
      if (dayTeacherRecords.length > 0) {
        const presentT = dayTeacherRecords.filter(r => r.status === "PRESENT" || r.status === "LATE").length;
        teacherPct = Math.round((presentT / dayTeacherRecords.length) * 100);
      }

      // If no data exists for that day, we push 0 so it accurately reflects reality instead of mocking.
      days.push({ label, attendance: pct, teachers: teacherPct });
    }

    resolve(days);
  });
}

/* ========================= */
/* GET RECENT ACTIVITIES */
/* ========================= */

export async function getRecentActivities(schoolId?: string): Promise<
  RecentActivity[]
> {
  const notifications = useNotificationStore.getState().notifications.filter(n => n.targetRole === "MANAGER" && n.schoolId === schoolId);
  
  const activities: RecentActivity[] = notifications.slice(0, 6).map((n, idx) => {
    const diffMs = new Date().getTime() - new Date(n.createdAt).getTime();
    const diffMins = Math.round(diffMs / 60000);
    let timeStr = `${diffMins} mins ago`;
    if (diffMins === 0) timeStr = "Just now";
    else if (diffMins >= 1440) timeStr = `${Math.round(diffMins/1440)} days ago`;
    else if (diffMins >= 60) timeStr = `${Math.round(diffMins/60)} hours ago`;

    return {
      id: idx + 1,
      title: n.message,
      time: timeStr
    };
  });

  return activities;
}