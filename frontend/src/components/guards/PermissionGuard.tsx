import type { PropsWithChildren } from "react";

import { useAuth } from "@/context/AuthContext";

import { hasPermission } from "@/utils/hasPermission";

type PermissionGuardProps = PropsWithChildren<{
  permission: string;
}>;

function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const { role } = useAuth();

  if (!role) {
    return null;
  }

  const allowed = hasPermission(role, permission);

  if (!allowed) {
    return null;
  }

  return children;
}

export default PermissionGuard;
