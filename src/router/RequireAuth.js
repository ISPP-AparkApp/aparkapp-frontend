
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isUserLogged } from "../store/session";

const RequireAuth = ({ children, fallback, requireAuth }) => {

  const userIsLogged = useSelector(isUserLogged)

  if ((requireAuth && !userIsLogged) || (!requireAuth && userIsLogged)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RequireAuth;
