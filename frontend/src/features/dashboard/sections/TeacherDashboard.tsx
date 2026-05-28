import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceChart from "../components/AttendanceChart";
import DashboardHeader from "../components/DashboardHeader";
import TeacherQuickActions from "../components/TeacherQuickActions";
import TeacherPendingTasks from "../components/TeacherPendingTasks";
import FirstLoginCongrats from "../components/FirstLoginCongrats";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";
import { Clock, Users, BookOpen, Coffee, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { getAttendanceRecords } from "@/features/attendance/services/attendance.service";
import type { AttendanceRecord } from "@/features/attendance/types/attendance.types";
import { getTeachers } from "@/features/teacher/services/teacher.service";

import type { AttendanceData } from "../types/dashboard.types";

type TeacherDashboardProps = {
  attendance: AttendanceData[];
};

type TimetableEntry = {
  id: string;
  className: string;
  subject: string;
  day: string;
  periodIndex: number;
  teacherId: string;
};

type Period = { index: number; time: string; isLunch?: boolean };

const DEFAULT_PERIODS: Period[] = [
  { index: 0, time: "09:00 AM - 09:45 AM" },
  { index: 1, time: "09:45 AM - 10:30 AM" },
  { index: 2, time: "10:30 AM - 11:15 AM" },
  { index: 3, time: "11:15 AM - 11:45 AM", isLunch: true },
  { index: 4, time: "11:45 AM - 12:30 PM" },
  { index: 5, time: "12:30 PM - 01:15 PM" },
];

type TimelineEvent = {
  id: string;
  type: 'class' | 'lunch';
  periodIndex: number;
  time: string;
  className?: string;
  subject?: string;
};

function TeacherDashboard({ attendance }: TeacherDashboardProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [allClassesCount, setAllClassesCount] = useState(0);
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [coordinatorClasses, setCoordinatorClasses] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch teacher details to see if they are a coordinator
    getTeachers(user.schoolId).then(teachers => {
      const me = teachers.find(t => t.id === user.id);
      if (me && me.coordinatorFor) {
        setCoordinatorClasses(me.coordinatorFor);
      }
    });
    
    // Load attendance records for today
    const todayStr = new Date().toISOString().split("T")[0];
    const myRecs = getAttendanceRecords(user.schoolId).filter(r => (r.teacherId === user.id || (r as any).markedByTeacherId === user.id) && r.date === todayStr);
    setTodayRecords(myRecs);

    const pKey = user.schoolId ? `mock_periods_${user.schoolId}` : "mock_periods";
    const savedPeriods = localStorage.getItem(pKey);
    const currentPeriods: Period[] = savedPeriods ? JSON.parse(savedPeriods) : DEFAULT_PERIODS;

    const ttKey = user.schoolId ? `mock_timetable_${user.schoolId}` : "mock_timetable";
    const saved = localStorage.getItem(ttKey);
    if (saved) {
      const entries: TimetableEntry[] = JSON.parse(saved);
      const myEntries = entries.filter((e) => e.teacherId === user.id);
      
      // Notification Logic
      const lastCount = parseInt(localStorage.getItem(`last_assigned_count_${user.id}`) || "0");
      if (myEntries.length > lastCount) {
        toast.success("You have been assigned to new classes by the Manager!");
        localStorage.setItem(`last_assigned_count_${user.id}`, myEntries.length.toString());
      }

      setAllClassesCount(myEntries.length);

      // Get Today's Classes
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDay = days[new Date().getDay()];
      
      const todays = myEntries.filter(e => e.day === currentDay);
      
      const events: TimelineEvent[] = [];
      
      currentPeriods.forEach(p => {
        if (p.isLunch) {
          events.push({ id: `lunch-${p.index}`, type: 'lunch', periodIndex: p.index, time: p.time });
        } else {
          const classEntry = todays.find(c => c.periodIndex === p.index);
          if (classEntry) {
            events.push({ id: classEntry.id, type: 'class', periodIndex: p.index, time: p.time, className: classEntry.className, subject: classEntry.subject || "" });
          }
        }
      });
      
      events.sort((a, b) => a.periodIndex - b.periodIndex);
      setTimelineEvents(events);
    } else {
      // If no timetable, at least show lunch
      const events: TimelineEvent[] = [];
      currentPeriods.forEach(p => {
        if (p.isLunch) {
          events.push({ id: `lunch-${p.index}`, type: 'lunch', periodIndex: p.index, time: p.time });
        }
      });
      setTimelineEvents(events);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <FirstLoginCongrats role="TEACHER" />

      <DashboardHeader
        title="Teacher Dashboard"
        subtitle={`Welcome back! You have ${allClassesCount} total classes assigned this week.`}
      />

      {coordinatorClasses.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-primary/20 rounded-lg shrink-0">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary-900 dark:text-primary-100">Class Teacher</h3>
            <p className="text-sm text-primary-800/80 dark:text-primary-200/80 mt-0.5">
              You are the designated Class Teacher for: <strong className="font-semibold text-primary">{coordinatorClasses.map(c => `Class ${c}`).join(", ")}</strong>. You have permission to manage the timetable and oversee these classes.
            </p>
          </div>
        </div>
      )}
      
      <TeacherQuickActions />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <TeacherPendingTasks />
          <AttendanceChart data={attendance} />
        </div>

        {/* TODAY'S SCHEDULE TIMELINE */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Today's Schedule</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {timelineEvents.filter(e => e.type === 'class').length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <span className="text-2xl opacity-50">🏖️</span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No classes today!</p>
                <p className="text-xs text-slate-400 mt-1">Enjoy your free time or prepare for upcoming lectures.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {timelineEvents.map((entry, idx) => {
                  const isLast = idx === timelineEvents.length - 1;
                  
                  if (entry.type === 'lunch') {
                    return (
                      <div key={entry.id} className={`relative pl-6 ${!isLast ? 'border-l-2 border-slate-200 dark:border-slate-800 pb-6' : ''}`}>
                        <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900" />
                        
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded uppercase">Break</span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{entry.time}</span>
                        </div>
                        
                        <div className="mt-2 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-amber-700 dark:text-amber-500">Lunch Break</h3>
                            <Coffee className="h-4 w-4 text-amber-500" />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={entry.id} className={`relative pl-6 ${!isLast ? 'border-l-2 border-slate-200 dark:border-slate-800 pb-6' : ''}`}>
                      <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-white dark:ring-slate-900" />
                      
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">Period {entry.periodIndex + 1}</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{entry.time}</span>
                      </div>
                      
                      <div className="mt-2 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Class {entry.className}</h3>
                          <BookOpen className="h-4 w-4 text-slate-400" />
                        </div>
                        {entry.subject && (
                          <p className="text-xs text-slate-500 mt-0.5">{entry.subject}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Regular Class</span>
                          </div>
                          {(() => {
                            const isMarked = todayRecords.some(r => 
                              String(r.className) === String(entry.className) && 
                              (r.subject || "") === (entry.subject || "") && 
                              Number(r.periodIndex) === Number(entry.periodIndex)
                            );
                            return isMarked ? (
                              <button
                                onClick={() => navigate(`/attendance?class=${entry.className}&subject=${encodeURIComponent(entry.subject || '')}&period=${entry.periodIndex}`)}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Marked
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate(`/attendance?class=${entry.className}&subject=${encodeURIComponent(entry.subject || '')}&period=${entry.periodIndex}`)}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 px-2.5 py-1.5 rounded-lg transition-colors"
                              >
                                <ClipboardCheck className="h-3.5 w-3.5" /> Mark Attendance
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
