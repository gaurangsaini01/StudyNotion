// This will prevent authenticated users from accessing this route
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../../redux/hooks";

interface OpenRouteProps {
  children: ReactNode;
}

function OpenRoute({ children }: OpenRouteProps) {
  const { token } = useAppSelector((state) => state.auth);

  if (token === null) {
    return <>{children}</>;
  }

  return <Navigate to="/dashboard/my-profile" />;
}

export default OpenRoute;
