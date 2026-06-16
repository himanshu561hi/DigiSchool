import type {
  AuthResponse,
  LoginPayload,
} from "../types/auth.types";
import type { Teacher } from "../../teacher/types/teacher.types";
import type { Student } from "../../student/types/student.types";

type MockUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: "SUPER_ADMIN" | "MANAGER" | "TEACHER" | "STUDENT";
  mustChangePassword: boolean;
  status?: string;
  schoolId?: string;
  schoolName?: string;
};


export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  /*
   =========================
   FETCH ALL USERS
   =========================
  */

  const usersRes = await fetch("/mock/users.json").then((r) => r.json());

  const localTeachers: Teacher[] = JSON.parse(
    localStorage.getItem("mock_teachers") || "[]",
  );
  const localStudents: Student[] = JSON.parse(
    localStorage.getItem("mock_students") || "[]",
  );
  const localUsers: MockUser[] = JSON.parse(
    localStorage.getItem("mock_users") || "[]",
  );

  const allTeachers: Teacher[] = [...localTeachers];
  const allStudents: Student[] = [...localStudents];
  
  // Merge usersRes.users with localUsers (localUsers override based on ID)
  const baseUsers = usersRes.users as MockUser[];
  const mergedUsers = [...baseUsers];
  localUsers.forEach(lu => {
    const idx = mergedUsers.findIndex(u => u.id === lu.id);
    if (idx >= 0) mergedUsers[idx] = { ...mergedUsers[idx], ...lu };
    else mergedUsers.push(lu);
  });

  const allUsers: MockUser[] = [
    ...mergedUsers,
    ...allTeachers.map((t) => ({
      id: t.id,
      email: t.email,
      password: t.password || "123456", // Default fallback if not set
      role: "TEACHER" as const,
      status: t.status,
      firstName: t.fullName.split(" ")[0] || "Unknown",
      lastName: t.fullName.split(" ").slice(1).join(" ") || "",
      mustChangePassword: t.firstLogin ?? true,
      schoolId: t.schoolId,
    })),
    ...allStudents.map((s) => ({
      id: s.id,
      email: s.email,
      password: s.password || "123456", // Default fallback if not set
      role: "STUDENT" as const,
      status: "ACTIVE",
      firstName: s.firstName,
      lastName: s.lastName,
      mustChangePassword: s.firstLogin ?? true,
      schoolId: s.schoolId,
    })),
  ];

  /*
   =========================
   FIND USER
   =========================
  */

  const user = allUsers.find(
    (u) =>
      u.email.toLowerCase() === payload.email.toLowerCase() &&
      (u.password === payload.password || !u.password),
  );

  /*
   =========================
   INVALID LOGIN
   =========================
  */
  if (!user) {
    throw new Error("Invalid email or password");
  }

  /*
   =========================
   CHECK STATUS
   =========================
  */

  if (user.status === "INACTIVE") {
    throw new Error(
      "Your account has been deactivated. Please contact the administrator.",
    );
  }

  /*
   =========================
   SUCCESS
   =========================
  */

  const localSchools = JSON.parse(localStorage.getItem("mock_schools") || "[]");
  let schoolStatus: "ACTIVE" | "INACTIVE" = "ACTIVE"; // Default
  
  if (user.schoolId) {
    const school = localSchools.find((s: any) => s.id === user.schoolId);
    if (school && school.status) {
      schoolStatus = school.status;
    }
  }

  return {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      createdAt: new Date().toISOString(),
      schoolId: user.schoolId,
      schoolName: user.schoolName,
      schoolStatus,
    },
  };
};