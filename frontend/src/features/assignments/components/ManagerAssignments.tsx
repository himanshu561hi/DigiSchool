import { useState, useEffect } from "react";
import { getAssignments, getSubmissions } from "../../assignments/services/assignment.service";
import type { Assignment, AssignmentSubmission } from "../../assignments/types/assignment.types";
import { getTeachers } from "../../teacher/services/teacher.service";
import type { Teacher } from "../../teacher/types/teacher.types";
import { useAuthStore } from "@/features/auth/store/authStore";
import { BookOpen, CheckCircle, Clock, ChevronDown, ChevronUp, Users, History } from "lucide-react";

const isOverdue = (d: string) => new Date(d) < new Date();
const isExpired = (d: string) => (new Date().getTime() - new Date(d).getTime()) / (1000*60*60*24) > 5;

export default function ManagerAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [teachers, setTeachers] = useState<Record<string, Teacher>>({});
  const { user } = useAuthStore();
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "PREVIOUS">("ACTIVE");

  useEffect(() => {
    // Load data asynchronously to prevent synchronous setState in effect
    setTimeout(() => {
      const allAssignments = getAssignments(user?.schoolId);
      const allSubmissions = getSubmissions();
      setAssignments(allAssignments);
      setSubmissions(allSubmissions);
    }, 0);
    
    getTeachers(user?.schoolId).then(data => {
      const map: Record<string, Teacher> = {};
      data.forEach(t => map[t.id] = t);
      setTeachers(map);
    });
  }, [user?.schoolId]);

  // Split by expired
  const activeAssignments = assignments.filter(a => !isExpired(a.dueDate));
  const previousAssignments = assignments.filter(a => isExpired(a.dueDate));

  // Group the relevant list by class
  const sourceList = activeTab === "ACTIVE" ? activeAssignments : previousAssignments;
  const classMap = sourceList.reduce((acc, assignment) => {
    if (!acc[assignment.className]) acc[assignment.className] = [];
    acc[assignment.className].push(assignment);
    return acc;
  }, {} as Record<string, Assignment[]>);

  const classes = Object.keys(classMap).sort();

  const toggleClass = (c: string) => {
    setExpandedClasses(prev => ({ ...prev, [c]: !prev[c] }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Assignment Overview
        </h2>
        <p className="text-sm text-slate-500 mt-1">Monitor all assignments given by teachers across all classes.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {(["ACTIVE", "PREVIOUS"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab === "ACTIVE" ? `Active (${activeAssignments.length})` : <span className="flex items-center gap-1.5"><History className="h-3.5 w-3.5" />Previous ({previousAssignments.length})</span>}
          </button>
        ))}
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-medium">No assignments have been created yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map(c => {
            const classAssignments = classMap[c];
            const isExpanded = expandedClasses[c];
            
            return (
              <div key={c} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <button 
                  onClick={() => toggleClass(c)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {c}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Class {c}</h3>
                      <p className="text-sm text-slate-500">{classAssignments.length} Assignments</p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                    {classAssignments.map(assignment => {
                      const teacher = teachers[assignment.teacherId];
                      const assignmentSubs = submissions.filter(s => s.assignmentId === assignment.id);
                      const submittedCount = assignmentSubs.filter(s => s.status === "SUBMITTED").length;
                      
                      return (
                        <div key={assignment.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{assignment.subject}</span>
                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Users className="h-3 w-3" />By: {teacher?.fullName || 'Unknown'}</span>
                              </div>
                              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">{assignment.title}</h4>
                              <div className="flex flex-wrap gap-3 mt-1">
                                <span className="text-xs text-slate-500">📅 Uploaded: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                                <span className={`text-xs font-semibold ${isOverdue(assignment.dueDate) ? 'text-rose-500' : 'text-slate-500'}`}>⏰ Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0">
                              <div className="text-xs font-semibold text-slate-500 mb-1 text-right">Completion</div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500 rounded-full" 
                                    style={{ width: `${assignmentSubs.length === 0 ? 0 : (submittedCount / assignmentSubs.length) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                  {submittedCount}/{assignmentSubs.length}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Submissions List */}
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <h5 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Student Status</h5>
                            {assignmentSubs.length === 0 ? (
                              <p className="text-xs text-slate-500">No students found.</p>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {assignmentSubs.map(sub => (
                                  <div key={sub.id} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate pr-2">{sub.studentName}</span>
                                    {sub.status === "SUBMITTED" ? (
                                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    ) : (
                                      <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
