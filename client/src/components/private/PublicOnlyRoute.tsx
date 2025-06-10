import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { userIsAuthenticated } from "../../store/selectors/userSelectors";

const PublicOnlyRoute = () => {
  const isAuthenticated = useSelector(userIsAuthenticated);

  return isAuthenticated ? (
    <Navigate to="/" replace aria-label="Redirecionando usuário autenticado" />
  ) : (
    <Outlet />
  );
};

export default PublicOnlyRoute;
