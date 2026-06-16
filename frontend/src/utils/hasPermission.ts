import {
  ROLE_PERMISSIONS,
} from "@/config/permissions";

import type {
  UserRole,
} from "@/constants/roles";

export function hasPermission(
  role: UserRole,
  permission: string,
) {
  if (!role) {
    return false;
  }

  const normalizedRole = role.trim().toUpperCase() as UserRole;
  const permissions = ROLE_PERMISSIONS[normalizedRole];

  if (!Array.isArray(permissions)) {
    return false;
  }

  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(
    permission,
  );
}