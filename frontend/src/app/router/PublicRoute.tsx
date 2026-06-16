import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";

import { ROUTE_PATHS } from "./routePaths";

type PublicRouteProps = PropsWithChildren & {
  isAuthenticated: boolean;
};

function PublicRoute({
  children,
  isAuthenticated,
}: PublicRouteProps) {
  if (isAuthenticated) {
    return <Navigate replace to={ROUTE_PATHS.DASHBOARD} />;
  }

  return children;
}

export default PublicRoute;