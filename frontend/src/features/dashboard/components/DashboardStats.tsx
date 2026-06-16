import { GraduationCap, IndianRupee, UserCheck, Users } from "lucide-react";

import StatCard from "@/components/shared/StatCard";

import type { DashboardStat } from "../types/dashboard.types";
import { useNotificationStore, NotificationType } from "@/features/notification/store/notificationStore";

type DashboardStatsProps = {
  stats?: DashboardStat[];
};

const icons = [
  <Users className="h-5 w-5" />,
  <GraduationCap className="h-5 w-5" />,
  <IndianRupee className="h-5 w-5" />,
  <UserCheck className="h-5 w-5" />,
];

function DashboardStats({ stats = [] }: DashboardStatsProps) {
  const safeStats = Array.isArray(stats) ? stats : [];
  const getModuleUnreadCount = useNotificationStore(state => state.getModuleUnreadCount);
  const hasUnreadInModule = useNotificationStore(state => state.hasUnreadInModule);

  const getStatBadge = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("leave")) return { type: "leave" as NotificationType, showCount: true };
    if (t.includes("complaint")) return { type: "complaint" as NotificationType, showCount: true };
    if (t.includes("notice") || t.includes("announcement")) return { type: "notice" as NotificationType, showCount: false };
    if (t.includes("student")) return { type: "general" as NotificationType, showCount: false };
    return null;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {safeStats.map((stat, index) => {
        if (!stat) return null;
        const badgeInfo = getStatBadge(stat.title || "");
        let badgeCount = 0;
        let showDot = false;

        if (badgeInfo) {
          if (badgeInfo.showCount) {
            badgeCount = getModuleUnreadCount(badgeInfo.type);
          } else {
            showDot = hasUnreadInModule(badgeInfo.type);
          }
        }

        return (
          <StatCard
            key={stat.title || index}
            title={stat.title || ""}
            value={stat.value || ""}
            icon={icons[index % icons.length]}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            badgeCount={badgeCount}
            showDot={showDot}
          />
        );
      })}
    </div>
  );
}

export default DashboardStats;
