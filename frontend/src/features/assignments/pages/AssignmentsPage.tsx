import { useAuthStore } from "@/features/auth/store/authStore";
import TeacherAssignmentsPage from "./TeacherAssignmentsPage";
import StudentAssignmentsPage from "./StudentAssignmentsPage";

export default function AssignmentsPage() {
  const { user } = useAuthStore();
  
  if (user?.role === "TEACHER") return <TeacherAssignmentsPage />;
  if (user?.role === "STUDENT") return <StudentAssignmentsPage />;
  
  return (
    <div className="p-8 text-center text-slate-500 font-medium">
      Assignments feature is only available for teachers and students.
    </div>
  );
}
