import type { PropsWithChildren } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import type { UserRole } from "@/constants/roles";

import { ROUTE_PATHS } from "./routePaths";

type RoleGuardProps = PropsWithChildren<{
  allowedRoles: UserRole[];
}>;

function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, role, isAuthenticated } = useAuth();

  /* ========================= */
  /* NOT LOGGED IN */
  /* ========================= */

  if (!isAuthenticated || !user) {
    return <Navigate replace to={ROUTE_PATHS.LOGIN} />;
  }

  /* ========================= */
  /* ROLE BLOCKED */
  /* ========================= */

  const normalizedRole = role?.trim().toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.trim().toUpperCase());
  const isAuthorized = normalizedRole ? normalizedAllowedRoles.includes(normalizedRole) : false;

  if (!isAuthorized) {
    return <Navigate replace to={ROUTE_PATHS.UNAUTHORIZED} />;
  }

  return children;
}

export default RoleGuard;
