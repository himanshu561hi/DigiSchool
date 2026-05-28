import AttendanceChart from "../components/AttendanceChart";
import DashboardHeader from "../components/DashboardHeader";
import FirstLoginCongrats from "../components/FirstLoginCongrats";

import type { AttendanceData } from "../types/dashboard.types";

type StudentDashboardProps = {
  attendance: AttendanceData[];
};

function StudentDashboard({ attendance }: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      <FirstLoginCongrats role="STUDENT" />

      <DashboardHeader
        title="Student Dashboard"
        subtitle="Academic and attendance overview"
      />

      <AttendanceChart data={attendance} />
    </div>
  );
}

export default StudentDashboard;
