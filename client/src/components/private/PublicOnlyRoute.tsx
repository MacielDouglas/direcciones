import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  userIsAuthenticated,
  userSessionExpiry,
} from "../../store/selectors/userSelectors";

const PublicOnlyRoute = () => {
  const isAuthenticated = useSelector(userIsAuthenticated);
  const expiryTimestamp = useSelector(userSessionExpiry);

  // Considera o usuário como não autenticado se a sessão expirou
  const isReallyAuthenticated =
    isAuthenticated && (expiryTimestamp ? expiryTimestamp > Date.now() : false);

  return isReallyAuthenticated ? (
    <Navigate to="/" replace aria-label="Redirecionando usuário autenticado" />
  ) : (
    <Outlet />
  );
};

export default PublicOnlyRoute;
