import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../../redux/hooks";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { token } = useAppSelector((state) => state.auth);

  if (token !== null) {
    return <>{children}</>;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
