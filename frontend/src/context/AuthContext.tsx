import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";

import { useAuthStore } from "@/features/auth/store/authStore";
import type { User } from "@/features/auth/types/auth.types";

type AuthContextType = {
  user: User | null;

  role: User["role"] | null;

  isAuthenticated: boolean;

  isAuthLoading: boolean;

  login: (userData: User) => void;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore();

  const value = useMemo(
    () => ({
      user,

      role: user?.role ? (user.role.trim().toUpperCase() as User["role"]) : null,

      isAuthenticated,

      isAuthLoading: false,

      login: (userData: User) => storeLogin(userData, "mock-access-token"),

      logout: storeLogout,
    }),
    [user, isAuthenticated, storeLogin, storeLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
