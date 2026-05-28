import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Calendar as CalendarIcon, BookOpen, Clock, GripVertical, CheckCircle2, ArrowRight, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { createExam } from "../services/exam.service";
import { ExamSubject } from "../types/exam.types";
import { getClasses, getClassSubjects } from "../../student/services/class-subjects.service";
import { getTeachers } from "../../teacher/services/teacher.service";
import { Teacher } from "../../teacher/types/teacher.types";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function ScheduleExamPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [title, setTitle] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");

  // Dynamic Data
  const [allClasses, setAllClasses] = useState<string[]>([]);
  const [classSubjectMapping, setClassSubjectMapping] = useState<Record<string, string[]>>({});
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const loadClasses = async () => {
      const classes = await getClasses(user?.schoolId);
      setAllClasses(classes);
      setClassSubjectMapping(getClassSubjects(user?.schoolId));
    };
    loadClasses();
  }, [user]);

  // Step 2 State
  const [scheduledDates, setScheduledDates] = useState<Record<string, Record<string, string>>>({});
  const [selectedSubjectForMobile, setSelectedSubjectForMobile] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute available subjects for Step 2 based on selected classes
  const getAvailableSubjects = () => {
    const subjectSet = new Set<string>();
    selectedClasses.forEach(cls => {
      const subjectsForClass = classSubjectMapping[cls] || [];
      subjectsForClass.forEach(sub => subjectSet.add(sub));
    });
    
    if (subjectSet.size === 0) {
      // Fallback if no subjects mapped
      return ["English", "Hindi", "Mathematics", "Science"];
    }
    return Array.from(subjectSet);
  };

  const availableSubjects = getAvailableSubjects();

  // Generate date range
  const getDateRange = () => {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) return [];
    
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      if (current.getDay() !== 0) { // Skip Sundays
        dates.push(current.toISOString().split('T')[0]);
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dates = getDateRange();

  useEffect(() => {
    setScheduledDates({});
  }, [startDate, endDate]);

  const handleToggleClass = (className: string) => {
    setSelectedClasses(prev => 
      prev.includes(className) 
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === allClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses([...allClasses]);
    }
  };

  const goToNextStep = () => {
    if (!title || selectedClasses.length === 0) {
      toast.error("Please enter an Exam Title and select at least one class.");
      return;
    }
    if (!startDate || !endDate || dates.length === 0) {
      toast.error("Please select a valid date range.");
      return;
    }

    if (Object.keys(scheduledDates).length === 0) {
      const initialSchedule: Record<string, Record<string, string>> = {};
      
      selectedClasses.forEach(cls => {
        const subjects = classSubjectMapping[cls] || [];
        subjects.forEach((sub, idx) => {
          if (idx < dates.length) {
            const d = dates[idx];
            if (!initialSchedule[d]) initialSchedule[d] = {};
            initialSchedule[d][cls] = sub;
          }
        });
      });
      
      setScheduledDates(initialSchedule);
      if (Object.keys(initialSchedule).length > 0) {
        toast.success("Schedule auto-populated with class subjects!");
      }
    }
    
    setStep(2);
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, subject: string, sourceDate?: string, sourceClass?: string) => {
    e.dataTransfer.setData("subject", subject);
    if (sourceDate) e.dataTransfer.setData("sourceDate", sourceDate);
    if (sourceClass) e.dataTransfer.setData("sourceClass", sourceClass);
  };

  const handleDragOver = (e: React.DragEvent, targetDate: string, targetClass: string) => {
    e.preventDefault();
    if (dragOverDate !== `${targetDate}-${targetClass}`) setDragOverDate(`${targetDate}-${targetClass}`);
  };

  const handleDragLeave = (e: React.DragEvent, targetDate: string, targetClass: string) => {
    if (dragOverDate === `${targetDate}-${targetClass}`) setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, targetDate: string, targetClass: string) => {
    e.preventDefault();
    setDragOverDate(null);
    const subject = e.dataTransfer.getData("subject");
    const sourceDate = e.dataTransfer.getData("sourceDate");
    const sourceClass = e.dataTransfer.getData("sourceClass");
    if (!subject) return;

    if (sourceClass && sourceClass !== targetClass) {
      toast.error(`Cannot swap subjects between Class ${sourceClass} and Class ${targetClass}!`);
      return;
    }

    const isDuplicate = dates.some(d => d !== targetDate && scheduledDates[d]?.[targetClass] === subject);
    if (isDuplicate && (!sourceDate || sourceDate !== targetDate)) {
      toast.warning(`${subject} is already scheduled for Class ${targetClass} on another date!`);
      return;
    }

    const existingTargetSubject = scheduledDates[targetDate]?.[targetClass];

    setScheduledDates(prev => {
      const next = { ...prev };
      
      if (sourceDate && sourceClass && (sourceDate !== targetDate)) {
        if (next[sourceDate]) {
          next[sourceDate] = { ...next[sourceDate] };
          if (existingTargetSubject) {
            next[sourceDate][sourceClass] = existingTargetSubject;
          } else {
            delete next[sourceDate][sourceClass];
          }
        }
      }
      
      if (!next[targetDate]) next[targetDate] = {};
      next[targetDate] = { ...next[targetDate], [targetClass]: subject };
      
      return next;
    });
  };

  const handleMobileDrop = (targetDate: string, targetClass: string) => {
    if (!selectedSubjectForMobile) return;
    
    const isDuplicate = dates.some(d => d !== targetDate && scheduledDates[d]?.[targetClass] === selectedSubjectForMobile);
    if (isDuplicate) {
      toast.warning(`${selectedSubjectForMobile} is already scheduled for Class ${targetClass}!`);
      return;
    }

    setScheduledDates(prev => {
      const next = { ...prev };
      if (!next[targetDate]) next[targetDate] = {};
      next[targetDate] = { ...next[targetDate], [targetClass]: selectedSubjectForMobile };
      return next;
    });
    setSelectedSubjectForMobile(null);
    toast.success(`${selectedSubjectForMobile} assigned to Class ${targetClass}.`);
  };

  const handleRemoveScheduled = (date: string, className: string) => {
    setScheduledDates(prev => {
      const next = { ...prev };
      if (next[date]) {
        next[date] = { ...next[date] };
        delete next[date][className];
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    const hasAnySchedule = dates.some(d => Object.keys(scheduledDates[d] || {}).length > 0);
    if (!hasAnySchedule) {
      toast.error("Please schedule at least one subject.");
      return;
    }
    setIsSubmitting(true);
    try {
      const classes = await getClasses(user?.schoolId);
      setAllClasses(classes);
      
      const t = await getTeachers(user?.schoolId);
      setTeachers(t);

      const mapping: Record<string, string[]> = {};
      for (const cls of selectedClasses) {
        const finalSubjects: ExamSubject[] = [];
        
        dates.forEach(date => {
          const subjectName = scheduledDates[date]?.[cls];
          if (subjectName) {
            const matchingTeacher = t.find(teacher => {
              const tSubs = Array.isArray(teacher.subject) ? teacher.subject : 
                            (typeof teacher.subject === 'string' ? teacher.subject.split(',').map(s=>s.trim()) : []);
              return tSubs.some(s => s.toLowerCase() === subjectName.toLowerCase());
            });

            finalSubjects.push({
              id: `subj_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,
              subjectName,
              date,
              startTime,
              endTime,
              teacherId: matchingTeacher ? matchingTeacher.id : null,
              teacherName: matchingTeacher ? matchingTeacher.fullName : undefined,
              paperStatus: "PENDING",
              paperPdfUrl: null,
            });
          }
        });

        if (finalSubjects.length > 0) {
          await createExam({
            schoolId: user?.schoolId,
            title,
            className: cls,
            startDate,
            endDate,
            status: "UPCOMING",
            subjects: finalSubjects
          });
        }
      }
      
      toast.success(`Exam schedules created successfully!`);
      navigate("/exams");
    } catch (error) {
      toast.error("Failed to schedule exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <PageHeader
        title="Schedule New Exam"
        subtitle="Create an exam schedule across multiple classes with our advanced builder."
        actions={
          <button 
            onClick={() => navigate("/exams")}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        }
      />

      {/* Stepper Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className={`flex items-center gap-3 ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step === 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>1</div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Basic Information</h3>
            <p className="text-xs text-slate-500">Title, Classes & Dates</p>
          </div>
        </div>
        
        <div className="hidden md:block flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
        
        <div className={`flex items-center gap-3 ${step === 2 ? 'opacity-100' : 'opacity-50'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step === 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>2</div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Schedule Builder</h3>
            <p className="text-xs text-slate-500">Drag & Drop Subjects</p>
          </div>
        </div>
      </div>

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-6 md:p-8 space-y-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Exam Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Half Yearly Examinations 2026-27"
                className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white text-lg"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Select Classes <span className="text-red-500">*</span></label>
                <button onClick={handleSelectAll} className="text-sm text-primary font-bold hover:underline">
                  {selectedClasses.length === allClasses.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-2.5">
                  {allClasses.map(cls => {
                    const isSelected = selectedClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleToggleClass(cls)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                          isSelected 
                            ? "bg-primary text-white border-primary shadow-md" 
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary/50"
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {selectedClasses.length} classes selected
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-slate-400" /> Exam Date Range <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                  <span className="text-slate-400 font-medium">to</span>
                  <input
                    type="date"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Global Timings <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                  <span className="text-slate-400 font-medium">to</span>
                  <input
                    type="time"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={goToNextStep}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              Continue to Schedule Builder <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Drag & Drop Schedule Builder */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300 flex flex-col min-h-[600px]">
          
          {/* Subjects Bank Sticky Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 sticky top-0 z-20 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-primary" /> 
                <span className="hidden md:inline">Drag Subjects to Assign</span>
                <span className="md:hidden">Tap Subject, then Tap Date</span>
              </h3>
              <p className="text-sm font-medium text-slate-500">
                {dates.length} Days Schedule
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {availableSubjects.map(subject => {
                const isSelectedMobile = selectedSubjectForMobile === subject;
                return (
                  <div
                    key={subject}
                    draggable
                    onClick={() => setSelectedSubjectForMobile(isSelectedMobile ? null : subject)}
                    onDragStart={(e) => handleDragStart(e, subject)}
                    className={`px-4 py-2 border rounded-xl text-sm font-bold shadow-sm cursor-grab hover:border-primary hover:text-primary transition-colors flex items-center gap-2 active:cursor-grabbing ${
                      isSelectedMobile
                        ? "bg-primary text-white border-primary transform scale-105"
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:shadow-md"
                    }`}
                  >
                    <GripVertical className={`w-4 h-4 ${isSelectedMobile ? "text-white/80" : "text-slate-400"}`} /> {subject}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="flex-1 p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto">
            <table className="w-full min-w-max border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-slate-200 dark:border-slate-700 text-left font-bold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                    Date
                  </th>
                  {selectedClasses.map(cls => (
                    <th key={cls} className="p-4 border-b-2 border-slate-200 dark:border-slate-700 text-center font-bold text-slate-700 dark:text-slate-300 min-w-[160px]">
                      Class {cls}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dates.map(date => {
                  const dateObj = new Date(date);
                  const isToday = date === new Date().toISOString().split('T')[0];
                  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                  return (
                    <tr key={date} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className={`p-4 border-b border-slate-200 dark:border-slate-700 sticky left-0 z-10 ${isToday ? 'bg-primary/5' : 'bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm'}`}>
                        <span className={`font-bold ${isToday ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>
                          {formattedDate}
                        </span>
                      </td>
                      
                      {selectedClasses.map(cls => {
                        const subject = scheduledDates[date]?.[cls];
                        return (
                          <td 
                            key={`${date}-${cls}`}
                            className={`p-2 border-b border-slate-200 dark:border-slate-700 transition-colors relative ${
                              selectedSubjectForMobile ? "cursor-pointer hover:bg-primary/5 active:bg-primary/10" : ""
                            } ${dragOverDate === `${date}-${cls}` ? "bg-primary/10" : ""}`}
                            onDragOver={(e) => handleDragOver(e, date, cls)}
                            onDragLeave={(e) => handleDragLeave(e, date, cls)}
                            onDrop={(e) => handleDrop(e, date, cls)}
                            onClick={() => {
                              if (selectedSubjectForMobile) handleMobileDrop(date, cls);
                            }}
                          >
                            <div className={`min-h-[60px] h-full w-full rounded-xl flex items-center justify-center p-2 ${!subject && selectedSubjectForMobile ? "border-2 border-dashed border-primary/40" : "border-2 border-transparent"}`}>
                              {subject ? (
                                <div 
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, subject, date, cls)}
                                  className="group w-full px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-sm font-bold text-primary flex items-center justify-between cursor-grab active:cursor-grabbing shadow-sm"
                                >
                                  <span className="truncate mr-2">{subject}</span>
                                  <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleRemoveScheduled(date, cls); }}
                                    className="text-primary/60 hover:text-red-500 hover:bg-red-50 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium italic opacity-50 flex flex-col items-center gap-1 pointer-events-none">
                                  <BookOpen className="w-4 h-4" />
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center mt-auto">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition flex items-center gap-2 font-bold"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Setup
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(scheduledDates).length === 0}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              {isSubmitting ? "Publishing..." : "Publish Final Schedule"} <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
