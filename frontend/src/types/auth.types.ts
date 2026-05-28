import type { UserRole } from "@/constants/roles";

export type AuthUser = {
  id: string;

  schoolId: string;

  firstName: string;

  lastName: string;

  email: string;

  role: UserRole;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
};

export type LoginPayload = {
  token: string;

  user: AuthUser;
};