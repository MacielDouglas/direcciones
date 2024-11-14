import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const user = useSelector((state) => state.user.userData);

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
