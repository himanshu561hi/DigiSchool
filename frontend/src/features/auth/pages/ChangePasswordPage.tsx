import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ROUTE_PATHS } from "@/app/router/routePaths";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "sonner";
import { Lock } from "lucide-react";

function ChangePasswordPage() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Safety redirect if accessed when not needed
  if (!user || !user.mustChangePassword) {
    navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would call an API here.
      // For the mock, we simulate network delay and then update the store.
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // We only need to tell the frontend auth store that the flag is clear.
      updateUser({ mustChangePassword: false });
      
      // Update local storage so the mock persists the new password
      if (user?.role === "TEACHER") {
        const localTeachers = JSON.parse(localStorage.getItem("mock_teachers") || "[]");
        const tIndex = localTeachers.findIndex((t: any) => t.id === user.id);
        if (tIndex >= 0) {
          localTeachers[tIndex].password = password;
          localTeachers[tIndex].firstLogin = false;
          localStorage.setItem("mock_teachers", JSON.stringify(localTeachers));
        } else {
          // If they aren't in local storage, add them so it overrides the JSON file mock
          localTeachers.push({
            id: user.id,
            email: user.email,
            password: password,
            firstLogin: false,
            fullName: `${user.firstName} ${user.lastName}`,
            status: "ACTIVE"
          });
          localStorage.setItem("mock_teachers", JSON.stringify(localTeachers));
        }
      } else if (user?.role === "STUDENT") {
        const localStudents = JSON.parse(localStorage.getItem("mock_students") || "[]");
        const sIndex = localStudents.findIndex((s: any) => s.id === user.id);
        if (sIndex >= 0) {
          localStudents[sIndex].password = password;
          localStudents[sIndex].firstLogin = false;
          localStorage.setItem("mock_students", JSON.stringify(localStudents));
        } else {
          localStudents.push({
            id: user.id,
            email: user.email,
            password: password,
            firstLogin: false,
            firstName: user.firstName,
            lastName: user.lastName,
            status: "ACTIVE",
            schoolId: user.schoolId,
          });
          localStorage.setItem("mock_students", JSON.stringify(localStudents));
        }
      } else {
        // Manager or Admin
        const localUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
        const uIndex = localUsers.findIndex((u: any) => u.id === user.id);
        if (uIndex >= 0) {
          localUsers[uIndex].password = password;
          localUsers[uIndex].mustChangePassword = false;
          localStorage.setItem("mock_users", JSON.stringify(localUsers));
        } else {
          localUsers.push({
            id: user.id,
            email: user.email,
            password: password,
            mustChangePassword: false,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          });
          localStorage.setItem("mock_users", JSON.stringify(localUsers));
        }
      }

      toast.success("Password changed successfully! Welcome to the dashboard.");
      navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
    } catch (err) {
      setError("Failed to change password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        
        {user?.role === "TEACHER" ? (
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 text-4xl animate-bounce">🎉</div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              Congratulations, {user.firstName}!
            </h1>
            <p className="mt-1 text-sm font-bold text-primary">
              Welcome to our School Family!
            </p>
            <div className="mt-4 text-xs text-slate-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4 font-medium leading-relaxed">
              We are incredibly thrilled to have you join us as a respected <strong>Teacher</strong> at our school. To secure your account and access your classroom dashboard, please set up a new password below.
            </div>
          </div>
        ) : (
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Change Password Required</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              For security reasons, you must change your default password before accessing your dashboard.
            </p>
          </div>
        )}

        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          
          <Input
            id="password"
            type="password"
            label="New Password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm New Password"
            placeholder="Type it again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm font-medium text-rose-500 text-center">{error}</p>
          )}

          <div className="pt-2 flex flex-col gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              Update Password & Continue
            </Button>
            
            <button 
              type="button" 
              onClick={logout}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
            >
              Cancel and Logout
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}

export default ChangePasswordPage;
