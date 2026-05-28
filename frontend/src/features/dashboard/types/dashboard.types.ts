export type AttendanceData = {
  label?: string;
  month?: string;
  attendance: number;
  teachers?: number;
};

export type RecentActivity = {
  id: number;

  title: string;

  time: string;

  description?: string;
};

export type DashboardStat = {
  title: string;

  value: string;

  change?: string;

  changeType?: "increase" | "decrease" | "neutral";

  description?: string;
};