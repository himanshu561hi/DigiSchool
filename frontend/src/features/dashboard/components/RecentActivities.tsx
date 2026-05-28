import type { RecentActivity } from "../types/dashboard.types";

type Props = {
  activities?: RecentActivity[];
};

function RecentActivities({ activities = [] }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Recent Activities
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Latest school activities and updates.
        </p>
      </div>

      <div className="space-y-4">
        {Array.isArray(activities) &&
          activities.map((activity) => {
            if (!activity) return null;
            return (
              <div
                key={activity.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800"
              >
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {activity.title || ""}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {activity.description || activity.time || ""}
                </p>
              </div>
            );
          })}

        {activities.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No recent activities available.
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentActivities;
