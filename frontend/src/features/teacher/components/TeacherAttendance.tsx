import { useState, useEffect } from "react";
import type { Teacher } from "../types/teacher.types";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";
import { getTeacherAttendanceRecords, saveTeacherAttendanceRecords } from "@/features/attendance/services/attendance.service";
import { useAuthStore } from "@/features/auth/store/authStore";

type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

type AttendanceRecord = {
  date: string;
  teacherId: string;
  status: AttendanceStatus;
};

type Props = {
  teachers: Teacher[];
};

export default function TeacherAttendance({ teachers }: Props) {
  const { user } = useAuthStore();
  const today = new Date().toISOString().split("T")[0];
  const activeTeachers = teachers.filter(t => t.status !== "INACTIVE");
  
  // States
  const [todayAttendance, setTodayAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  
  const [viewDetailsDate, setViewDetailsDate] = useState<string | null>(null);
  
  // Edit states
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editAttendance, setEditAttendance] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    // Load persisted history on mount
    const records = getTeacherAttendanceRecords(user?.schoolId);
    setHistory(records);

    // If today is already marked, populate todayAttendance state
    const todayRecords = records.filter((r: AttendanceRecord) => r.date === today);
    if (todayRecords.length > 0) {
      const todayMap: Record<string, AttendanceStatus> = {};
      todayRecords.forEach((r: AttendanceRecord) => { todayMap[r.teacherId] = r.status; });
      setTodayAttendance(todayMap);
    }
  }, [today]);

  const updateTodayStatus = (teacherId: string, status: AttendanceStatus) => {
    setTodayAttendance((prev) => ({ ...prev, [teacherId]: status }));
  };

  const updateEditStatus = (teacherId: string, status: AttendanceStatus) => {
    setEditAttendance((prev) => ({ ...prev, [teacherId]: status }));
  };

  const submitAttendance = () => {
    const newRecords: AttendanceRecord[] = activeTeachers.map((t) => ({
      date: today,
      teacherId: t.id,
      status: todayAttendance[t.id] ?? "ABSENT",
    }));
    
    // Save to persistent storage
    saveTeacherAttendanceRecords(newRecords, user?.schoolId);
    
    // Refresh local history state
    const filteredHistory = history.filter(h => h.date !== today);
    setHistory([...newRecords, ...filteredHistory]);
    toast.success("Attendance submitted successfully!");
  };

  // Group history by date
  const groupedHistory = history.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  const presentTodayCount = Object.values(todayAttendance).filter(v => v === "PRESENT" || v === "HALF_DAY").length;

  const handleEditClick = (date: string) => {
    const records = groupedHistory[date];
    const editMap: Record<string, AttendanceStatus> = {};
    
    // Set default absent for active teachers to ensure they exist
    activeTeachers.forEach(t => { editMap[t.id] = "ABSENT"; });
    
    // Override with saved records
    records.forEach(r => { editMap[r.teacherId] = r.status; });
    
    setEditAttendance(editMap);
    setEditingDate(date);
  };

  const saveEditedAttendance = () => {
    if (!editingDate) return;
    
    const newRecords: AttendanceRecord[] = activeTeachers.map((t) => ({
      date: editingDate,
      teacherId: t.id,
      status: editAttendance[t.id] ?? "ABSENT",
    }));
    
    // Save to persistent storage
    saveTeacherAttendanceRecords(newRecords, user?.schoolId);
    
    const filteredHistory = history.filter(h => h.date !== editingDate);
    setHistory([...newRecords, ...filteredHistory]);
    setEditingDate(null);
    toast.success("Attendance updated successfully!");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* TODAY'S ATTENDANCE */}
      <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Today's Attendance</h2>
            <p className="text-sm text-slate-500">{new Date().toDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full whitespace-nowrap">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{presentTodayCount}</span> / {activeTeachers.length} Present
            </div>
            <Button onClick={submitAttendance} className="py-2 px-4 h-9 text-sm">
              Submit
            </Button>
          </div>
        </div>

        {/* COMPACT LIST VIEW */}
        <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          {activeTeachers.map((teacher, idx) => {
            const status = todayAttendance[teacher.id] || "ABSENT";
            return (
              <div
                key={teacher.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 transition-colors ${
                  idx !== activeTeachers.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                } ${
                  status === "PRESENT" 
                    ? "bg-emerald-50/30 dark:bg-emerald-900/10"
                    : status === "HALF_DAY"
                    ? "bg-amber-50/30 dark:bg-amber-900/10"
                    : "bg-white dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm border transition-colors ${
                    status === "PRESENT" ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                    : status === "HALF_DAY" ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
                    : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                  }`}>
                    {teacher.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold transition-colors ${
                      status === "PRESENT" ? 'text-emerald-900 dark:text-emerald-100'
                      : status === "HALF_DAY" ? 'text-amber-900 dark:text-amber-100'
                      : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {teacher.fullName}
                    </p>
                    <p className={`text-xs transition-colors ${
                      status === "PRESENT" ? 'text-emerald-600 dark:text-emerald-400'
                      : status === "HALF_DAY" ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {teacher.department} • {teacher.employeeId}
                    </p>
                  </div>
                </div>
                
                {/* 3-WAY SEGMENTED CONTROL */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1 shrink-0 self-start sm:self-auto w-full sm:w-auto">
                  <button onClick={() => updateTodayStatus(teacher.id, 'ABSENT')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${status === 'ABSENT' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600 dark:text-rose-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Absent</button>
                  <button onClick={() => updateTodayStatus(teacher.id, 'HALF_DAY')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${status === 'HALF_DAY' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Half Day</button>
                  <button onClick={() => updateTodayStatus(teacher.id, 'PRESENT')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${status === 'PRESENT' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Present</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HISTORY */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          Attendance History
        </h2>
        
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <span className="text-2xl opacity-50">📅</span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No records yet</p>
            <p className="text-xs text-slate-400 mt-1">Submit attendance to see history here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHistory).sort(([a], [b]) => b.localeCompare(a)).map(([date, records]) => {
              const presentCount = records.filter(r => r.status === "PRESENT" || r.status === "HALF_DAY").length;
              const totalCount = records.length;
              const percent = Math.round((presentCount / totalCount) * 100) || 0;
              
              return (
                <div key={date} className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 pb-1">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-white dark:ring-slate-900" />
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </h3>
                    <span className={`text-xs font-bold ${
                      percent === 100 ? 'text-emerald-500' : percent > 50 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {percent}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {presentCount} out of {totalCount} present
                    </p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEditClick(date)} type="button" className="text-[11px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => setViewDetailsDate(date)} type="button" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {records.filter(r => r.status !== "ABSENT").map((r) => {
                      const teacher = teachers.find(t => t.id === r.teacherId);
                      if (!teacher) return null;
                      return (
                        <div key={r.teacherId} title={`${teacher.fullName} (${r.status})`} className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold border ${
                          r.status === "PRESENT" 
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
                            : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30"
                        }`}>
                          {teacher.fullName.charAt(0)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      <Modal isOpen={Boolean(viewDetailsDate)} onClose={() => setViewDetailsDate(null)} title={`Attendance Details - ${viewDetailsDate ? new Date(viewDetailsDate).toDateString() : ''}`}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
          {viewDetailsDate && activeTeachers.map(teacher => {
            const record = groupedHistory[viewDetailsDate]?.find(r => r.teacherId === teacher.id);
            const status = record?.status || "ABSENT";
            
            return (
              <div key={teacher.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{teacher.fullName}</p>
                  <p className="text-xs text-slate-500">{teacher.department}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  status === "PRESENT" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : status === "HALF_DAY" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                }`}>
                  {status === "HALF_DAY" ? "HALF DAY" : status}
                </span>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={Boolean(editingDate)} onClose={() => setEditingDate(null)} title={`Edit Attendance - ${editingDate ? new Date(editingDate).toDateString() : ''}`} maxWidth="max-w-2xl">
        <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto">
          {activeTeachers.map((teacher, idx) => {
            const status = editAttendance[teacher.id] || "ABSENT";
            return (
              <div
                key={teacher.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 transition-colors ${
                  idx !== activeTeachers.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                } bg-white dark:bg-slate-900`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{teacher.fullName}</p>
                  <p className="text-xs text-slate-500">{teacher.department}</p>
                </div>
                
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1 shrink-0 self-start sm:self-auto w-full sm:w-auto">
                  <button onClick={() => updateEditStatus(teacher.id, 'ABSENT')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${status === 'ABSENT' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600 dark:text-rose-400' : 'text-slate-500 hover:text-slate-700'}`}>Absent</button>
                  <button onClick={() => updateEditStatus(teacher.id, 'HALF_DAY')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${status === 'HALF_DAY' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700'}`}>Half Day</button>
                  <button onClick={() => updateEditStatus(teacher.id, 'PRESENT')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${status === 'PRESENT' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'}`}>Present</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition" onClick={() => setEditingDate(null)}>Cancel</button>
          <Button onClick={saveEditedAttendance}>Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
}
