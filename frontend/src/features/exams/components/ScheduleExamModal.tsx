import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, BookOpen, Clock, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { createExamForClasses } from "../services/exam.service";
import { ExamSubject } from "../types/exam.types";
import { getTeachers } from "../../teacher/services/teacher.service";

import { useAuthStore } from "@/features/auth/store/authStore";

type ScheduleExamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const ALL_CLASSES = [
  "Nursery", "LKG", "UKG", 
  "1", "2", "3", "4", "5", 
  "6", "7", "8", "9", "10", 
  "11-Science", "11-Commerce", "11-Arts",
  "12-Science", "12-Commerce", "12-Arts"
];

const STANDARD_SUBJECTS = [
  "English", "Hindi", "Mathematics", "Science", "Social Science",
  "Physics", "Chemistry", "Biology", "Computer Science",
  "Accountancy", "Business Studies", "Economics", "History", "Geography",
  "Physical Education", "Art & Craft"
];

export default function ScheduleExamModal({ isOpen, onClose, onSuccess }: ScheduleExamModalProps) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Settings
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");

  // Drag and drop state
  // Map of Date -> array of Subject Names
  const [scheduledDates, setScheduledDates] = useState<Record<string, string[]>>({});
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([...STANDARD_SUBJECTS]);
  
  // Mobile fallback for drag-and-drop
  const [selectedSubjectForMobile, setSelectedSubjectForMobile] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate date range
  const getDateRange = () => {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) return [];
    
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      // Skip Sundays (0)
      if (current.getDay() !== 0) {
        dates.push(current.toISOString().split('T')[0]);
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dates = getDateRange();

  // Reset schedule when dates change
  useEffect(() => {
    setScheduledDates({});
  }, [startDate, endDate]);

  if (!isOpen) return null;

  const handleToggleClass = (className: string) => {
    setSelectedClasses(prev => 
      prev.includes(className) 
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === ALL_CLASSES.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses([...ALL_CLASSES]);
    }
  };

  // --- DRAG AND DROP HANDLERS ---

  const handleDragStart = (e: React.DragEvent, subject: string, sourceDate?: string) => {
    e.dataTransfer.setData("subject", subject);
    if (sourceDate) {
      e.dataTransfer.setData("sourceDate", sourceDate);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.currentTarget.classList.add("bg-primary/5", "border-primary/50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-primary/5", "border-primary/50");
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-primary/5", "border-primary/50");
    
    const subject = e.dataTransfer.getData("subject");
    const sourceDate = e.dataTransfer.getData("sourceDate");

    if (!subject) return;

    setScheduledDates(prev => {
      const next = { ...prev };
      
      // Remove from source if it came from another date
      if (sourceDate && sourceDate !== targetDate) {
        if (next[sourceDate]) {
          next[sourceDate] = next[sourceDate].filter(s => s !== subject);
        }
      }

      // Add to target
      if (!next[targetDate]) {
        next[targetDate] = [];
      }
      if (!next[targetDate].includes(subject)) {
        next[targetDate].push(subject);
      }
      
      return next;
    });
  };

  const handleMobileDrop = (targetDate: string) => {
    if (!selectedSubjectForMobile) return;
    
    setScheduledDates(prev => {
      const next = { ...prev };
      if (!next[targetDate]) {
        next[targetDate] = [];
      }
      if (!next[targetDate].includes(selectedSubjectForMobile)) {
        next[targetDate].push(selectedSubjectForMobile);
      }
      return next;
    });
    
    setSelectedSubjectForMobile(null);
    toast.success(`${selectedSubjectForMobile} assigned to date.`);
  };

  const handleRemoveScheduled = (date: string, subject: string) => {
    setScheduledDates(prev => {
      const next = { ...prev };
      if (next[date]) {
        next[date] = next[date].filter(s => s !== subject);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || selectedClasses.length === 0) {
      toast.error("Please enter a title and select at least one class.");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select a date range.");
      return;
    }

    const scheduledCount = Object.values(scheduledDates).flat().length;
    if (scheduledCount === 0) {
      toast.error("Please drag and drop at least one subject to schedule it.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Fetch all teachers for this school to auto-assign
      const allTeachers = await getTeachers(user?.schoolId);
      
      // Calculate due date (5 days before exam start date)
      const startDateObj = new Date(startDate);
      startDateObj.setDate(startDateObj.getDate() - 5);
      const dueDateStr = startDateObj.toISOString().split("T")[0];

      // Build subjects array
      const finalSubjects: ExamSubject[] = [];
      Object.entries(scheduledDates).forEach(([date, subs]) => {
        subs.forEach(subjectName => {
          // Find a teacher who teaches this subject
          const matchedTeacher = allTeachers.find(t => {
            const tSubs = Array.isArray(t.subject) ? t.subject : 
                          (typeof t.subject === 'string' ? t.subject.split(',').map(s=>s.trim()) : []);
            return tSubs.some(s => s.toLowerCase() === subjectName.toLowerCase());
          });
          
          finalSubjects.push({
            id: `subj_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,
            subjectName,
            date,
            startTime,
            endTime,
            teacherId: matchedTeacher ? matchedTeacher.id : null,
            teacherName: matchedTeacher ? matchedTeacher.fullName : undefined,
            paperStatus: "PENDING",
            paperPdfUrl: null,
            dueDate: dueDateStr
          });
        });
      });

      await createExamForClasses({
        schoolId: user?.schoolId,
        title,
        startDate,
        endDate,
        status: "UPCOMING",
        subjects: finalSubjects
      }, selectedClasses);
      
      toast.success(`Exam scheduled successfully for ${selectedClasses.length} classes!`);
      setTitle("");
      setStartDate("");
      setEndDate("");
      setSelectedClasses([]);
      setScheduledDates({});
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to schedule exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we have the basics to show the scheduler
  const showScheduler = selectedClasses.length > 0 && dates.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col h-[95vh] md:h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" /> Schedule Exams
            </h2>
            <p className="text-sm text-slate-500 mt-1">Select classes, set dates, and drag-and-drop subjects to build the schedule.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT PANEL: Setup */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 md:overflow-y-auto custom-scrollbar p-5 md:p-6 bg-white dark:bg-slate-900 shrink-0 md:shrink">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">1. Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. Half Yearly Exams"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white shadow-sm"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">2. Select Classes</label>
                  <button onClick={handleSelectAll} className="text-xs text-primary font-medium hover:underline">
                    {selectedClasses.length === ALL_CLASSES.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-wrap gap-2">
                    {ALL_CLASSES.map(cls => {
                      const isSelected = selectedClasses.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => handleToggleClass(cls)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            isSelected 
                              ? "bg-primary text-white border-primary shadow-md transform scale-105" 
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary/50"
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">3. Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white shadow-sm"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white shadow-sm"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Global Timings
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white shadow-sm"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                  <input
                    type="time"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-800 dark:text-white shadow-sm"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL: Drag & Drop Scheduler */}
          <div className="w-full md:w-2/3 flex flex-col bg-slate-50/50 dark:bg-slate-900 md:overflow-hidden">
            {!showScheduler ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Schedule Builder</h3>
                <p className="text-slate-500 max-w-sm">
                  Please select at least one class and a valid date range on the left to unlock the drag-and-drop schedule builder.
                </p>
              </div>
            ) : (
              <>
                {/* Subjects Bank */}
                <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-white/95 backdrop-blur-sm dark:bg-slate-800/95 shrink-0 sticky top-0 z-10 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <GripVertical className="w-4 h-4" /> 
                    <span className="hidden md:inline">Drag Subjects from here:</span>
                    <span className="md:hidden">Tap Subject, then tap Date to assign:</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSubjects.map(subject => {
                      const isSelectedMobile = selectedSubjectForMobile === subject;
                      return (
                        <div
                          key={subject}
                          draggable
                          onClick={() => setSelectedSubjectForMobile(isSelectedMobile ? null : subject)}
                          onDragStart={(e) => handleDragStart(e, subject)}
                          className={`px-3 py-1.5 border rounded-lg text-sm font-medium shadow-sm cursor-grab hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5 active:cursor-grabbing ${
                            isSelectedMobile
                              ? "bg-primary text-white border-primary"
                              : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <GripVertical className={`w-3.5 h-3.5 ${isSelectedMobile ? "text-white/80" : "text-slate-400"}`} /> {subject}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4">
                  {dates.map(date => {
                    const dateObj = new Date(date);
                    const isToday = date === new Date().toISOString().split('T')[0];
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    const daySubjects = scheduledDates[date] || [];

                    return (
                      <div 
                        key={date}
                        className="flex flex-col sm:flex-row bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all"
                      >
                        {/* Date Header */}
                        <div className={`sm:w-40 p-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 flex flex-col justify-center ${isToday ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-slate-50 dark:bg-slate-800/80'}`}>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{dayName}</span>
                          <span className={`text-xl font-black ${isToday ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>
                            {formattedDate}
                          </span>
                        </div>

                        {/* Drop Zone */}
                        <div 
                          className={`flex-1 p-4 min-h-[80px] transition-colors flex flex-wrap gap-2 items-center ${
                            selectedSubjectForMobile ? "cursor-pointer hover:bg-primary/5 active:bg-primary/10 border-2 border-dashed border-primary/30 m-2 rounded-xl" : ""
                          }`}
                          onClick={() => {
                            if (selectedSubjectForMobile) handleMobileDrop(date);
                          }}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, date)}
                        >
                          {daySubjects.length === 0 ? (
                            <span className="text-sm text-slate-400 italic pointer-events-none">
                              {selectedSubjectForMobile ? "Tap to drop here..." : "Drop subjects here..."}
                            </span>
                          ) : (
                            daySubjects.map((subject, idx) => (
                              <div 
                                key={`${subject}-${idx}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, subject, date)}
                                className="group px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg text-sm font-bold text-primary flex items-center gap-2 cursor-grab active:cursor-grabbing"
                              >
                                {subject}
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveScheduled(date, subject)}
                                  className="text-primary/60 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-b-2xl">
          <div className="text-sm text-slate-500">
            {showScheduler ? (
              <span>Scheduling for <strong>{selectedClasses.length}</strong> classes over <strong>{dates.length}</strong> days</span>
            ) : null}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !showScheduler || Object.keys(scheduledDates).length === 0}
              className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/30 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              {isSubmitting ? "Processing..." : "Publish Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
