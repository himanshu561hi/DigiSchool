import { Bell, X, Trash2, Info } from "lucide-react";
import { useNotificationStore, type AppNotification } from "@/features/notification/store/notificationStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getStudents } from "@/features/student/services/student.service";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

function NotificationsPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const clearRoleNotifications = useNotificationStore((state) => state.clearRoleNotifications);

  const [studentClassName, setStudentClassName] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  useEffect(() => {
    if (role === "STUDENT" && user?.id) {
      getStudents(user.schoolId).then(students => {
        const me = students.find(s => s.id === user.id);
        if (me?.className) {
          setStudentClassName(me.className);
        }
      });
    }
  }, [role, user?.id]);

  // Filter notifications relevant to current role
  const relevant = notifications.filter((n) => {
    if (!role) return false;
    if (n.schoolId && n.schoolId !== user?.schoolId) return false;
    if (n.targetRole !== role.toUpperCase()) return false;
    
    // For student, check if it targets specific class or student
    if (role.toUpperCase() === "STUDENT") {
      if (n.studentId && n.studentId !== user?.id) return false;
      if (n.classId && n.classId !== studentClassName) return false;
    }
    
    return true;
  });

  const handleClearAll = () => {
    if (role) {
      clearRoleNotifications(role.toUpperCase());
    }
  };

  return (
    <div className="space-y-4 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" /> Notifications
        </h1>
        {relevant.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg dark:text-rose-400 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Clear All
          </button>
        )}
      </div>
      {relevant.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No notifications.</p>
      ) : (
        <ul className="space-y-3">
          {relevant.map((n) => (
            <li
              key={n.id}
              onClick={() => setSelectedNotification(n)}
              className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="pr-12">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {n.title || "Notification"}
                  </span>
                  <p className="text-xs font-semibold text-slate-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-slate-800 dark:text-slate-100 font-medium line-clamp-2">{n.message}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Info className="h-4 w-4" /> View Details
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(n.id);
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                title="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedNotification && (
        <Modal
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
          title={selectedNotification.title || "Notification Details"}
          size="lg"
        >
          <div className="p-1 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
                {selectedNotification.message}
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Received on: {new Date(selectedNotification.createdAt).toLocaleString()}
              </p>
            </div>
            
            {selectedNotification.details && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Detailed Information</h4>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed"
                     dangerouslySetInnerHTML={{
                       __html: selectedNotification.details.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
                     }}
                />
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default NotificationsPage;
