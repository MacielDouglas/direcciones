import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
  selectGroup,
  userIsAuthenticated,
  userSessionExpiry,
} from "../../store/selectors/userSelectors";

const PrivateRoute = () => {
  const group = useSelector(selectGroup);
  const isAuthenticated = useSelector(userIsAuthenticated);
  const expiryTimestamp = useSelector(userSessionExpiry);

  const redirectPath = useMemo(() => {
    // Verifica se a sessão expirou
    if (expiryTimestamp && expiryTimestamp <= Date.now()) {
      return "/login";
    }
    if (!isAuthenticated) return "/login";
    if (group === "0") return "/token";
    return null;
  }, [isAuthenticated, group, expiryTimestamp]);

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
