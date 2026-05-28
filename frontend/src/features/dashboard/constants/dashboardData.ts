import type {
  AttendanceData,
  DashboardStat,
  RecentActivity,
} from "../types/dashboard.types";

export const attendanceData: AttendanceData[] = [
  {
    month: "Jan",
    attendance: 88,
  },

  {
    month: "Feb",
    attendance: 91,
  },

  {
    month: "Mar",
    attendance: 93,
  },

  {
    month: "Apr",
    attendance: 90,
  },

  {
    month: "May",
    attendance: 95,
  },
];

export const recentActivities: RecentActivity[] = [
  {
    id: 1,
    title: "New student admission completed",
    time: "2 mins ago",
  },

  {
    id: 2,
    title: "Teacher attendance updated",
    time: "10 mins ago",
  },

  {
    id: 3,
    title: "Fee payment received",
    time: "25 mins ago",
  },
];

export const managerStats: DashboardStat[] = [
  {
    title: "Total Students",
    value: "2,450",
    change: "+12%",
    changeType: "increase",
    description: "From last month",
  },

  {
    title: "Total Teachers",
    value: "145",
    change: "+4%",
    changeType: "increase",
    description: "Active staff",
  },

  {
    title: "Revenue",
    value: "₹12.4L",
    change: "+18%",
    changeType: "increase",
    description: "Monthly income",
  },

  {
    title: "Attendance",
    value: "92%",
    change: "-1.2%",
    changeType: "decrease",
    description: "This week",
  },
];