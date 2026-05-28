import { useEffect, useState } from "react";

import {
  getAttendanceData,
  getManagerStats,
  getRecentActivities,
} from "../services/dashboard.service";

import type {
  AttendanceData,
  DashboardStat,
  RecentActivity,
} from "../types/dashboard.types";
import { useAuthStore } from "@/features/auth/store/authStore";

function useDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<DashboardStat[]>([]);

  const [attendance, setAttendance] =
    useState<AttendanceData[]>([]);

  const [activities, setActivities] =
    useState<RecentActivity[]>([]);

  const fetchAttendance = async (days: number) => {
    try {
      const data = await getAttendanceData(user?.role, user?.id, days, user?.schoolId);
      setAttendance(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          const [
            statsData,
            attendanceData,
            activitiesData,
          ] = await Promise.all([
            getManagerStats(user?.schoolId),
            getAttendanceData(user?.role, user?.id, 7, user?.schoolId),
            getRecentActivities(),
          ]);

          setStats(statsData);

          setAttendance(attendanceData);

          setActivities(activitiesData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    void loadDashboard();
  }, []);

  return {
    loading,
    stats,
    attendance,
    activities,
    fetchAttendance,
  };
}

export default useDashboard;