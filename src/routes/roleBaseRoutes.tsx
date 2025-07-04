import { Navigate } from "react-router-dom";
import { UseAuthentication } from "../utils/useAuthentication";

const RoleBaseRoutes: React.FC<{
  element: React.ReactNode;
  allowedRoles: string[];
}> = ({ element, allowedRoles }) => {
  const { user } = UseAuthentication();

  if (allowedRoles.includes(user.role)) {
    return <>{element}</>;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

export default RoleBaseRoutes;
