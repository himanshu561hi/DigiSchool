import AttendanceChart from "../components/AttendanceChart";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import QuickActions from "../components/QuickActions";
import RecentActivities from "../components/RecentActivities";
import RevenuePlaceholder from "../components/RevenuePlaceholder";
import FirstLoginCongrats from "../components/FirstLoginCongrats";

import type {
  AttendanceData,
  DashboardStat,
  RecentActivity,
} from "../types/dashboard.types";

type ManagerDashboardProps = {
  stats: DashboardStat[];

  attendance: AttendanceData[];

  activities: RecentActivity[];

  revenue?: any[]; // Update with correct type when available
  
  onTimeframeChange?: (days: number) => void;
};

function ManagerDashboard({
  stats,
  attendance,
  activities,
  revenue,
  onTimeframeChange,
}: ManagerDashboardProps) {
  return (
    <div className="space-y-6">
      <FirstLoginCongrats role="MANAGER" />

      <DashboardHeader
        title="Dashboard"
        subtitle="Enterprise school management overview"
      />

      <DashboardStats stats={stats} />

      <div className={`grid gap-6 ${revenue && revenue.length > 0 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <AttendanceChart data={attendance} onTimeframeChange={onTimeframeChange} />

        <RevenuePlaceholder data={revenue} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivities activities={activities} />

        <QuickActions />
      </div>
    </div>
  );
}

export default ManagerDashboard;
