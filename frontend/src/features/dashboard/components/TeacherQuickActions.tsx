import { useNavigate } from "react-router-dom";
import { BookOpen, ClipboardCheck, PenSquare, MessageSquare } from "lucide-react";
import DashboardCard from "./DashboardCard";

function TeacherQuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Take Attendance",
      icon: <ClipboardCheck className="h-6 w-6" />,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      bgHover: "hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
      path: "/attendance",
    },
    {
      label: "New Assignment",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-primary",
      textColor: "text-primary",
      bgHover: "hover:bg-primary/5 dark:hover:bg-primary/10",
      path: "/assignments",
    },
    {
      label: "Exam Marks",
      icon: <PenSquare className="h-6 w-6" />,
      color: "bg-amber-500",
      textColor: "text-amber-500",
      bgHover: "hover:bg-amber-50 dark:hover:bg-amber-500/10",
      path: "/exams",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => navigate(action.path)}
          className={`group flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 ${action.bgHover}`}
        >
          <div className={`mb-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 transition-transform group-hover:scale-110 group-hover:shadow-md ${action.textColor}`}>
            {action.icon}
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default TeacherQuickActions;
