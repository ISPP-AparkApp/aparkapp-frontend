
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux'

const userIsLogged = (username) => {
  return username;
};

const RequireAuth = ({ children, fallback, requireAuth }) => {
  const username = useSelector((state) => state.session.username)

  if ((requireAuth && !userIsLogged(username)) || (!requireAuth && userIsLogged(username))) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RequireAuth;
