import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type NotificationType = "leave" | "homework" | "notice" | "complaint" | "message" | "attendance" | "result" | "fee" | "general";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  details?: string;
  targetRole: 'MANAGER' | 'TEACHER' | 'STUDENT' | 'ALL';
  /** optional class identifier, e.g., "10A" */
  classId?: string;
  /** optional specific student identifier */
  studentId?: string;
  createdAt: Date;
  
  // New fields for red dot architecture
  type: NotificationType;
  isRead: boolean;
  link?: string;
  schoolId?: string;
};

type NotificationState = {
  notifications: AppNotification[];
  /** Add a new notification */
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  /** Clear all notifications */
  clear: () => void;
  /** Remove a specific notification by ID */
  removeNotification: (id: string) => void;
  /** Clear all notifications for a specific role */
  clearRoleNotifications: (role: string) => void;
  
  // New methods for Red Dot Architecture
  markAsRead: (id: string) => void;
  markModuleAsRead: (type: NotificationType) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getModuleUnreadCount: (type: NotificationType) => number;
  hasUnreadInModule: (type: NotificationType) => boolean;
};

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [],
        addNotification: (payload: Omit<AppNotification, 'id' | 'createdAt' | 'isRead' | 'schoolId'>) => {
          // Auto-attach current user's schoolId
          const userStr = localStorage.getItem("user");
          let currentSchoolId = "school-1";
          if (userStr) {
            try {
              const userObj = JSON.parse(userStr);
              if (userObj?.schoolId) currentSchoolId = userObj.schoolId;
            } catch (e) {}
          }
          
          const newNotification: AppNotification = {
            id: generateId(),
            createdAt: new Date(),
            isRead: false,
            schoolId: currentSchoolId,
            ...payload,
          };
          set({ notifications: [newNotification, ...get().notifications] });
        },
        clear: () => {
          const userStr = localStorage.getItem("user");
          let currentSchoolId = "school-1";
          if (userStr) {
            try { currentSchoolId = JSON.parse(userStr)?.schoolId || "school-1"; } catch (e) {}
          }
          set({ 
            notifications: get().notifications.filter(n => n.schoolId !== currentSchoolId) 
          });
        },
        removeNotification: (id: string) => {
          set({ notifications: get().notifications.filter(n => n.id !== id) });
        },
        clearRoleNotifications: (role: string) => {
          const userStr = localStorage.getItem("user");
          let currentSchoolId = "school-1";
          if (userStr) {
            try { currentSchoolId = JSON.parse(userStr)?.schoolId || "school-1"; } catch (e) {}
          }
          set({ 
            notifications: get().notifications.filter(n => n.targetRole !== role || n.schoolId !== currentSchoolId) 
          });
        },
        
        markAsRead: (id: string) => {
          set({
            notifications: get().notifications.map((n) => 
              n.id === id ? { ...n, isRead: true } : n
            )
          });
        },
        
        markModuleAsRead: (type: NotificationType) => {
          set({
            notifications: get().notifications.map((n) => 
              n.type === type ? { ...n, isRead: true } : n
            )
          });
        },
        
        markAllAsRead: () => {
          const userStr = localStorage.getItem("user");
          let currentSchoolId = "school-1";
          if (userStr) {
            try { currentSchoolId = JSON.parse(userStr)?.schoolId || "school-1"; } catch (e) {}
          }
          set({
            notifications: get().notifications.map((n) => 
              n.schoolId === currentSchoolId ? { ...n, isRead: true } : n
            )
          });
        },
        
        getUnreadCount: () => {
          const userStr = localStorage.getItem("user");
          let currentSchoolId = "school-1";
          if (userStr) {
            try { currentSchoolId = JSON.parse(userStr)?.schoolId || "school-1"; } catch (e) {}
          }
          return get().notifications.filter(n => !n.isRead && n.schoolId === currentSchoolId).length;
        },
        
        getModuleUnreadCount: (type: NotificationType) => {
          const userStr = localStorage.getItem("user");
          let currentSchoolId = "school-1";
          if (userStr) {
            try { currentSchoolId = JSON.parse(userStr)?.schoolId || "school-1"; } catch (e) {}
          }
          return get().notifications.filter(n => n.type === type && !n.isRead && n.schoolId === currentSchoolId).length;
        },
        
        hasUnreadInModule: (type: NotificationType) => {
          const userStr = localStorage.getItem("user");
          let currentSchoolId = "school-1";
          if (userStr) {
            try { currentSchoolId = JSON.parse(userStr)?.schoolId || "school-1"; } catch (e) {}
          }
          return get().notifications.some(n => n.type === type && !n.isRead && n.schoolId === currentSchoolId);
        }
      }),
      {
        name: 'mock_notifications', // key in localStorage
      }
    )
  )
);
