import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
  selectGroup,
  userIsAuthenticated,
} from "../../store/selectors/userSelectors";

const PrivateRoute = () => {
  const group = useSelector(selectGroup);
  const isAuthenticated = useSelector(userIsAuthenticated);

  const redirectPath = useMemo(() => {
    if (!isAuthenticated) return "/login";
    if (group === "0") return "/token";
    return null;
  }, [isAuthenticated, group]);

  return redirectPath ? (
    <Navigate
      to={redirectPath}
      replace
      aria-label="Redirecionando usuário não autorizado"
    />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
